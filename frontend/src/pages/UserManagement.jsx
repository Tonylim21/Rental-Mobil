import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../api/axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState(null);

  // Refs untuk form input di modal
  const usernameRef = useRef();
  const passwordRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axiosClient.get('/users')
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else if (data && Array.isArray(data.data)) {
          setUsers(data.data);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
    setErrors(null);
    setTimeout(() => {
      usernameRef.current.value = '';
      passwordRef.current.value = '';
      phoneRef.current.value = '';
      addressRef.current.value = '';
    }, 0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);

    const payload = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
      phone: phoneRef.current.value,
      address: addressRef.current.value,
    };

    axiosClient.post('/users', payload)
      .then(() => {
        fetchUsers();
        closeModal();
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  // --- FUNGSI onDelete DIKEMBALIKAN ---
  const onDelete = (user) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus customer: ${user.username}?`)) {
      return;
    }
    // Menggunakan endpoint yang benar: /users/{id}
    axiosClient.delete(`/users/${user.id}`)
      .then(() => {
        fetchUsers(); // Refresh data setelah hapus
      })
      .catch(err => {
        console.error("Gagal menghapus user:", err);
        alert('Gagal menghapus user. Silakan coba lagi.');
      });
  };

  const ErrorDisplay = ({ errors }) => {
    if (!errors) return null;
    return (
      <div className="alert">
        {Object.keys(errors).map(key => (
          <p key={key}>{errors[key][0]}</p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Manajemen User</h1>
        <button className="btn" onClick={openModal}>Tambah Customer</button>
      </div>

      {loading ? (
        <p>Memuat data user...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>No. Telepon</th>
              <th>Alamat</th>
              <th>Role</th>
              <th>Aksi</th> {/* <-- Kolom Aksi dikembalikan */}
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.address || '-'}</td>
                <td>
                  <span className={`status ${user.role === 'admin' ? 'status-unavailable' : 'status-available'}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {/* Tombol hapus hanya muncul untuk customer */}
                  {user.role === 'customer' && (
                     <button className="btn-delete" onClick={() => onDelete(user)}>Hapus</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Tambah Customer Baru</h2>
            <ErrorDisplay errors={errors} />
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input ref={usernameRef} type="text" placeholder="Username" />
              </div>
              <div className="form-group">
                <input ref={passwordRef} type="password" placeholder="Password" />
              </div>
              <div className="form-group">
                <input ref={phoneRef} type="text" placeholder="Nomor Telepon" />
              </div>
              <div className="form-group">
                <input ref={addressRef} type="text" placeholder="Alamat" />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}