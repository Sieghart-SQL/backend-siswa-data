# Backend Data Siswa

REST API untuk mengelola **Data Siswa** (CRUD) menggunakan **Express.js** dan **MySQL**.

## Teknologi

- Node.js
- Express.js
- MySQL (mysql2)
- dotenv, cors

## Struktur Data

Tabel `siswa` (dibuat otomatis saat server pertama kali dijalankan):

| Field | Tipe | Keterangan |
|---|---|---|
| id | INT | Primary key, auto increment |
| kode_siswa | VARCHAR(20) | Unik |
| nama_siswa | VARCHAR(100) | |
| alamat_siswa | VARCHAR(255) | |
| tgl_siswa | DATE | Format `YYYY-MM-DD` |
| jurusan_siswa | VARCHAR(100) | |

## Persiapan

1. Pasang Node.js (versi 18 atau lebih baru).
2. Nyalakan MySQL (Laragon/XAMPP).

## Instalasi

```bash
git clone https://github.com/Sieghart-SQL/backend-siswa-data.git
cd backend-siswa-data
npm install
```

Buat file `.env` di root project:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=db_siswa
```

Database `db_siswa` dan tabel `siswa` dibuat otomatis, tidak perlu dibuat manual.

## Menjalankan

```bash
npm start
```

Server berjalan di `http://localhost:3001`.

## Endpoint API

Base URL: `http://localhost:3001/api/siswa`

| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/siswa` | Ambil semua data siswa |
| GET | `/api/siswa/:id` | Ambil satu data siswa |
| POST | `/api/siswa` | Tambah data siswa |
| PUT | `/api/siswa/:id` | Ubah data siswa |
| DELETE | `/api/siswa/:id` | Hapus data siswa |

### Contoh body (POST dan PUT)

```json
{
  "kode_siswa": "S001",
  "nama_siswa": "Budi Santoso",
  "alamat_siswa": "Jl. Merdeka No. 1",
  "tgl_siswa": "2008-05-17",
  "jurusan_siswa": "Rekayasa Perangkat Lunak"
}
```

### Kode respons

| Kode | Arti |
|---|---|
| 200 | Berhasil |
| 201 | Data berhasil dibuat |
| 400 | Input tidak valid atau ada kolom kosong |
| 404 | Data tidak ditemukan |
| 409 | Kode siswa sudah digunakan |
| 500 | Kesalahan server |

## Frontend

Repo frontend: https://github.com/Sieghart-SQL/frontend-siswa-data