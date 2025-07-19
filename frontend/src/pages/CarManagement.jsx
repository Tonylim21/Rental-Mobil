import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../api/axios';

export default function CarManagement() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [selectedCar, setSelectedCar] = useState(null);
  const [errors, setErrors] = useState(null);

  // Refs untuk form input
  const nameRef = useRef();
  const plateNumberRef = useRef();
  const brandRef = useRef();
  const yearRef = useRef();
  const priceRef = useRef();
  const photoRef = useRef();

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = () => {
    setLoading(true);
    axiosClient.get('/cars')
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setCars(data);
        } else if (data && Array.isArray(data.data)) {
          setCars(data.data);
        } else {
          console.error("Format data dari API /cars tidak terduga:", data);
          setCars([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const openModal = (mode, car = null) => {
    setIsModalOpen(true);
    setModalMode(mode);
    setSelectedCar(car);
    setErrors(null);
    if (mode === 'edit' && car) {
      setTimeout(() => {
        nameRef.current.value = car.name;
        plateNumberRef.current.value = car.plate_number;
        brandRef.current.value = car.brand;
        yearRef.current.value = car.year;
        priceRef.current.value = car.price_per_day;
      }, 0);
    } else {
      setTimeout(() => {
        nameRef.current.value = '';
        plateNumberRef.current.value = '';
        brandRef.current.value = '';
        yearRef.current.value = '';
        priceRef.current.value = '';
        if(photoRef.current) photoRef.current.value = null;
      }, 0);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);

    const formData = new FormData();
    formData.append('name', nameRef.current.value);
    formData.append('plate_number', plateNumberRef.current.value);
    formData.append('brand', brandRef.current.value);
    formData.append('year', yearRef.current.value);
    formData.append('price_per_day', priceRef.current.value);
    if (photoRef.current.files[0]) {
      formData.append('car_photo', photoRef.current.files[0]);
    }

    let request;
    if (modalMode === 'edit') {
      // Baris `_method` sudah dihapus dari sini
      request = axiosClient.post(`/cars/${selectedCar.id}`, formData);
    } else {
      request = axiosClient.post('/cars', formData);
    }

    request
      .then(() => {
        fetchCars();
        closeModal();
      })
      .catch(err => {
        console.error("Error saat submit form:", err); 
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
          setErrors({
            general: [response?.data?.message || 'Terjadi kesalahan pada server. Silakan coba lagi.']
          });
        }
      });
  };

  const onDelete = (carId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus mobil ini?')) {
      return;
    }
    axiosClient.delete(`/cars/${carId}`)
      .then(() => {
        fetchCars();
      });
  };

  // Komponen untuk menampilkan error
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
        <h1>Manajemen Mobil</h1>
        <button className="btn" onClick={() => openModal('add')}>Tambah Mobil</button>
      </div>

      {loading ? (
        <p>Memuat data mobil...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nama Mobil</th>
              <th>No. Polisi</th>
              <th>Merek</th>
              <th>Tahun</th>
              <th>Harga/Hari</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {cars.map(car => (
              <tr key={car.id}>
                <td>
                  <img src={car.car_photo || 'https://placehold.co/100x60?text=No+Image'} alt={car.name} width="100" />
                </td>
                <td>{car.name}</td>
                <td>{car.plate_number}</td>
                <td>{car.brand}</td>
                <td>{car.year}</td>
                <td>Rp {Number(car.price_per_day).toLocaleString('id-ID')}</td>
                <td>
                  <span className={`status ${car.status === 'available' ? 'status-available' : 'status-unavailable'}`}>
                    {car.status}
                  </span>
                </td>
                <td>
                  <button className="btn-edit" onClick={() => openModal('edit', car)}>Edit</button>
                  <button className="btn-delete" onClick={() => onDelete(car.id)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>{modalMode === 'add' ? 'Tambah Mobil Baru' : 'Edit Mobil'}</h2>
            
            <ErrorDisplay errors={errors} />

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input ref={nameRef} type="text" placeholder="Nama Mobil" />
              </div>
              <div className="form-group">
                <input ref={plateNumberRef} type="text" placeholder="Nomor Polisi" />
              </div>
              <div className="form-group">
                <input ref={brandRef} type="text" placeholder="Merek" />
              </div>
              
              <div className="form-group form-row">
                <div style={{ flex: 1 }}>
                  <input ref={yearRef} type="number" placeholder="Tahun" />
                </div>
                <div style={{ flex: 1 }}>
                  <input ref={priceRef} type="number" placeholder="Harga per Hari" />
                </div>
              </div>
              
              <div className="form-group">
                <label>Foto Mobil</label>
                <input ref={photoRef} type="file" />
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