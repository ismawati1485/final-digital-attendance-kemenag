import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

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

interface CreateMeetingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (meeting: Meeting) => void;
}

const CreateMeetingDialog = ({ isOpen, onClose, onSubmit }: CreateMeetingDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    leader: '',
    description: '',
    notes: '',
    maxParticipants: 50,
    status: 'scheduled' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.startTime) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return;
    }

const formatToFullTime = (time: string) => {
  return time.length === 5 ? `${time}:00` : time; // tambahkan detik jika belum ada
};

const newMeeting = {
  ...formData,
  startTime: formatToFullTime(formData.startTime),
  endTime: formatToFullTime(formData.endTime),
  attendees: [],
  createdAt: new Date().toISOString().split('T')[0]
};

    const { data, error } = await supabase.from('agenda_rapat').insert([
      {
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
        created_at: newMeeting.createdAt,
      }
    ]).select().single();

    if (error) {
      toast({
        title: "Gagal Menyimpan",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Rapat Berhasil Dibuat",
      description: "Agenda rapat baru berhasil ditambahkan ke database."
    });

    onSubmit({
      id: data.id.toString(),
      ...newMeeting,
      status: newMeeting.status as Meeting['status']
    });

    setFormData({
      title: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      leader: '',
      description: '',
      notes: '',
      maxParticipants: 50,
      status: formData.status 
  
    });

    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-government">Buat Rapat Baru</DialogTitle>
          <DialogDescription className="text-gray-600">
            Isi informasi rapat yang akan dibuat
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Judul Rapat *</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Masukkan judul rapat"
                required
              />
            </div>
            <div>
              <Label htmlFor="leader">Pemimpin Rapat</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="leader"
                value={formData.leader}
                onChange={(e) => handleInputChange('leader', e.target.value)}
                placeholder="Nama pemimpin rapat"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Tanggal *</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="startTime">Waktu Mulai *</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">Waktu Selesai</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ruang rapat"
              />
            </div>
            <div>
              <Label htmlFor="maxParticipants">Maks. Peserta</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 50)}
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              className="bg-white border-gray-300 text-black placeholder:text-gray-300"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi rapat..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Catatan</Label>
            <Textarea
              id="notes"
              className="bg-white border-gray-300 text-black placeholder:text-gray-300"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Catatan tambahan untuk peserta..."
              rows={2}
            />
          </div>
            <div>
  <Label htmlFor="status">Status Rapat</Label>
  <select
    id="status"
    value={formData.status}
    onChange={(e) => handleInputChange('status', e.target.value)}
    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm bg-white text-black focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
  >
    <option value="scheduled">Terjadwal</option>
    <option value="ongoing">Sedang Berlangsung</option>
    <option value="completed">Selesai</option>
    <option value="cancelled">Dibatalkan</option>
  </select>
</div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="hover:bg-gray-300 text-black">
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-green-700 text-white hover:bg-green-600"
            >
              Buat Rapat
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeetingDialog;
