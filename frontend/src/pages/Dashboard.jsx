import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import CustomerDashboard from './CustomerDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  // Jika data user belum ada, tampilkan loading
  if (!user || !user.role) {
    return <div>Loading...</div>;
  }

  // Cek role user dan tampilkan dashboard yang sesuai
  if (user.role === 'admin') {
    return <AdminDashboard />;
  } else if (user.role === 'customer') {
    return <CustomerDashboard />;
  }

  // Fallback jika role tidak dikenali
  return <div>Role tidak valid.</div>;
}
