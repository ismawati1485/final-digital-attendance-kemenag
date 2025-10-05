// src/hooks/useCameraLocation.ts
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Titik acuan BDK (pakai koordinat yang sudah kamu kasih)
const BDK = {
  latitude: -7.318139805365742,
  longitude: 112.7221159956511,
  radius: 200 // meter
};

const toRad = (deg: number) => (deg * Math.PI) / 180;
const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);
  const a = Math.sin(Δφ/2)**2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // meters
};

export const useCameraLocation = () => {
  // refs to connect with your existing UI elements
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const photoCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [photoProof, setPhotoProof] = useState<string>(""); // dataURL

  // location state
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocationValid, setIsLocationValid] = useState<boolean | null>(null);
  const [distanceToBDK, setDistanceToBDK] = useState<number | null>(null);

  // start camera (front)
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try { await videoRef.current.play(); } catch {}
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("startCamera err", err);
      toast.error("Gagal mengakses kamera. Periksa izin kamera.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // capture photo and store base64
  const capturePhoto = () => {
    if (!videoRef.current || !photoCanvasRef.current) return "";
    const video = videoRef.current;
    const canvas = photoCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 640;

    // optional: mirror so selfie looks natural
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    setPhotoProof(dataUrl);
    // stop camera automatically after capture (opsional)
    stopCamera();
    return dataUrl;
  };

  const clearPhoto = () => setPhotoProof("");

  // get current geolocation and validate distance
  const fetchLocation = () =>
    new Promise<void>((resolve) => {
      if (!("geolocation" in navigator)) {
        toast.error("Geolocation tidak didukung browser");
        setIsLocationValid(false);
        resolve();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setCurrentLocation({ lat, lng });

          const dist = haversine(lat, lng, BDK.latitude, BDK.longitude);
          setDistanceToBDK(dist);
          const valid = dist <= BDK.radius;
          setIsLocationValid(valid);

          if (!valid) {
            toast.error(`Anda berada ${Math.round(dist)}m dari BDK. Absensi hanya boleh dalam ${BDK.radius}m.`);
          } else {
            toast.success(`Lokasi valid (${Math.round(dist)}m dari BDK).`);
          }
          resolve();
        },
        (err) => {
          console.error("geolocation err", err);
          toast.error("Gagal mendapatkan lokasi. Pastikan izin lokasi aktif.");
          setIsLocationValid(false);
          resolve();
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });

  // optionally fetch location on mount
  useEffect(() => {
    fetchLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  return {
    videoRef,
    photoCanvasRef,
    isCameraActive,
    photoProof,
    startCamera,
    stopCamera,
    capturePhoto,
    clearPhoto,
    currentLocation,
    isLocationValid,
    distanceToBDK,
    fetchLocation
  } as const;
};
