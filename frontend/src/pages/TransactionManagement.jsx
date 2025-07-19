import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axios';

export default function TransactionManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    setLoading(true);
    axiosClient.get('/transactions') // Asumsi endpoint ini mengembalikan semua transaksi untuk admin
      .then(({ data }) => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const openDetailModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const onComplete = (transactionId) => {
    if (!window.confirm('Apakah Anda yakin ingin menyelesaikan transaksi ini? Status mobil akan dikembalikan.')) {
      return;
    }
    axiosClient.put(`/transactions/${transactionId}/complete`)
      .then(() => {
        alert('Transaksi berhasil diselesaikan!');
        fetchTransactions();
      })
      .catch(err => {
        alert(err.response?.data?.message || 'Gagal menyelesaikan transaksi.');
      });
  };

  const onDelete = (transactionId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus transaksi ini? Ini akan membatalkan sewa.')) {
      return;
    }
    axiosClient.delete(`/transactions/${transactionId}`)
      .then(() => {
        fetchTransactions(); // Refresh data setelah hapus
      });
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric'
  });

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);

  return (
    <div>
      <h1>Manajemen Transaksi</h1>

      {loading ? (
        <p>Memuat data transaksi...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Mobil</th>
              <th>Tgl Mulai</th>
              <th>Tgl Selesai</th>
              <th>Total Harga</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(trx => (
              <tr key={trx.id}>
                <td>{trx.user?.username || 'N/A'}</td>
                <td>{trx.car?.name || 'N/A'}</td>
                <td>{formatDate(trx.start_date)}</td>
                <td>{formatDate(trx.end_date)}</td>
                <td>{formatRupiah(trx.total_price)}</td>
                <td>
                  <span className={`status ${trx.status === 'completed' ? 'status-available' : 'status-unavailable'}`}>
                    {trx.status}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" style={{marginRight: '5px'}} onClick={() => openDetailModal(trx)}>Detail</button>
                  
                  {/* Tombol Selesaikan hanya muncul jika status 'ongoing' */}
                  {trx.status === 'ongoing' && (
                    <button className="btn" style={{backgroundColor: '#28a745', marginRight: '5px'}} onClick={() => onComplete(trx.id)}>
                      Selesaikan
                    </button>
                  )}

                  <button className="btn-delete" onClick={() => onDelete(trx.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && selectedTransaction && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Detail Transaksi #{selectedTransaction.id}</h2>
            <div className="transaction-details">
              <p><strong>Customer:</strong> {selectedTransaction.user?.username}</p>
              <p><strong>No. Telepon:</strong> {selectedTransaction.user?.phone}</p>
              <p><strong>Mobil:</strong> {selectedTransaction.car?.name} ({selectedTransaction.car?.brand})</p>
              <p><strong>No. Polisi:</strong> {selectedTransaction.car?.plate_number}</p>
              <p><strong>Tanggal Sewa:</strong> {formatDate(selectedTransaction.start_date)} - {formatDate(selectedTransaction.end_date)}</p>
              <p><strong>Total Harga:</strong> {formatRupiah(selectedTransaction.total_price)}</p>
              <p><strong>Status:</strong> {selectedTransaction.status}</p>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={closeModal}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}