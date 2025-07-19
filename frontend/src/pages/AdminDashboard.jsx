import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axios';

export default function AdminDashboard() {
  // State untuk menyimpan data summary dan status loading
  const [summary, setSummary] = useState({
    total_revenue: 0,
    rented_cars: 0,
    available_cars: 0,
  });
  const [loading, setLoading] = useState(true);

  // useEffect untuk mengambil data dari API saat komponen pertama kali dimuat
  useEffect(() => {
    setLoading(true);
    axiosClient.get('/dashboard-summary')
      .then(({ data }) => {
        setSummary(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []); // [] berarti hanya dijalankan sekali

  // Fungsi untuk format angka menjadi format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(number);
  };

  if (loading) {
    return <div>Memuat data statistik...</div>;
  }

  return (
    <div>
      <h1>Dashboard Admin</h1>
      <p>Selamat datang, Admin! Di sini Anda bisa melihat ringkasan pendapatan dan status mobil.</p>
      
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', flex: 1 }}>
          <h3>Total Pendapatan</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatRupiah(summary.total_revenue)}</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', flex: 1 }}>
          <h3>Mobil Disewa</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.rented_cars} Mobil</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', flex: 1 }}>
          <h3>Mobil Tersedia</h3>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{summary.available_cars} Mobil</p>
        </div>
      </div>
    </div>
  );
}