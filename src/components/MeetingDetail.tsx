import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Users, Clock, MapPin, User, FileText, Download, Edit, Trash2, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { set } from 'date-fns';

interface Meeting {
  id: string;
  title: string;
  date: string;
  start_time: string;
  end_time: string;
  location: string;
  leader: string;
  description: string;
  notes: string;
  maxParticipants: number;
  attendees: Attendee[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

interface Attendee {
  id: string;
  name: string;
  email: string;
  jabatan: string;
  nip: string
  checkInTime: string;
  isLate: boolean;
  lateMinutes: number;
  signature: string;
}

const MeetingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  console.log("Meeting ID from params:", id);

  const fetchMeeting= async () => {
  if (!id) return; 

  const { data, error } = await supabase
    .from("agenda_rapat")
    .select("*")
    .eq("id", id)
    .single()
   
    console.log("meeting detail fetch result:", { data, error });
   
    if (error) {
      console.error("Error fetching meeting:", error);
      toast({
        title: "Gagal Memuat Detail Rapat",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMeeting(data);
    }
  };
  
  const fetchAttendees = async () => {
    if (!id) return;

    const { data, error } = await supabase
      .from("attendees")
      .select("*")
      .eq("meeting_id", id);

    console.log("Supabase fetch result:", { data, error });

    if (error) {
      toast({
        title: "Gagal Memuat Kehadiran",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setAttendees(data);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchMeeting();
    fetchAttendees();

  const channel = supabase
    .channel('realtime-attendees')
    .on('postgres_changes', 
      { event: '*', 
        schema: 'public', 
        table: 'attendees', 
        filter: `meeting_id=eq.${id}` 
      }, 
      (payload) => {
        console.log('Realtime change on attendees:', payload);
        fetchAttendees();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [id]);


  const handleUpdateMeeting = (updatedMeeting: Meeting) => {
    setMeeting(updatedMeeting);
    toast({
      title: "Sukses!",
      description: "Rapat berhasil diperbarui"
    });
  };

  const handleDeleteMeeting = () => {
    toast({
      title: "Sukses!",
      description: "Rapat berhasil dihapus"
    });
    navigate('/admin');
  };
const exportToPDF = () => {
  if (!meeting) return;

  const printContent = `
    <html>
      <head>
        <title>Laporan Kehadiran - ${meeting.title}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 16px; }
          .header { text-align: center; margin-bottom: 30px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          .info-item { padding: 5px 0; }
          .info-label { font-weight: bold; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          th { background-color: #f2f2f2; font-weight: bold; }
          <th style="width:140px;">Tanda Tangan</th>
          .signature-cell { text-align: center; }
          .signature-img {display:block; margin:auto; border:none; max-width: 250px; max-height: 100px; solid #ccc; }
          .footer { margin-top: 30px; font-size: 12px; color: #666; display: flex; justify-content: space-between; }
          .footer-left { text-align: left; }
          .footer-right {
            text-align: right;
            white-space: pre-wrap;
          }
          .underline {
            text-decoration: underline;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Daftar Hadir Rapat</h1>
          <h1>${meeting.title}</h1>
        </div>

        <div class="meeting-info">
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Tanggal:</span> ${meeting.date}
            </div>
            <div class="info-item">
              <span class="info-label">Tempat:</span> ${meeting.location}
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>NIP</th>
                <th>Jabatan</th>
                <th>Tanda Tangan</th>
              </tr>
            </thead>
            <tbody>
              ${attendees.map((attendee, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${attendee.name}</td>
                  <td>${attendee.nip}</td>
                  <td>${attendee.jabatan}</td>
                  <td class="signature-cell">
                    ${attendee.signature ? 
                      `<img src="${attendee.signature}" alt="Tanda Tangan ${attendee.name}" class="signature-img" />` : 
                      'Tidak Ada'
                    }
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          
            <div class="footer-right">
              Surabaya, ${new Date().toLocaleDateString('id-ID')}
              <br>
              <span className="block">Mengetahui </span>
              <span className="block">Kasubbag TU BDK Surabaya</span>
              <br>
              <br>
              <span class="underline">Dr. H. Muslimin, M.M</span>
              NIP. 197210102003121011
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
};


  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { text: 'Terjadwal', color: 'border border-blue-600 text-blue-600 bg-white' },
      ongoing: { text: 'Berlangsung', color: 'bg-green-100 text-green-600' },
      completed: { text: 'Selesai', color: 'bg-gray-100 text-gray-600' },
      cancelled: { text: 'Dibatalkan', color: 'bg-red-100 text-red-600' }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  if (!meeting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600 mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/30 shadow-md shadow-black/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/admin')} className="p-2 bg-white text-black hover:bg-gray-100 hover:text-black">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Detail Rapat
                </h1>
                <p className="text-gray-600">{meeting.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
          <div className="w-24" /> {/* Placeholder agar layout tetap stabil */}
  

          <Button 
          onClick={handleDeleteMeeting}
          className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700"
          >
          <Trash2 className="w-4 h-4 mr-2" />
          Hapus
          </Button>
          </div>

          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 gap-x-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg shadow-black-200 ">
            <TabsTrigger value="overview" className= "text-black data-[state=active]:bg-green-700 data-[state=active]:text-white rounded-md transition px-1 py-1" >Overview</TabsTrigger>
            <TabsTrigger value="attendance"className= "text-black data-[state=active]:bg-green-700 data-[state=active]:text-white rounded-md transition">Real-time Attandance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white border-white/30 shadow-lg shadow-black-700">
              <CardHeader>
               <div className="flex justify-between items-center mb-4">
                <CardTitle className="text-xl text-black">{meeting.title}</CardTitle>
                <Button
                onClick={exportToPDF}
                className="bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-700 flex items-center px-3 py-1 rounded-md text-sm"
  >
                <FileText className="w-4 h-4 mr-2" />
                  Export PDF
                </Button>
                </div>
                <CardDescription className="text-gray-700">{meeting.description}</CardDescription>

              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="flex items-center space-x-3 p-4  rounded-lg">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tanggal</p>
                      <p className="font-semibold text-black">{meeting.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4  rounded-lg">
                    <Clock className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Waktu</p>
                      <p className="font-semibold text-black">{meeting.start_time} - {meeting.end_time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4  rounded-lg">
                    <MapPin className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Lokasi</p>
                      <p className="font-semibold text-black">{meeting.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 rounded-lg">
                    <User className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Pemimpin</p>
                      <p className="font-semibold text-black">{meeting.leader}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-100 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{attendees.length}</div>
                    <div className="text-sm text-gray-600">Hadir</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-100 rounded-lg">
                    <div className="text-3xl font-bold text-orange-600">{meeting.maxParticipants - attendees.length}</div>
                    <div className="text-sm text-gray-600">Belum Hadir</div>
                  </div>
                  <div className="text-center p-4 bg-red-100 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">{attendees.filter(a => a.isLate).length}</div>
                    <div className="text-sm text-gray-600">Terlambat</div>
                  </div>
                </div>

                {meeting.notes && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2 text-black">Catatan:</h4>
                    <p className="text-gray-700">{meeting.notes}</p>
                  </div>
                )}
                    
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {((attendees.length / meeting.maxParticipants) * 100).toFixed(0)}%
                    </div>
                    <div className="text-sm text-gray-600 ">Tingkat Kehadiran</div>
                  </div>
                  <div className="text-center p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {attendees.filter(a => !a.isLate).length}
                    </div>
                    <div className="text-sm text-gray-600">Tepat Waktu</div>
                  </div>
                  <div className="text-center p-4  rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {attendees.filter(a => a.isLate).length}
                    </div>
                    <div className="text-sm text-gray-600">Terlambat</div>
                  </div>
                  <div className="text-center p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {attendees.length > 0 
                        ? Math.round(attendees.filter(a => a.isLate).reduce((acc, a) => acc + a.lateMinutes, 0) / attendees.filter(a => a.isLate).length) || 0
                        : 0
                      }
                    </div>
                    <div className="text-sm text-gray-600">Rata-rata Terlambat (menit)</div>
                  </div>
                </div>
              </CardContent>
              </Card>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-white/30 text-black">
              <CardHeader>
                <CardTitle>Monitor Kehadiran Real-time</CardTitle>
                <CardDescription className="text-gray-700">
                  Pantau kehadiran peserta secara langsung dengan tanda tangan digital
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-green-100 hover:bg-green-100 shadow-lg shadow-black-200">
                        <TableHead className="text-center text-black">Nama</TableHead>
                        <TableHead className="text-center text-black">Email</TableHead>
                        <TableHead className="text-center text-black">NIP</TableHead>
                        <TableHead className="text-center text-black">Jabatan</TableHead>
                        <TableHead className="text-center text-black">Waktu Hadir</TableHead>
                        <TableHead className="text-center text-black">Status</TableHead>
                        <TableHead className="text-center text-black">Terlambat</TableHead>
                        <TableHead className="text-center text-black">Tanda Tangan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendees.map((attendee) => (
                        <TableRow key={attendee.id} className="hover:bg-white/50">
                          <TableCell className="font-medium text-gray-600">{attendee.name}</TableCell>
                          <TableCell className="text-gray-600">{attendee.email}</TableCell>
                          <TableCell className="text-gray-600">{attendee.nip}</TableCell>
                          <TableCell className="text-gray-600">{attendee.jabatan}</TableCell>
                          <TableCell className="text-gray-600">{attendee.checkInTime}</TableCell>
                          <TableCell>
                            {attendee.isLate ? (
                              <Badge className="bg-red-100 text-red-600 border border-red-200">Terlambat</Badge>
                            ) : (
                              <Badge className="text-green-600 border-green-600 border">
                                Tepat Waktu
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {attendee.isLate ? `${attendee.lateMinutes} menit` : '-'}
                                      </TableCell>
                          <TableCell className="text-center">
                            {attendee.signature ? (
                              <div className="flex items-center justify-center space-x-2">
                                <img 
                                  src={attendee.signature} 
                                  alt={`Tanda tangan ${attendee.name}`}
                                  className="max-w-20 max-h-10 border border-gray-600 rounded bg-white"
                                />
                                <Button variant="ghost" size="sm" className="p-1">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Tidak ada</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {attendees.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">Belum ada peserta yang hadir</p>
                    <p className="text-sm">Peserta akan muncul di sini setelah melakukan absensi</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  </div>
  );
};

       export default MeetingDetail;
