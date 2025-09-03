
import React from 'react';
import AdminPanel from '@/components/AdminPanel';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return <AdminPanel onBack={() => navigate('/')} />;
};

export default AdminDashboard;
