import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

interface EditMeetingDialogProps {
  meeting: Meeting;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (meeting: Meeting) => void;
}

const EditMeetingDialog = ({ meeting, isOpen, onClose, onUpdate }: EditMeetingDialogProps) => {
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
    status: 'scheduled' as 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
  });

  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title,
        date: meeting.date,
        startTime: meeting.startTime,
        endTime: meeting.endTime,
        location: meeting.location,
        leader: meeting.leader,
        description: meeting.description,
        notes: meeting.notes,
        maxParticipants: meeting.maxParticipants,
        status: meeting.status
      });
    }
  }, [meeting]);

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

    const { error } = await supabase
      .from('meetings')
      .update(formData)
      .eq('id', meeting.id);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal memperbarui rapat.",
        variant: "destructive"
      });
      return;
    }

    const updatedMeeting: Meeting = {
      ...meeting,
      ...formData
    };

    toast({
      title: "Berhasil",
      description: "Rapat berhasil diperbarui."
    });

    onUpdate(updatedMeeting);
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
          <DialogTitle className="text-black">Edit Rapat</DialogTitle>
          <DialogDescription className="text-black">
            Perbarui informasi rapat sesuai kebutuhan
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="edit-title">Judul Rapat *</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="edit-title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Masukkan judul rapat"
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-leader">Pemimpin Rapat</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="edit-leader"
                value={formData.leader}
                onChange={(e) => handleInputChange('leader', e.target.value)}
                placeholder="Nama pemimpin rapat"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-date">Tanggal *</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-startTime">Waktu Mulai *</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="edit-startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-endTime">Waktu Selesai</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="edit-endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-location">Lokasi</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="edit-location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Ruang rapat"
              />
            </div>
            <div>
              <Label htmlFor="edit-maxParticipants">Maks. Peserta</Label>
              <Input
                className="bg-white border-gray-300 text-black placeholder:text-gray-300"
                id="edit-maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 50)}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-lg z-50">
                  <SelectItem value="scheduled">Terjadwal</SelectItem>
                  <SelectItem value="ongoing">Berlangsung</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="edit-description">Deskripsi</Label>
            <Textarea
              id="edit-description"
              className="bg-white border-gray-300 text-black placeholder:text-gray-300"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Deskripsi rapat..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="edit-notes">Catatan</Label>
            <Textarea
              className="bg-white border-gray-300 text-black placeholder:text-gray-300"
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Catatan tambahan untuk peserta..."
              rows={2}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="hover:bg-gray-300 text-black">
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-green-700 text-white hover:bg-green-600"
            >
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMeetingDialog;
