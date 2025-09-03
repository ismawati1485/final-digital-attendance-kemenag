
import { useState, useMemo, useCallback } from 'react';

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

export const useMeetingFilters = (meetings: Meeting[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [leaderFilter, setLeaderFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Extract unique leaders and locations for filter options
  const { leaders, locations } = useMemo(() => ({
    leaders: [...new Set(meetings.map(m => m.leader))].sort(),
    locations: [...new Set(meetings.map(m => m.location))].sort()
  }), [meetings]);

  // Memoized filtered meetings
  const filteredMeetings = useMemo(() => {
    let filtered = [...meetings];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(meeting =>
        meeting.title.toLowerCase().includes(searchLower) ||
        meeting.leader.toLowerCase().includes(searchLower) ||
        meeting.location.toLowerCase().includes(searchLower) ||
        meeting.description.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.status === statusFilter);
    }

    // Leader filter
    if (leaderFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.leader === leaderFilter);
    }

    // Location filter
    if (locationFilter !== 'all') {
      filtered = filtered.filter(meeting => meeting.location === locationFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(meeting => {
        const meetingDate = new Date(meeting.date);
        meetingDate.setHours(0, 0, 0, 0);
        
        switch (dateFilter) {
          case 'today':
            return meetingDate.getTime() === today.getTime();
          case 'week':
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            return meetingDate >= weekStart && meetingDate <= weekEnd;
          case 'month':
            return meetingDate.getMonth() === today.getMonth() && 
                   meetingDate.getFullYear() === today.getFullYear();
          case 'upcoming':
            return meetingDate >= today;
          case 'past':
            return meetingDate < today;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [meetings, searchTerm, statusFilter, dateFilter, leaderFilter, locationFilter]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
    setLeaderFilter('all');
    setLocationFilter('all');
  }, []);

  return {
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
    locations
  };
};
