import axios from "axios";

// Membuat instance Axios dengan konfigurasi dasar
const axiosClient = axios.create({
  // URL dasar dari API backend Anda. Pastikan ini benar.
  baseURL: 'http://127.0.0.1:8000/api' 
});

// Interceptor: Kode ini akan dijalankan SEBELUM setiap request dikirim.
axiosClient.interceptors.request.use((config) => {
  // Ambil token dari localStorage
  const token = localStorage.getItem('ACCESS_TOKEN');
  
  // Tambahkan header Authorization ke setiap request
  config.headers.Authorization = `Bearer ${token}`;
  
  return config;
});

// Interceptor: Kode ini akan dijalankan SETELAH menerima respons
axiosClient.interceptors.response.use(
  (response) => {
    // Jika respons sukses, langsung kembalikan datanya
    return response;
  }, 
  (error) => {
    // Jika ada error (misal: token tidak valid/kadaluarsa - 401 Unauthorized)
    if (error.response && error.response.status === 401) {
      // Hapus token dari localStorage
      localStorage.removeItem('ACCESS_TOKEN');
      // Anda bisa menambahkan logika untuk redirect ke halaman login di sini
    }
    // Kembalikan error agar bisa ditangani di tempat lain
    return Promise.reject(error);
  }
);

export default axiosClient;
