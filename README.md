# Aplikasi Web Rental Mobil (Full-Stack)

Ini adalah aplikasi web mini untuk manajemen rental mobil yang dibangun menggunakan tumpukan teknologi modern. Aplikasi ini memungkinkan admin untuk mengelola aset mobil dan customer, sementara customer dapat melihat mobil yang tersedia dan melakukan transaksi sewa.

---

## Fitur Utama

### Untuk Admin
- **Dashboard Statistik**: Melihat ringkasan pendapatan, jumlah mobil yang disewa, dan yang tersedia.
- **Manajemen Mobil (CRUD)**: Menambah, melihat, mengedit, dan menghapus data mobil beserta fotonya.
- **Manajemen Customer**: Menambah data customer baru.
- **Manajemen Transaksi**: Melihat semua riwayat transaksi, melihat detail, membatalkan (menghapus), dan menyelesaikan transaksi.

### Untuk Customer
- **Halaman Utama**: Melihat daftar semua mobil yang tersedia dalam format kartu (card).
- **Sewa Mobil**: Melakukan transaksi penyewaan mobil melalui modal interaktif.
- **Riwayat Transaksi**: Melihat semua riwayat transaksi yang pernah dilakukan.
- **Manajemen Profil**: Melihat dan mengedit data profil pribadi (username, telepon, alamat, password).

---

## Tumpukan Teknologi

- **Backend**: Laravel 10
  - **Otentikasi**: Laravel Sanctum
- **Frontend**: React.js (Vite)
  - **HTTP Client**: Axios
  - **Routing**: React Router DOM
- **Database**: MySQL (atau database SQL lainnya yang didukung Laravel)

---

## Prasyarat

Pastikan perangkat Anda sudah terinstal perangkat lunak berikut:
- PHP >= 8.1
- Composer
- Node.js >= 16.x
- NPM atau Yarn
- Server Database (contoh: XAMPP, Laragon, dll. untuk MySQL)

---

## Cara Instalasi

Proyek ini terdiri dari dua bagian: **backend** dan **frontend**. Ikuti langkah-langkah berikut untuk masing-masing bagian.

### 1. Instalasi Backend (Laravel)

1.  **Clone Repository**
    ```bash
    git clone [URL_REPOSITORY_ANDA]
    cd [NAMA_FOLDER_PROYEK]/backend
    ```

2.  **Install Dependensi**
    ```bash
    composer install
    ```

3.  **Konfigurasi Environment**
    Salin file `.env.example` menjadi `.env`.
    ```bash
    cp .env.example .env
    ```
    Buka file `.env` dan sesuaikan konfigurasi database Anda, terutama:
    ```
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=db_rental_mobil  // Pastikan database ini sudah Anda buat
    DB_USERNAME=root
    DB_PASSWORD=
    ```

4.  **Generate Application Key**
    ```bash
    php artisan key:generate
    ```

5.  **Jalankan Migrasi Database**
    Perintah ini akan membuat semua tabel yang dibutuhkan di database Anda.
    ```bash
    php artisan migrate
    ```

6.  **(Opsional tapi Direkomendasikan) Buat User Admin Awal**
    Untuk membuat user admin pertama kali, Anda bisa menggunakan `php artisan tinker`:
    ```bash
    php artisan tinker
    ```
    Lalu jalankan perintah berikut di dalam Tinker:
    ```php
    \App\Models\User::create([
        'username' => 'admin',
        'password' => bcrypt('password'),
        'phone' => '081234567890',
        'address' => 'Kantor Pusat',
        'role' => 'admin'
    ]);
    ```
    Ketik `exit` untuk keluar dari Tinker.

7.  **Jalankan Server Backend**
    ```bash
    php artisan serve
    ```
    Secara default, server backend akan berjalan di `http://127.0.0.1:8000`.

### 2. Instalasi Frontend (React)

1.  **Buka Terminal Baru**
    Biarkan terminal untuk backend tetap berjalan. Buka terminal baru dan navigasi ke folder frontend.
    ```bash
    cd [NAMA_FOLDER_PROYEK]/frontend
    ```

2.  **Install Dependensi**
    ```bash
    npm install
    ```

3.  **Konfigurasi Alamat API**
    Buka file `src/api/axios.js`. Pastikan `baseURL` menunjuk ke alamat server backend Anda.
    ```javascript
    const axiosClient = axios.create({
      baseURL: '[http://127.0.0.1:8000/api](http://127.0.0.1:8000/api)' 
    });
    ```

4.  **Jalankan Server Frontend**
    ```bash
    npm run dev
    ```
    Server frontend akan berjalan di alamat yang tertera di terminal (biasanya `http://localhost:5173`). Buka alamat ini di browser Anda.

---

## Akun Demo

Anda bisa login menggunakan akun admin yang telah dibuat:
- **Username**: `admin`
- **Password**: `password`

Selamat mencoba!