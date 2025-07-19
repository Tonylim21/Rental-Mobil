import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axios';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState(null);

  // Refs untuk form edit
  const usernameRef = useRef();
  const phoneRef = useRef();
  const addressRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const openEditModal = () => {
    setIsModalOpen(true);
    setErrors(null);
    // Set nilai awal form saat modal dibuka
    setTimeout(() => {
      if (user) {
        usernameRef.current.value = user.username;
        phoneRef.current.value = user.phone || '';
        addressRef.current.value = user.address || '';
        passwordRef.current.value = '';
        passwordConfirmationRef.current.value = '';
      }
    }, 0);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileUpdate = (ev) => {
    ev.preventDefault();
    setErrors(null);

    const payload = {
      username: usernameRef.current.value,
      phone: phoneRef.current.value,
      address: addressRef.current.value,
    };

    // Hanya tambahkan password ke payload jika field diisi
    if (passwordRef.current.value) {
      payload.password = passwordRef.current.value;
      payload.password_confirmation = passwordConfirmationRef.current.value;
    }

    // Menggunakan endpoint PUT /profile yang aman
    axiosClient.put('/profile', payload)
      .then(({ data }) => {
        setUser(data.user); // Update data user di context
        alert('Profil berhasil diperbarui!');
        closeModal();
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
          alert(response?.data?.message || 'Terjadi kesalahan saat memperbarui profil.');
        }
      });
  };
  
  const ErrorDisplay = ({ errors }) => {
    if (!errors) return null;
    return (
      <div className="alert">
        {Object.keys(errors).map(key => <p key={key}>{errors[key][0]}</p>)}
      </div>
    );
  };

  return (
    <div>
      <h1>Profil Saya</h1>
      {user ? (
        <div className="profile-card">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Nomor Telepon:</strong> {user.phone || '-'}</p>
          <p><strong>Alamat:</strong> {user.address || '-'}</p>
          <p><strong>Role:</strong> {user.role}</p>

          {/* Tombol Edit dipindahkan ke sini */}
          <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
            <button className="btn" onClick={openEditModal}>Edit Profil</button>
          </div>
        </div>
      ) : (
        <p>Memuat data profil...</p>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Edit Profil</h2>
            <ErrorDisplay errors={errors} />
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Username</label>
                <input ref={usernameRef} type="text" />
              </div>
              <div className="form-group">
                <label>Nomor Telepon</label>
                <input ref={phoneRef} type="text" />
              </div>
              <div className="form-group">
                <label>Alamat</label>
                <input ref={addressRef} type="text" />
              </div>
              <hr style={{ margin: '20px 0' }} />
              <p style={{color: '#6c757d'}}>Kosongkan jika tidak ingin mengubah password.</p>
              <div className="form-group">
                <label>Password Baru</label>
                <input ref={passwordRef} type="password" />
              </div>
              <div className="form-group">
                <label>Konfirmasi Password Baru</label>
                <input ref={passwordConfirmationRef} type="password" />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
