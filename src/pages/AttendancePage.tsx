
import React from 'react';
import AttendanceForm from '@/components/AttendanceForm';
import { useNavigate } from 'react-router-dom';

const AttendancePage = () => {
  const navigate = useNavigate();

  return <AttendanceForm onBack={() => navigate('/')} />;
};

export default AttendancePage;
