import React, { useEffect, useState, useRef } from 'react';
import axiosClient from '../api/axios';

export default function CustomerDashboard() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [errors, setErrors] = useState(null);

  // Refs untuk form rental
  const startDateRef = useRef();
  const endDateRef = useRef();

  useEffect(() => {
    fetchAvailableCars();
  }, []);

  const fetchAvailableCars = () => {
    setLoading(true);
    axiosClient.get('/cars')
      .then(({ data }) => {
        // PERBAIKAN: Cek jika data adalah array atau objek
        const carData = Array.isArray(data) ? data : (data.data || []);
        const availableCars = carData.filter(car => car.status === 'available');
        setCars(availableCars);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const openRentalModal = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
    setErrors(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleRentalSubmit = (ev) => {
    ev.preventDefault();
    setErrors(null);

    const payload = {
      car_id: selectedCar.id,
      start_date: startDateRef.current.value,
      end_date: endDateRef.current.value,
    };

    axiosClient.post('/transactions', payload)
      .then(() => {
        alert('Penyewaan berhasil! Mobil ini sekarang tidak tersedia.');
        closeModal();
        fetchAvailableCars(); // Refresh daftar mobil
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        } else {
          alert(response?.data?.message || 'Terjadi kesalahan saat melakukan transaksi.');
        }
      });
  };

  const formatRupiah = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);

  return (
    <div>
      <h1>Pilih Mobil Impian Anda</h1>
      <p>Daftar mobil yang siap untuk menemani perjalanan Anda.</p>

      {loading ? (
        <p>Memuat data mobil...</p>
      ) : (
        <div className="car-grid">
          {cars.map(car => (
            <div key={car.id} className="car-card">
              <img src={car.car_photo || 'https://placehold.co/400x200?text=Mobil'} alt={car.name} className="car-card-img" />
              <div className="car-card-body">
                <h3>{car.name}</h3>
                <p className="car-brand">{car.brand} - {car.year}</p>
                <p className="car-price">{formatRupiah(car.price_per_day)} / hari</p>
                <button className="btn btn-block" onClick={() => openRentalModal(car)}>Sewa Sekarang</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && selectedCar && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2>Sewa Mobil: {selectedCar.name}</h2>
            {errors && (
              <div className="alert">
                {Object.keys(errors).map(key => <p key={key}>{errors[key][0]}</p>)}
              </div>
            )}
            <form onSubmit={handleRentalSubmit}>
              <div className="form-group">
                <label>Tanggal Mulai Sewa</label>
                <input ref={startDateRef} type="date" required />
              </div>
              <div className="form-group">
                <label>Tanggal Selesai Sewa</label>
                <input ref={endDateRef} type="date" required />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn">Konfirmasi Sewa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}