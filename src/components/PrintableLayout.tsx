
import React from 'react';
import { Calendar, Clock, MapPin, User, Users } from 'lucide-react';

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
  attendees: any[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

interface PrintableLayoutProps {
  meetings: Meeting[];
  title: string;
}

const PrintableLayout = ({ meetings, title }: PrintableLayoutProps) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Terjadwal';
      case 'ongoing': return 'Berlangsung';
      case 'completed': return 'Selesai';
      case 'cancelled': return 'Dibatalkan';
      default: return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="print-only">
      <div className="print-header">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">KEMENTERIAN AGAMA RI</h1>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
          <p className="text-sm text-gray-600">
            Dicetak pada: {new Date().toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      <div className="print-content">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Ringkasan</h3>
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="text-center p-3 border border-gray-300 rounded">
              <div className="font-bold text-lg">{meetings.length}</div>
              <div className="text-gray-600">Total Rapat</div>
            </div>
            <div className="text-center p-3 border border-gray-300 rounded">
              <div className="font-bold text-lg">
                {meetings.filter(m => m.status === 'scheduled').length}
              </div>
              <div className="text-gray-600">Terjadwal</div>
            </div>
            <div className="text-center p-3 border border-gray-300 rounded">
              <div className="font-bold text-lg">
                {meetings.filter(m => m.status === 'completed').length}
              </div>
              <div className="text-gray-600">Selesai</div>
            </div>
            <div className="text-center p-3 border border-gray-300 rounded">
              <div className="font-bold text-lg">
                {meetings.reduce((sum, m) => sum + m.attendees.length, 0)}
              </div>
              <div className="text-gray-600">Total Peserta</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {meetings.map((meeting, index) => (
            <div key={meeting.id} className="border border-gray-300 rounded-lg p-4 break-inside-avoid">
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-lg font-semibold text-gray-900 flex-1">
                  {index + 1}. {meeting.title}
                </h4>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                  meeting.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                  meeting.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getStatusText(meeting.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div className="flex items-center text-gray-700">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(meeting.date)}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{meeting.startTime} - {meeting.endTime}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{meeting.location}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <User className="w-4 h-4 mr-2" />
                  <span>{meeting.leader}</span>
                </div>
              </div>

              <div className="text-sm text-gray-700 mb-2">
                <strong>Deskripsi:</strong> {meeting.description}
              </div>

              {meeting.notes && (
                <div className="text-sm text-gray-700 mb-2">
                  <strong>Catatan:</strong> {meeting.notes}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{meeting.attendees.length}/{meeting.maxParticipants} peserta</span>
                </div>
                <div>
                  Dibuat: {new Date(meeting.createdAt).toLocaleDateString('id-ID')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="print-footer">
        <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-300">
          <p>Dokumen ini digenerate secara otomatis oleh Sistem Absensi Rapat</p>
          <p>Kementerian Agama Republik Indonesia</p>
        </div>
      </div>
    </div>
  );
};

export default PrintableLayout;
