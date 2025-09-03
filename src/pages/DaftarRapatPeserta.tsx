import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { ArrowLeft } from "lucide-react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  start_time?: string;
  end_time?: string;
  location: string;
  leader: string;
  status?: "scheduled" | "ongoing" | "completed" | "cancelled";
}

const statusOrder: Record<Meeting["status"], number> = {
  ongoing: 0,
  scheduled: 1,
  completed: 2,
  cancelled: 3,
};

const DaftarRapatPeserta = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [popup, setPopup] = useState({ open: false, message: "" });

  const fetchMeetings = async () => {
    const { data, error } = await supabase.from("agenda_rapat").select("*");

    if (error) {
      console.error("Gagal mengambil data:", error.message);
      return;
    }

    const enriched = data.map((meeting: any) => {
      const now = new Date();
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(meeting.date);
      const isValidTime =
        /^\d{2}:\d{2}(:\d{2})?$/.test(meeting.start_time || "") &&
        /^\d{2}:\d{2}(:\d{2})?$/.test(meeting.end_time || "");

      let status: Meeting["status"] = "scheduled";

      if (isValidDate && isValidTime) {
        const start = new Date(`${meeting.date}T${meeting.start_time}`);
        const end = new Date(`${meeting.date}T${meeting.end_time || "23:59:59"}`);

        if (now < start) {
          status = "scheduled";
        } else if (now >= start && now <= end) {
          status = "ongoing";
        } else {
          status = "completed";
        }
      }

      return { ...meeting, status };
    });

    const sorted = enriched.sort((a, b) => {
      return statusOrder[a.status!] - statusOrder[b.status!];
    });

    setMeetings(sorted);
  };

  useEffect(() => {
    fetchMeetings();
    const interval = setInterval(fetchMeetings, 60000); // per 1 menit update status otomatis
    return () => clearInterval(interval);
  }, []);

const handleAbsensiClick = (meeting: Meeting) => {
  if (meeting.status === "cancelled") {
    setPopup({
      open: true,
      message: "Rapat dibatalkan. Anda tidak dapat melakukan absensi.",
    });
  } else {
    navigate(`/attendance/${meeting.id}`);
  }
};


  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="p-2 bg-white text-black hover:bg-gray-100 hover:text-black"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-gray-800 flex-1 text-center">Daftar Rapat</h1>
        </div>

        {meetings.length === 0 ? (
          <p className="text-center text-gray-500">Belum ada rapat yang tersedia</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
              <Card
                key={meeting.id}
                className="w-full max-w-sm mx-auto bg-white border border-green-700 rounded-lg shadow-sm hover:shadow-md transition"
              >
                <div className="p-4 flex flex-col  h-full space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle
                      className={`text-gray-800 font-semibold leading-tight ${
                        meeting.title.length > 25 ? "text-sm" : "text-base"
                      } line-clamp-2`}
                    >
                      {meeting.title}
                    </CardTitle>
                    {meeting.status && <Badge status={meeting.status} />}
                  </div>

                  <div className="text-xs text-gray-600 space-y-2 flex-1 mt-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-green-700" />
                      <p>
                        <span className="font-medium text-gray-700">Tanggal:</span> {meeting.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-700" />
                      <p>
                        <span className="font-medium text-gray-700">Waktu:</span>{" "}
                        {meeting.start_time} - {meeting.end_time}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-green-700" />
                      <p>
                        <span className="font-medium text-gray-700">Lokasi:</span> {meeting.location}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-green-700" />
                      <p>
                        <span className="font-medium text-gray-700">Pemimpin:</span> {meeting.leader}
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleAbsensiClick(meeting)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-1.5 mt-4"
                    disabled={meeting.status === "cancelled"}
                  >
                    Isi Absensi
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {popup.open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm text-center">
              <p className="mb-4 text-gray-700">{popup.message}</p>
              <Button
                onClick={() => setPopup({ open: false, message: "" })}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaftarRapatPeserta;
