# API Contract – LabGear API v1

Noval Nurhuda Wiratama · 240414004 · 3IF · UTS Web Service (REST API – NestJS)

## 1. Informasi Umum

| Item | Nilai |
|---|---|
| Base URL | `http://localhost:3000/api` |
| Format data | JSON (`Content-Type: application/json`) |
| Autentikasi | Tidak ada |
| Penyimpanan | Tidak ada, response berupa echo |
| Identitas resource | `id` bilangan bulat |

**Validasi global** (`ValidationPipe`): `whitelist`, `forbidNonWhitelisted`, dan `transform` aktif. Properti di luar DTO ditolak dengan 400, termasuk `id`, `status`, dan `createdAt`.

## 2. Daftar Endpoint

| Method | Endpoint | Tujuan | Query / Body | Status HTTP |
|---|---|---|---|---|
| GET | `/api/equipment` | Daftar alat | Query opsional: `category`, `keyword`, `page` (min 1, default 1), `limit` (1–20, default 10) | 200, 400 |
| GET | `/api/equipment/:id` | Detail alat | Path: `id` (integer) | 200, 400 |
| POST | `/api/equipment` | Tambah alat | Body: `CreateEquipmentDto` | 201, 400 |
| PATCH | `/api/equipment/:id` | Ubah data alat (tambahan) | Body: `UpdateEquipmentDto` (semua opsional, tanpa `assetCode`) | 200, 400 |
| POST | `/api/loan-requests` | Buat pengajuan | Body: `CreateLoanRequestDto` | 201, 400 |
| GET | `/api/loan-requests/:id` | Detail pengajuan | Path: `id` (integer) | 200, 400 |
| PATCH | `/api/loan-requests/:id` | Ubah terbatas | Body: `UpdateLoanRequestDto` (`returnDate`, `purpose`; opsional) | 200, 400 |

Status 404 belum muncul karena tidak ada penyimpanan data; status itu baru relevan saat Service dan database ditambahkan.

## 3. Spesifikasi DTO

**CreateEquipmentDto**

| Field | Aturan |
|---|---|
| `assetCode` | string, wajib, pola `^LAB-[A-Z]{2}-[0-9]{3}$` |
| `name` | string, wajib, 3–80 karakter |
| `category` | `ELECTRONIC`, `NETWORK`, `MULTIMEDIA`, atau `OTHER` |
| `condition` | `GOOD`, `MINOR_DAMAGE`, atau `NEEDS_REPAIR` |
| `stock` | integer 0–50 |
| `location` | string, wajib, 2–60 karakter |

**UpdateEquipmentDto**: seluruh field `CreateEquipmentDto` kecuali `assetCode`, semuanya opsional.

**CreateLoanRequestDto**

| Field | Aturan |
|---|---|
| `borrowerNim` | string, hanya digit, 8–12 karakter |
| `borrowerName` | string, wajib, 3–70 karakter |
| `borrowerEmail` | format email valid |
| `assetCode` | string, pola `^LAB-[A-Z]{2}-[0-9]{3}$` |
| `quantity` | integer 1–3 |
| `startDate`, `returnDate` | string ISO 8601, contoh `2026-11-25` |
| `purpose` | string, wajib, 15–250 karakter |

**UpdateLoanRequestDto**: hanya `returnDate` dan `purpose`, keduanya opsional.

**FindEquipmentQueryDto**: `category` (enum) dan `keyword` (maks. 50 karakter) opsional; `page` integer minimal 1; `limit` integer 1–20. `page` dan `limit` diubah menjadi number lebih dulu dengan `@Type(() => Number)`.

**Field yang dikelola sistem** (tidak boleh dikirim client): `id`, `status` (awal `PENDING`), dan `createdAt`. Status mencerminkan keputusan laboran, bukan klaim peminjam; `createdAt` harus berasal dari waktu server; `id` harus unik. Bila dikirim, response 400 dengan pesan `property status should not exist`.

## 4. Contoh Request dan Response

**POST /api/equipment** → 201

```json
{
  "assetCode": "LAB-MM-305",
  "name": "Proyektor Epson EB-X06",
  "category": "MULTIMEDIA",
  "condition": "GOOD",
  "stock": 5,
  "location": "Lab Multimedia"
}
```

```json
{
  "message": "Equipment diterima (echo, tidak disimpan)",
  "data": {
    "id": 1,
    "assetCode": "LAB-MM-305",
    "name": "Proyektor Epson EB-X06",
    "category": "MULTIMEDIA",
    "condition": "GOOD",
    "stock": 5,
    "location": "Lab Multimedia"
  }
}
```

**POST /api/loan-requests** → 201

```json
{
  "borrowerNim": "240414004",
  "borrowerName": "Noval Nurhuda Wiratama",
  "borrowerEmail": "240414004@fellow.lpkia.ac.id",
  "assetCode": "LAB-MM-305",
  "quantity": 2,
  "startDate": "2026-11-25",
  "returnDate": "2026-11-28",
  "purpose": "Presentasi tugas kelompok mata kuliah multimedia di ruang kelas"
}
```

```json
{
  "message": "Pengajuan peminjaman diterima (echo, tidak disimpan)",
  "data": {
    "id": 1,
    "borrowerNim": "240414004",
    "borrowerName": "Noval Nurhuda Wiratama",
    "borrowerEmail": "240414004@fellow.lpkia.ac.id",
    "assetCode": "LAB-MM-305",
    "quantity": 2,
    "startDate": "2026-11-25",
    "returnDate": "2026-11-28",
    "purpose": "Presentasi tugas kelompok mata kuliah multimedia di ruang kelas",
    "status": "PENDING",
    "createdAt": "2026-11-23T08:00:00.000Z"
  }
}
```

**400 – validasi gagal** (format standar NestJS)

```json
{
  "message": [
    "assetCode harus mengikuti pola LAB-XX-000 (contoh: LAB-EL-001)",
    "stock harus berupa bilangan bulat"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

## 5. Catatan Aturan Lintas-Field

`returnDate` ≥ `startDate` tidak divalidasi di DTO pada UTS ini karena membandingkan dua field sekaligus. Penjelasan lengkap ada pada BR-04 di `PRD.md`.
