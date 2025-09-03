import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';

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
  attendees?: any[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

interface StatsDashboardProps {
  meetings: Meeting[];
}

const StatsDashboard = ({ meetings }: StatsDashboardProps) => {
  const totalMeetings = meetings.length;
  const scheduledMeetings = meetings.filter(m => m.status === 'scheduled').length;
  const ongoingMeetings = meetings.filter(m => m.status === 'ongoing').length;
  const completedMeetings = meetings.filter(m => m.status === 'completed').length;
  const cancelledMeetings = meetings.filter(m => m.status === 'cancelled').length;

  const totalAttendees = meetings.reduce(
    (sum, meeting) => sum + (Array.isArray(meeting.attendees) ? meeting.attendees.length : 0),
    0
  );
  const avgAttendance = totalMeetings > 0 ? Math.round(totalAttendees / totalMeetings) : 0;

  const upcomingToday = meetings.filter(meeting => {
    const today = new Date().toISOString().split('T')[0];
    return meeting.date === today && meeting.status === 'scheduled';
  }).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-400">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Total Rapat</CardTitle>
          <Calendar className="h-4 w-4 text-green-700" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">{totalMeetings}</div>
          <div className="flex items-center space-x-1 mt-2">
            <Badge className="text-xs bg-white/50 border-green-600 text-green-700">
              Hari ini: {upcomingToday}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-400">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Rata-rata Kehadiran</CardTitle>
          <Users className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">{avgAttendance}</div>
          <p className="text-sm text-green-700 mt-1">Peserta per rapat</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-400">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Sedang Berlangsung</CardTitle>
          <Clock className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">{ongoingMeetings}</div>
          <div className="flex items-center space-x-1 mt-2">
            <Badge className="text-xs bg-white/50 border-green-400 text-green-700">
              Terjadwal: {scheduledMeetings}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-400">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Status Rapat</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-green-800 font-semibold flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Selesai
              </span>
              <span className="font-medium">{completedMeetings}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-600 font-semibold flex items-center">
                <XCircle className="w-3 h-3 mr-1" />
                Dibatalkan
              </span>
              <span className="font-medium">{cancelledMeetings}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDashboard;
