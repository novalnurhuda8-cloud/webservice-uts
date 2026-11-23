# PRD – LabGear API (UTS Web Service)

| | |
|---|---|
| Nama / NIM | Noval Nurhuda Wiratama / 240414004 |
| Kelas | 3IF |
| Mata kuliah | Web Service (REST API – NestJS) |
| Dosen | Agung Dea Yulaksana |
| Versi | 1.0 – 23 November 2026 |

## 1. Latar Belakang, Tujuan, Aktor, Ruang Lingkup

**Latar belakang.** Peminjaman alat laboratorium masih dicatat dengan formulir manual, sehingga data peminjam, alat, jumlah unit, dan jadwal pengembalian sering tidak konsisten.

**Tujuan.** Menyediakan REST API awal (LabGear API) yang menstandarkan pencatatan inventaris dan pengajuan peminjaman, dengan validasi input yang ketat sejak pintu masuk API.

**Aktor.** Mahasiswa peminjam (mengajukan, melihat, dan mengubah terbatas pengajuan) dan laboran/admin lab (mengelola data alat).

**Ruang lingkup v1.** Data alat (daftar, detail, tambah), pengajuan peminjaman (buat, detail, ubah terbatas), serta validasi request melalui DTO dan ValidationPipe.

## 2. Kebutuhan

**Functional requirements**

| ID | Kebutuhan | Cara uji |
|---|---|---|
| FR-01 | `GET /api/equipment` mendukung filter `category`, `keyword`, `page`, `limit` | Query valid → 200 |
| FR-02 | `GET /api/equipment/:id` menampilkan detail alat | id valid → 200 |
| FR-03 | `POST /api/equipment` menerima data alat baru | Body valid → 201 |
| FR-04 | `POST /api/loan-requests` membuat pengajuan dengan status awal `PENDING` | Body valid → 201, `status` = `PENDING` |
| FR-05 | `GET /api/loan-requests/:id` menampilkan detail pengajuan | id valid → 200 |
| FR-06 | `PATCH /api/loan-requests/:id` hanya mengubah `returnDate` dan `purpose` | Body berisi field lain → 400 |
| FR-07 | Request yang tidak valid ditolak dengan pesan per field | Skenario negatif Postman → 400 |

**Non-functional requirements**

| ID | Kebutuhan |
|---|---|
| NFR-01 Konsistensi | Error validasi berformat seragam: `statusCode`, `message[]`, `error`. |
| NFR-02 Keamanan input | Properti di luar DTO ditolak (`whitelist` dan `forbidNonWhitelisted`). |
| NFR-03 Maintainability | Kode modular per resource (module, controller, dto, enums) dengan penamaan konsisten. |
| NFR-04 Portabilitas | Berjalan dengan `npm install` dan `npm run start:dev`, tanpa database atau konfigurasi tambahan. |

## 3. Aturan Bisnis

**A. Dapat divalidasi dari bentuk input (decorator DTO)**

| ID | Aturan | Decorator |
|---|---|---|
| BR-01 | `assetCode` berpola `LAB-[A-Z]{2}-[0-9]{3}`; `borrowerNim` hanya digit, 8–12 karakter | `@Matches` |
| BR-02 | `quantity` integer 1–3; `stock` integer 0–50 | `@IsInt` `@Min` `@Max` |
| BR-03 | `category` dan `condition` harus anggota enum; `borrowerEmail` berformat email; tanggal berformat ISO 8601 | `@IsEnum` `@IsEmail` `@IsISO8601` |

**B. Lintas-field / proses bisnis**

| ID | Aturan |
|---|---|
| BR-04 | `returnDate` harus sama dengan atau setelah `startDate`. |
| BR-05 | `id`, `status` (`PENDING`/`APPROVED`/`REJECTED`/`RETURNED`), dan `createdAt` dibuat oleh sistem, bukan dikirim client. |
| BR-06 | `assetCode` pada pengajuan harus terdaftar di inventori dan `stock` harus mencukupi `quantity`. |

**Alasan BR-04 membutuhkan validasi lintas-field.** Decorator pada satu properti hanya menilai nilai properti itu sendiri. `@IsISO8601` pada `returnDate` hanya memastikan formatnya benar, bukan membandingkannya dengan `startDate`. Pemeriksaan ini baru bisa dilakukan bila kedua nilai tersedia bersamaan, sehingga perlu custom validator tingkat class (`@ValidatorConstraint`) atau pemeriksaan di Service. Pada `PATCH`, pembanding `startDate` berada di data tersimpan sehingga murni proses bisnis. Implementasinya tidak wajib pada UTS ini.

**Alasan BR-05: status dan createdAt dibuat sistem.** Status adalah hasil keputusan laboran, sehingga peminjam tidak boleh menyetujui pengajuannya sendiri. `createdAt` harus berasal dari waktu server agar tepercaya, dan `id` harus unik. Field ini tidak ada di DTO sehingga ditolak 400 oleh `forbidNonWhitelisted`.

BR-06 membutuhkan akses data inventori sehingga termasuk proses bisnis di luar cakupan UTS.

## 4. Asumsi dan Out of Scope

**Asumsi.**
- Data contoh pengujian memakai Lab Multimedia (`LAB-MM-xxx`).
- `id` berupa bilangan bulat dan divalidasi dengan `ParseIntPipe`.
- Controller hanya mengembalikan echo, data tidak disimpan.
- Tidak ada field tambahan pada data contract.
- Endpoint `PATCH /api/equipment/:id` ditambahkan agar `UpdateEquipmentDto` terpakai; `assetCode` tidak dapat diubah karena merupakan kode identitas aset.

**Out of scope.** Database/ORM/Mongoose, autentikasi dan otorisasi, logika Service (cek stok, ketersediaan, perubahan status), endpoint DELETE, custom validator lintas-field, serta unit/e2e test otomatis.
