require('dotenv').config();
const mysql = require('mysql2/promise');

let pool;

async function initDb() {
  const dbName = process.env.DB_NAME || 'db_siswa';

  // 1. Buat database jika belum ada
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
  await conn.end();

  // 2. Buat pool koneksi
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    dateStrings: true,
  });

  // 3. Buat tabel jika belum ada
  await pool.query(`
    CREATE TABLE IF NOT EXISTS siswa (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kode_siswa VARCHAR(20) NOT NULL UNIQUE,
      nama_siswa VARCHAR(100) NOT NULL,
      alamat_siswa VARCHAR(255) NOT NULL,
      tgl_siswa DATE NOT NULL,
      jurusan_siswa VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return pool;
}

function getPool() {
  return pool;
}

module.exports = { initDb, getPool };