import React, { useState, useCallback, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Users,
  Eye,
  Download,
  FileText,
  Calendar,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import CreateMeetingDialog from "./CreateMeetingDialog";
import EditMeetingDialog from "./EditMeetingDialog";
import StatsDashboard from "./StatsDashboard";
import SearchFilter from "./SearchFilter";
import LoadingState from "./LoadingState";
import PrintableLayout from "./PrintableLayout";
import { useMeetingFilters } from "@/hooks/useMeetingFilters";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

interface Attendee {
  id: string;
  name: string;
  email: string;
}

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
  maxParticipants: number;
  attendees: Attendee[];
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  createdAt: string;
}

interface AdminPanelProps {
  onBack: () => void;
}
function calculateMeetingStatus(meeting) {
  const now = new Date();
  const meetingDate = new Date(meeting.date);
  const startTime = meeting.startTime ? meeting.startTime : "00:00:00";
  const endTime = meeting.endTime ? meeting.endTime : "23:59:59";

  const startDateTime = new Date(`${meeting.date}T${startTime}`);
  const endDateTime = new Date(`${meeting.date}T${endTime}`);

  if (now < startDateTime) return "scheduled";
  if (now >= startDateTime && now <= endDateTime) return "ongoing";
  if (now > endDateTime) return "completed";
  return "scheduled";
}

const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Use the custom hook for filters
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    leaderFilter,
    setLeaderFilter,
    locationFilter,
    setLocationFilter,
    filteredMeetings,
    clearFilters,
    leaders,
    locations,
  } = useMeetingFilters(meetings);

  const handleCreateMeeting = useCallback(async (newMeeting: Meeting) => {
  setIsLoading(true);

  const { error } = await supabase.from("agenda_rapat").insert({
    title: newMeeting.title,
    date: newMeeting.date,
    start_time: newMeeting.startTime,
    end_time: newMeeting.endTime,
    location: newMeeting.location,
    leader: newMeeting.leader,
    description: newMeeting.description,
    notes: newMeeting.notes,
    max_participants: newMeeting.maxParticipants,
    status: newMeeting.status,
    attendees: newMeeting.attendees,
  });

  if (error) {
    toast({
      title: "Gagal Membuat Rapat",
      description: error.message,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Rapat Berhasil Dibuat",
      description: "Rapat baru telah ditambahkan ke daftar agenda.",
    });
    setIsCreateDialogOpen(false);
    // refresh
    const { data } = await supabase.from("agenda_rapat").select("*");
    setMeetings(data as Meeting[]);
  }

  setIsLoading(false);
}, []);

const handleUpdateMeeting = useCallback(async (updatedMeeting: Meeting) => {
  setIsLoading(true);

  const { error } = await supabase
    .from("agenda_rapat")
    .update({
      title: updatedMeeting.title,
      date: updatedMeeting.date,
      start_time: updatedMeeting.startTime,
      end_time: updatedMeeting.endTime,
      location: updatedMeeting.location,
      leader: updatedMeeting.leader,
      description: updatedMeeting.description,
      notes: updatedMeeting.notes,
      max_participants: updatedMeeting.maxParticipants,
      status: updatedMeeting.status,
      attendees: updatedMeeting.attendees,
    })
    .eq("id", updatedMeeting.id);

  if (error) {
    toast({
      title: "Gagal Mengupdate Rapat",
      description: error.message,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Rapat Berhasil Diperbarui",
      description: "Informasi rapat telah berhasil diperbarui.",
    });
    setEditingMeeting(null);
    const { data } = await supabase.from("agenda_rapat").select("*");
    setMeetings(data as Meeting[]);
  }

  setIsLoading(false);
}, []);


const handleDeleteMeeting = useCallback(async (id: string) => {
  setIsLoading(true);

  const { error } = await supabase
    .from("agenda_rapat")
    .delete()
    .eq("id", id);

  if (error) {
    toast({
      title: "Gagal Menghapus Rapat",
      description: error.message,
      variant: "destructive",
    });
  } else {
    toast({
      title: "Rapat Berhasil Dihapus",
      description: "Rapat telah dihapus dari daftar agenda.",
    });
    const { data } = await supabase.from("agenda_rapat").select("*");
    setMeetings(data as Meeting[]);
  }

  setIsLoading(false);
}, []);

const fetchAttendeesByMeeting = async (meetingId) => {
  const {data, error} = await supabase
    .from ('attendees')
    .select('*')
    .eq('meeting_id', meetingId);

  if (error) {
    console.error("Gagal mengambil attendees:", error.message);
    return [];
  }
  return data;
};

useEffect(() => {
  const fetchMeetings = async () => {
    setIsLoading(true);

      const {data: meetingsData, error:MeetingsError} = await supabase
        .from('agenda_rapat')
        .select('*')

        if (MeetingsError) {
          toast({
            title: "Gagal Memuat Rapat",
            description: MeetingsError.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        //ambil semua data dan grup by meeting_id
        const {data: allAttendees, error: attendeesError} = await supabase
        .from('attendees')
        .select('*');

      if (attendeesError) {
        toast({
          title: "Gagal Memuat Data Peserta",
          description: attendeesError.message,
          variant: "destructive",
        });
          setIsLoading(false);
        return;
      }

      //mapping attendees to meetings
      const meetingsWithAttendees = meetingsData.map((meeting: any) => {
        const attendeesForMeeting = allAttendees.filter(
          (attendee) => attendee.meeting_id === meeting.id
        );

        return {
          ...meeting,
          startTime: meeting.start_time,
          endTime: meeting.end_time,
          attendees: attendeesForMeeting,
        };
      });
      const statusOrder ={
        ongoing :0 ,
        scheduled: 1,
        completed: 2,
        cancelled: 3,
      };
      meetingsWithAttendees.sort((a, b) => {
        const statusA = calculateMeetingStatus(a);
        const statusB = calculateMeetingStatus(b);
        return statusOrder[statusA] - statusOrder[statusB];
      });
            setMeetings(meetingsWithAttendees);
            setIsLoading(false);
    };
    fetchMeetings();
  }, []);

  console.log("meetingsData", meetings);
    
  const handlePrint = useCallback(() => {
    // Create a new window with print content
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const printContent = document.querySelector(".print-content");
      if (printContent) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Laporan Rapat - ${new Date().toLocaleDateString(
                "id-ID"
              )}</title>
              <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                @media print {
                  * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                  body { font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.5; color: #000; }
                  .print-header { margin-bottom: 20px; }
                  .print-content { margin: 0; }
                  .print-footer { margin-top: 20px; }
                  .break-inside-avoid { break-inside: avoid; page-break-inside: avoid; }
                  .grid { display: grid; }
                  .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
                  .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
                  .gap-4 { gap: 1rem; }
                  .text-center { text-align: center; }
                  .text-lg { font-size: 1.125rem; }
                  .text-xl { font-size: 1.25rem; }
                  .text-2xl { font-size: 1.5rem; }
                  .text-sm { font-size: 0.875rem; }
                  .text-xs { font-size: 0.75rem; }
                  .font-bold { font-weight: 700; }
                  .font-semibold { font-weight: 600; }
                  .font-medium { font-weight: 500; }
                  .mb-2 { margin-bottom: 0.5rem; }
                  .mb-3 { margin-bottom: 0.75rem; }
                  .mb-4 { margin-bottom: 1rem; }
                  .mb-6 { margin-bottom: 1.5rem; }
                  .mb-8 { margin-bottom: 2rem; }
                  .mt-8 { margin-top: 2rem; }
                  .pt-4 { padding-top: 1rem; }
                  .p-3 { padding: 0.75rem; }
                  .p-4 { padding: 1rem; }
                  .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
                  .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                  .mr-1 { margin-right: 0.25rem; }
                  .mr-2 { margin-right: 0.5rem; }
                  .border { border: 1px solid #d1d5db; }
                  .border-t { border-top: 1px solid #d1d5db; }
                  .rounded { border-radius: 0.375rem; }
                  .rounded-lg { border-radius: 0.5rem; }
                  .bg-green-100 { background-color: #dcfce7; }
                  .bg-blue-100 { background-color: #dbeafe; }
                  .bg-red-100 { background-color: #fee2e2; }
                  .bg-gray-100 { background-color: #f3f4f6; }
                  .text-green-800 { color: #166534; }
                  .text-blue-800 { color: #1e40af; }
                  .text-red-800 { color: #991b1b; }
                  .text-gray-800 { color: #1f2937; }
                  .text-gray-900 { color: #111827; }
                  .text-gray-700 { color: #374151; }
                  .text-gray-600 { color: #4b5563; }
                  .text-gray-500 { color: #6b7280; }
                  .space-y-4 > * + * { margin-top: 1rem; }
                  .flex { display: flex; }
                  .items-center { align-items: center; }
                  .items-start { align-items: flex-start; }
                  .justify-between { justify-content: space-between; }
                  .flex-1 { flex: 1 1 0%; }
                }
              </style>
            </head>
            <body>
              ${document.querySelector(".print-only")?.outerHTML || ""}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      }
    }

    toast({
      title: "Print Dimulai",
      description:
        "Jendela print telah dibuka. Silakan pilih printer dan pengaturan yang diinginkan.",
    });
  }, []);

  const exportToCSV = useCallback(() => {
    const csvContent = [
      [
        "Judul",
        "Tanggal",
        "Waktu",
        "Lokasi",
        "Pemimpin",
        "Status",
        "Peserta",
      ].join(","),
      ...filteredMeetings.map((meeting) =>
        [
          `"${meeting.title}"`,
          meeting.date,
          `"${meeting.startTime} - ${meeting.endTime}"`,
          `"${meeting.location}"`,
          `"${meeting.leader}"`,
          calculateMeetingStatus,
          meeting.attendees.length,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meetings-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export Berhasil",
      description: "Data rapat berhasil diexport ke CSV",
    });
  }, [filteredMeetings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={onBack} className="p-2">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-bold text-government">
                  Admin Panel
                </h1>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-6">
          <LoadingState type="card" count={6} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-professional-bg">
      {/* Print Layout (hidden on screen) */}
      <div className="hidden">
        <div className="print-content">
          <PrintableLayout
            meetings={filteredMeetings}
            title="Laporan Daftar Rapat"
          />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50 no-print">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="p-2 focus:outline-none focus:ring-green-200 focus-visible:ring-0"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-green-700">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Kelola agenda rapat dan monitor kehadiran
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={exportToCSV} variant="outline" size="sm" className="hover:bg-gradient-to-br from-green-50 to-green-100">
                <FileText className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-green-700 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Buat Rapat
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Dashboard */}
        <StatsDashboard meetings={meetings} />


        {/* Search and Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          dateFilter={dateFilter}
          onDateFilterChange={setDateFilter}
          leaderFilter={leaderFilter}
          onLeaderFilterChange={setLeaderFilter}
          locationFilter={locationFilter}
          onLocationFilterChange={setLocationFilter}
          onClearFilters={clearFilters}
          onPrint={handlePrint}
          resultCount={filteredMeetings.length}
          totalCount={meetings.length}
          leaders={leaders}
          locations={locations}
        />

        {/* Meetings Grid */}
        {filteredMeetings.length === 0 ? (
          <Card className="professional-card">
            <CardContent className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Tidak Ada Rapat
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ||
                statusFilter !== "all" ||
                dateFilter !== "all" ||
                leaderFilter !== "all" ||
                locationFilter !== "all"
                  ? "Tidak ada rapat yang sesuai dengan filter yang dipilih."
                  : "Belum ada rapat yang dibuat. Mulai dengan membuat rapat baru."}
              </p>
              {searchTerm ||
              statusFilter !== "all" ||
              dateFilter !== "all" ||
              leaderFilter !== "all" ||
              locationFilter !== "all" ? (
                <Button onClick={clearFilters} variant="outline">
                  Reset Filter
                </Button>
              ) : (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-government hover:bg-government-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Rapat Pertama
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMeetings.map((meeting) => (
              <Card
                key={meeting.id}
                className="bg-cream border-2 border-green-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-government transition-colors text-black">
                        {meeting.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2 text-black">
                        {meeting.description}
                      </CardDescription>
                    </div>
                    <Badge status={calculateMeetingStatus(meeting)} className="text-xs">
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-government" />
                        {meeting.date}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-government" />
                        {meeting.startTime && meeting.endTime ? (
                        `${format(new Date(`${meeting.date}T${meeting.startTime}`), "HH:mm")} - ${format(new Date(`${meeting.date}T${meeting.endTime}`), "HH:mm")}`
                          ) : "-"}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-government" />
                        {meeting.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="w-4 h-4 mr-2 text-government" />
                        {meeting.leader}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {meeting.attendees.length}/{meeting.maxParticipants}{" "}
                          peserta
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <Button
                        onClick={() => navigate(`/admin/meeting/${meeting.id}`)}
                        variant="outline"
                        size="sm"
                        className="flex-1 mr-2 bg-green-700 border-green-700 text-white hover:bg-green-600 hover:text-white"
                      >
                        
                        Detail
                      </Button>
                      <Button
                        onClick={() => setEditingMeeting(meeting)}
                        variant="outline"
                        size="sm"
                        className="mr-2 border-blue-500 text-gold hover:bg-blue-200 hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteMeeting(meeting.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-200 border-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateMeetingDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateMeeting}
      />

      {editingMeeting && (
        <EditMeetingDialog
          meeting={editingMeeting}
          isOpen={!!editingMeeting}
          onClose={() => setEditingMeeting(null)}
          onUpdate={handleUpdateMeeting}
        />
      )}
    </div>
  );
};

export default AdminPanel;