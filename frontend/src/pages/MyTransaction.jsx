import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axios';

export default function MyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Endpoint ini sudah pintar, akan mengembalikan transaksi milik customer yang login
    axiosClient.get('/transactions')
      .then(({ data }) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);

  return (
    <div>
      <h1>Riwayat Transaksi Saya</h1>
      {loading ? (
        <p>Memuat riwayat transaksi...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Mobil</th>
              <th>Tgl Mulai</th>
              <th>Tgl Selesai</th>
              <th>Total Harga</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(trx => (
              <tr key={trx.id}>
                <td>{trx.car?.name || 'N/A'}</td>
                <td>{formatDate(trx.start_date)}</td>
                <td>{formatDate(trx.end_date)}</td>
                <td>{formatRupiah(trx.total_price)}</td>
                <td>
                  <span className={`status ${trx.status === 'completed' ? 'status-available' : 'status-unavailable'}`}>
                    {trx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
