require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDb, getPool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const FIELDS = [
  'kode_siswa',
  'nama_siswa',
  'alamat_siswa',
  'tgl_siswa',
  'jurusan_siswa',
];

function validate(body) {
  const data = {};
  for (const f of FIELDS) {
    const v = body && body[f] !== undefined && body[f] !== null ? String(body[f]).trim() : '';
    if (!v) return { error: `Field ${f} wajib diisi` };
    data[f] = v;
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.tgl_siswa)) {
    return { error: 'Format tgl_siswa harus YYYY-MM-DD' };
  }
  return { data };
}

app.get('/', (req, res) => {
  res.json({ message: 'API Data Siswa berjalan' });
});

// READ semua
app.get('/api/siswa', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM siswa ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data siswa' });
  }
});

// READ satu
app.get('/api/siswa/:id', async (req, res) => {
  try {
    const [rows] = await getPool().query('SELECT * FROM siswa WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil data siswa' });
  }
});

// CREATE
app.post('/api/siswa', async (req, res) => {
  const { data, error } = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const [result] = await getPool().query(
      `INSERT INTO siswa (kode_siswa, nama_siswa, alamat_siswa, tgl_siswa, jurusan_siswa)
       VALUES (?, ?, ?, ?, ?)`,
      [data.kode_siswa, data.nama_siswa, data.alamat_siswa, data.tgl_siswa, data.jurusan_siswa]
    );
    const [rows] = await getPool().query('SELECT * FROM siswa WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Kode siswa sudah digunakan' });
    }
    console.error(err);
    res.status(500).json({ message: 'Gagal menambah data siswa' });
  }
});

// UPDATE
app.put('/api/siswa/:id', async (req, res) => {
  const { data, error } = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  try {
    const [result] = await getPool().query(
      `UPDATE siswa
       SET kode_siswa = ?, nama_siswa = ?, alamat_siswa = ?, tgl_siswa = ?, jurusan_siswa = ?
       WHERE id = ?`,
      [data.kode_siswa, data.nama_siswa, data.alamat_siswa, data.tgl_siswa, data.jurusan_siswa, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
    const [rows] = await getPool().query('SELECT * FROM siswa WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Kode siswa sudah digunakan' });
    }
    console.error(err);
    res.status(500).json({ message: 'Gagal mengubah data siswa' });
  }
});

// DELETE
app.delete('/api/siswa/:id', async (req, res) => {
  try {
    const [result] = await getPool().query('DELETE FROM siswa WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Siswa tidak ditemukan' });
    }
    res.json({ message: 'Data siswa berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal menghapus data siswa' });
  }
});

const PORT = process.env.PORT || 3001;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Gagal koneksi ke database:', err.message);
    process.exit(1);
  });