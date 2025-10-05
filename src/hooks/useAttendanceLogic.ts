// src/hooks/useAttendanceLogic.ts
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Konfigurasi titik BDK (gunakan yang sudah kamu berikan)
const BDK_LOCATION = {
  latitude: -7.318139805365742,
  longitude: 112.7221159956511,
  radius: 200 // meters
};

export type MeetingItem = any; // sesuaikan tipe kalau mau

export const useAttendanceLogic = () => {
  // Refs untuk kamera & canvas (kamu akan hubungkan ke elemen UI)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const signatureCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // State utama (logika) — UI-mu hanya perlu membaca / memanggil handler
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoProof, setPhotoProof] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocationValid, setIsLocationValid] = useState<boolean | null>(null);
  const [availableMeetings, setAvailableMeetings] = useState<MeetingItem[]>([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>("");
  const [attendanceStatus, setAttendanceStatus] = useState<"on-time" | "late" | null>(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ---------- Helpers ----------
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ---------- Load meetings ----------
  useEffect(() => {
    const fetchMeetings = async () => {
      const { data, error } = await supabase
        .from("meetings")
        .select("*")
        .order("start_date", { ascending: true });

      if (error) {
        console.error("Error fetching meetings:", error);
        toast.error("Gagal memuat data rapat");
        return;
      }

      // sedikit kategorisasi (sama seperti di code Lovable)
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentTime = now.toTimeString().split(" ")[0].substring(0, 5);

      const categorizedMeetings = (data || []).map((meeting: any) => {
        let displayStatus = "scheduled";
        let canAttend = false;

        if (meeting.status === "cancelled") {
          displayStatus = "cancelled";
        } else if (meeting.start_date < currentDate) {
          displayStatus = "completed";
        } else if (meeting.start_date === currentDate) {
          if (currentTime >= meeting.start_time && (!meeting.end_time || currentTime <= meeting.end_time)) {
            displayStatus = "ongoing";
            canAttend = true;
          } else if (currentTime > (meeting.end_time || "23:59")) {
            displayStatus = "completed";
          } else {
            displayStatus = "scheduled";
            canAttend = true;
          }
        } else {
          displayStatus = "scheduled";
        }

        return {
          ...meeting,
          displayStatus,
          canAttend
        };
      });

      setAvailableMeetings(categorizedMeetings);
    };

    fetchMeetings();
  }, []);

  // ---------- Update attendanceStatus when meeting changes ----------
  useEffect(() => {
    if (selectedMeetingId) {
      const selectedMeeting = availableMeetings.find((m) => m.id === selectedMeetingId);
      if (selectedMeeting) {
        const now = new Date();
        const meetingStart = new Date(`${selectedMeeting.start_date}T${selectedMeeting.start_time}`);
        setAttendanceStatus(now > meetingStart ? "late" : "on-time");
      }
    } else {
      setAttendanceStatus(null);
    }
  }, [selectedMeetingId, availableMeetings]);

  // ---------- Get initial geolocation ----------
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });

          const distance = calculateDistance(latitude, longitude, BDK_LOCATION.latitude, BDK_LOCATION.longitude);
          const valid = distance <= BDK_LOCATION.radius;
          setIsLocationValid(valid);

          if (!valid) {
            toast.error(`Anda berada ${Math.round(distance)}m dari BDK. Absensi hanya dapat dilakukan dalam radius ${BDK_LOCATION.radius}m dari Balai Diklat Keagamaan.`);
          } else {
            toast.success(`Lokasi terdeteksi. Anda berada ${Math.round(distance)}m dari BDK.`);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Gagal mendapatkan lokasi. Pastikan izin lokasi diaktifkan.");
          setIsLocationValid(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      toast.error("Browser tidak mendukung geolocation");
      setIsLocationValid(false);
    }
  }, []);

  // ---------- Kamera: start / stop / capture ----------
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch {}
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Gagal mengakses kamera. Pastikan izin kamera diaktifkan.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !photoCanvasRef.current) return;
    const canvas = photoCanvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;
    // optional mirror for selfie
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const photoData = canvas.toDataURL("image/jpeg", 0.85);
    setPhotoProof(photoData);
    stopCamera();
    toast.success("Foto berhasil diambil!");
  };

  // ---------- Signature helpers ----------
  const saveSignatureFromCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    setSignatureDataUrl(canvas.toDataURL());
  };

  const clearSignatureCanvas = () => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl("");
  };

  // ---------- Submit attendance ----------
  const submitAttendance = async (payload: {
    meetingId: string;
    name: string;
    nip: string;
    position?: string;
    department?: string;
    phone?: string;
  }) => {
    // basic validations (UI juga harus mencegah submit)
    if (!payload.name || !payload.nip || !signatureDataUrl || !photoProof || !currentLocation || isLocationValid === false) {
      toast.error("Lengkapi data dan pastikan lokasi & foto valid.");
      return { success: false };
    }

    // check selected meeting
    const selectedMeeting = availableMeetings.find((m) => m.id === payload.meetingId);
    if (!selectedMeeting) {
      toast.error("Rapat yang dipilih tidak valid!");
      return { success: false };
    }
    if (!selectedMeeting.canAttend) {
      toast.error("Rapat ini sudah selesai atau dibatalkan!");
      return { success: false };
    }

    setIsSubmitting(true);
    try {
      const now = new Date();
      const meetingStart = new Date(`${selectedMeeting.start_date}T${selectedMeeting.start_time}`);
      const lateMinutes = Math.max(0, Math.floor((now.getTime() - meetingStart.getTime()) / (1000 * 60)));

      const { data, error } = await supabase
        .from("attendances")
        .insert({
          meeting_id: selectedMeeting.id,
          name: payload.name,
          nip: payload.nip,
          position: payload.position || null,
          department: payload.department || null,
          phone: payload.phone || null,
          signature: signatureDataUrl,
          photo_proof: photoProof,
          latitude: currentLocation!.lat,
          longitude: currentLocation!.lng,
          status: attendanceStatus || "on-time",
          late_minutes: lateMinutes
        })
        .select();

      if (error) {
        console.error("Error saving attendance:", error);
        toast.error("Gagal menyimpan absensi: " + error.message);
        return { success: false };
      }

      toast.success(lateMinutes > 0 ? `Absensi berhasil! Terlambat ${lateMinutes} menit.` : "Absensi berhasil! Tepat waktu.");
      // reset minimal (UI juga bisa reset)
      setPhotoProof("");
      clearSignatureCanvas();
      setSelectedMeetingId("");
      return { success: true, data };
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("Terjadi kesalahan saat menyimpan absensi");
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- Cleanup on unmount ----------
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Return everything yang UI perlukan
  return {
    // refs
    videoRef,
    photoCanvasRef,
    signatureCanvasRef,

    // state
    isCameraActive,
    photoProof,
    currentLocation,
    isLocationValid,
    availableMeetings,
    selectedMeetingId,
    setSelectedMeetingId,
    attendanceStatus,
    signatureDataUrl,
    isSubmitting,

    // handlers
    startCamera,
    stopCamera,
    capturePhoto,
    saveSignatureFromCanvas,
    clearSignatureCanvas,
    submitAttendance
  } as const;
};
