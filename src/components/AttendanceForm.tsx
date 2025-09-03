import React, { useState, useEffect } from 'react'; 
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Clock, MapPin, User, AlertCircle, CheckCircle, PenTool } from 'lucide-react';
import SignatureCanvas from '@/components/SignatureCanvas';
import SearchableNameDropdown from '@/components/SearchableNameDropdown';
import { jabatan } from '@/content/jabatan';
import { Employee } from '@/content/employees';
import { texts } from '@/content/texts';
import { supabase } from '@/lib/supabaseClient';
import { set } from 'date-fns';
import { useNavigate } from 'react-router-dom'; 
import { start } from 'repl';


interface Meeting {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  leader: string;
  description: string;
  notes: string;
}



const AttendanceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);

  const [attendeeData, setAttendeeData] = useState({
    name: '',
    email: '',
    jabatan: '',
    nip: '',
    phone: ''
  });

  const [signature, setSignature] = useState('');
  const [isLate, setIsLate] = useState(false);
  const [lateMinutes, setLateMinutes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAttended, setIsAttended] = useState(false);
  
useEffect(() => {
  const fetchMeeting = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("agenda_rapat")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      console.error("Meeting not found:", error?.message);
      setMeeting(null);
      return;
    }

    setMeeting({
      id: data.id,
      title: data.title,
      date: data.date,
      startTime: data.start_time,
      endTime: data.end_time,
      location: data.location,
      leader: data.leader,
      description: data.description,
      notes: data.notes,
    });

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const meetingDate = data.date;

    // 1️⃣ Cek hari rapat
    if (today !== meetingDate) {
      toast({
        title: "Absensi Ditutup",
        description: "Peserta tidak bisa melakukan absensi di luar hari rapat.",
        variant: "destructive",
        className: "bg-red-500 text-white text-sm border-none",
      });
      return;
    }

    // 2️⃣ Ambil jam mulai & selesai
    const [startHour, startMin] = data.start_time.split(":").map(Number);
    const [endHour, endMin] = data.end_time.split(":").map(Number);

    const startTime = new Date(data.date);
    startTime.setHours(startHour, startMin, 0);

    const endTime = new Date(data.date);
    endTime.setHours(endHour, endMin, 0);

    // 3️⃣ Sebelum jam mulai
    if (now < startTime) {
      toast({
        title: "Rapat Belum Dibuka",
        description: "Rapat belum dibuka, anda tidak dapat melakukan absensi.",
        variant: "destructive",
        className: "bg-yellow-500 text-white text-sm border-none",
      });
      return;
    }

    // 4️⃣ Di jam rapat → Tepat waktu
    if (now >= startTime && now <= endTime) {
      setIsLate(false);
      setLateMinutes(0);
      return;
    }

    // 5️⃣ Lewat jam rapat tapi masih di hari yang sama → Terlambat
    if (now > endTime) {
      const diffMinutes = Math.floor((now.getTime() - endTime.getTime()) / 60000);
      setIsLate(true);
      setLateMinutes(diffMinutes);
    }
  };

  fetchMeeting();
}, [id]);



  const handleEmployeeSelect = (employee: Employee) => {
    setAttendeeData({
      name: employee.name,
      email: employee.email || '',
      jabatan: employee.jabatan || '',
      nip: '',
      phone: employee.phone || ''

    });
  };

  const handleEmployeeClear = () => {
    setAttendeeData({
      name: '',
      email: '',
      jabatan: '',
      nip: '',
      phone: ''
    });
  };

  const handleJabatanChange = (value: string) => {
    setAttendeeData(prev => ({
      ...prev,
      jabatan: value
    }));
  };

const handleSubmit = async () => {
  if (
    !attendeeData.name.trim() ||
    !attendeeData.email.trim() ||
    !attendeeData.jabatan.trim() ||
    !attendeeData.nip.trim() ||
    !attendeeData.phone.trim()
  ) {
    toast({
      title: 'Error',
      description: texts.errors.requiredFields || 'Semua field wajib diisi.',
      variant: 'destructive',
    });
    return;
  }

  //  Validasi tanda tangan
  if (!signature || signature.trim() === "") {
    toast({
      title: 'Error',
      description: texts.errors.signatureRequired || 'Tanda tangan harus diisi.',
      variant: 'destructive',
    });
    return;
  }

  setIsSubmitting(true);

  // Kirim data ke Supabase
  const { error } = await supabase.from('attendees').insert([
    {
      meeting_id: id,
      name: attendeeData.name,
      email: attendeeData.email,
      jabatan: attendeeData.jabatan,
      nip: attendeeData.nip,
      phone: attendeeData.phone,
      checkInTime: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, }),
      isLate: isLate,
      lateMinutes,
      signature,
    },
  ]);

  setIsSubmitting(false);

  if (error) {
    toast({
      title: 'Gagal Menyimpan Absensi',
      description: error.message,
      variant: 'destructive',
    });
    return;
  }

  setIsAttended(true);

  // Reset form setelah sukses
  setTimeout(() => {
    setAttendeeData({
      name: '',
      email: '',
      jabatan: '',
      nip: '',
      phone: '',
    });
    setSignature('');
    setIsAttended(false);
  }, 3000);

  toast({
    title: texts.attendance.successTitle || 'Absensi berhasil!',
    description: isLate
      ? texts.attendance.lateMessage.replace('{minutes}', lateMinutes.toString())
      : texts.attendance.successDesc || 'Terima kasih sudah hadir.',
    variant: isLate ? 'destructive' : 'default',
  });
};


  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Rapat tidak ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/attendance")} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-black">Absensi Rapat</h1>
              
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6 bg-white/70 backdrop-blur-sm border-white/30 text-black">
          <CardHeader>
            <CardTitle>{meeting.title}</CardTitle>
            <CardDescription>{meeting.description}</CardDescription>
          </CardHeader>
          <CardContent>
                            <p className="flex items-center space-x-3 p-4  rounded-lg">
                                <Calendar className="w-8 h-8 text-blue-600" />
                            <p className="text-sm black">Tanggal</p>
                                  <p className="font-semibold text-black">{meeting.date}</p>
                            </p>
                            <p className="flex items-center space-x-3 p-4  rounded-lg">
                            <Clock className="w-8 h-8 text-blue-600" />
                            <p className="text-sm text-black">Waktu</p>
                            <p className="font-semibold text-black">{meeting.startTime} - {meeting.endTime}</p>
                            </p>
                            <p className="flex items-center space-x-3 p-4  rounded-lg">
                            <MapPin className="w-8 h-8 text-blue-600" />
                            <p className="text-sm text-black">Lokasi</p>
                            <p className="font-semibold text-black">{meeting.location}</p>
                            </p>
                            <p className="flex items-center space-x-3 p-4  rounded-lg">
                            <User className="w-8 h-8 text-blue-600" />
                            <p className="text-sm text-black">Peserta</p>
                            <p className="font-semibold text-black">{meeting.leader}</p>
                            </p>

          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-white/30 text-black">
          <CardHeader>
            <CardTitle>Form Kehadiran</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
              <div>
                <Label htmlFor="name">Nama</Label>
                <SearchableNameDropdown
                  value={attendeeData.name}
                  onSelect={handleEmployeeSelect}
                  onClear={handleEmployeeClear}
                  onManualInput={(name) => setAttendeeData(prev => ({ ...prev, name }))}
                  
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={attendeeData.email}
                  onChange={(e) => setAttendeeData({ ...attendeeData, email: e.target.value })}
                  placeholder="Email"
                  className="bg-white/80 text-black"
                />
              </div>
              <div>
                <Label htmlFor="jabatan">Jabatan</Label>
                <Select value={attendeeData.jabatan} onValueChange={handleJabatanChange}>
                  <SelectTrigger className="bg-white/80 text-black">
                    <SelectValue placeholder="Pilih Jabatan" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 text-black">
                    {jabatan.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nip">NIP</Label>
                <Input
                  id="nip"
                  type="text"
                  value={attendeeData.nip}
                  onChange={(e) => setAttendeeData({ ...attendeeData, nip: e.target.value })}
                  placeholder="NIP"
                  className="bg-white/80 text-black"
                />
              </div>
              <div>
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  value={attendeeData.phone}
                  onChange={(e) => setAttendeeData({ ...attendeeData, phone: e.target.value })}
                  placeholder="08xxxx"
                  className="bg-white/80 text-black"
                />
              </div>
            </div>

            <div>
              <Label>Tanda Tangan</Label>
              <SignatureCanvas onSignatureChange={setSignature} signature={signature} />
            </div>

            <div className="text-center">
              <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-green-700 text-white rounded-lg px-4 py-2 text-sm hover:bg-green-700 focus:bg-green-700 active:bg-green-700 focus:outline-none">
                {isSubmitting ? "Menyimpan..." : "Kirim Absensi"}
              </Button>
              {isLate && (
                <p className="mt-2 text-sm text-red-600">
                  Kamu terlambat {lateMinutes} menit
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceForm;