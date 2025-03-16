# Dokumentasi API - User Management Api

API ini berfungsi Managemenet CRUD User dengan implementasi data dari api [disini](https://jsonplaceholder.typicode.com)

## 1. Instalasi

Sebelum memulai, pastikan Anda telah menginstal **Node.js**, **npm** atau **yarn**, serta **PostgreSQL** sebagai database yang digunakan.

### Langkah-langkah Instalasi:

1. Clone repositori ini:
   ```bash
   git clone https://github.com/username/ecommerce-backend.git
   ```
2. Masuk ke direktori proyek:
   ```bash
   cd dot-test-nest-ts
   ```
3. Install semua dependensi yang diperlukan:
   ```bash
   pnpm install
   ```
4. Buat file `.env` di root proyek dan isi dengan konfigurasi database serta variabel dari `.env.example`, contoh:
   ```plaintext
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=your_database_name
   
   PORT=3001
   JWT_SECRET=your_jwt_secret
   ```
   atau cara cepatnya: 
   ```plaintext
   cp .env.example .env
   ```
5. Pastikan semua variabel telah dibuat sesuai dengan konfigurasi di `.env`.
6. Jalankan migrasi database:
   ```bash
   pnpm migration:run
   ```
6. Jalankan seed database:
   ```bash
   pnpm seed:run
   ```
7. Jalankan aplikasi:
   ```bash
   yarn start
   # atau
   npm start
   ```

Aplikasi akan berjalan di `http://localhost:3000`.

## 3. Endpoint API

API ini menyediakan beberapa endpoint utama. Dokumentasi lengkap tersedia di [Postman Documentation](https://documenter.getpostman.com/view/29492816/2s9YsGhYfA).

### 3.1 Autentikasi

| Method | Endpoint       | Deskripsi                  |
|--------|--------------|----------------------------|
| POST   | `/auth/login` | Login user                 |
| POST   | `/auth/register` | Registrasi user baru       |

### 3.2 User Management

| Method | Endpoint             | Deskripsi                    |
|--------|----------------------|------------------------------|
| GET    | `/users`             | Mendapatkan daftar user      |
| GET    | `/users/:id`         | Mendapatkan detail user      |
| GET    | `/users/insert-data` | Mendapatkan detail user      |
| PUT    | `/users/:id`         | Memperbarui data user       |
| DELETE | `/users/:id`         | Menghapus user              |

---

## 4. Teknologi yang Digunakan

- **NestJS** - Framework backend berbasis TypeScript
- **TypeORM** - ORM untuk manajemen database
- **PostgreSQL** - Database utama yang digunakan
- **JWT** - Untuk autentikasi user
- **Cache Manager** - Untuk caching data user

---
