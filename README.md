# LabGear API

REST API peminjaman peralatan laboratorium, dibangun dengan NestJS untuk UTS mata kuliah Web Service (REST API – NestJS).

| | |
|---|---|
| Nama | Noval Nurhuda Wiratama |
| NIM | 240414004 |
| Kelas | 3IF |
| Dosen | Agung Dea Yulaksana |
| Institusi | Institut Digital Ekonomi LPKIA Bandung |

Cakupan: PRD, API contract, struktur project, Controller, DTO, dan ValidationPipe. Project ini tidak memakai database; controller hanya mengembalikan echo dan data tidak disimpan.

## Teknologi

NestJS 11, TypeScript, `class-validator`, `class-transformer`, `@nestjs/mapped-types`, dan `ValidationPipe` global.

## Cara Menjalankan

Prasyarat: Node.js 20 atau lebih baru dan npm.

```bash
npm install
npm run start:dev
```

Server berjalan di `http://localhost:3000/api`. Port dapat diubah dengan `PORT=4000 npm run start:dev`.

## Konfigurasi Validasi

`src/main.ts` memasang prefix `/api` dan `ValidationPipe` global:

```ts
app.setGlobalPrefix('api');
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

- `whitelist` dan `forbidNonWhitelisted`: properti yang tidak ada di DTO ditolak dengan 400.
- `transform`: `page` dan `limit` diubah menjadi number sebelum divalidasi.

## Endpoint

| Method | Endpoint | Keterangan |
|---|---|---|
| GET | `/api/equipment` | Daftar alat, query: `category`, `keyword`, `page`, `limit` |
| GET | `/api/equipment/:id` | Detail alat |
| POST | `/api/equipment` | Tambah alat |
| PATCH | `/api/equipment/:id` | Ubah data alat (tambahan) |
| POST | `/api/loan-requests` | Buat pengajuan, status awal `PENDING` |
| GET | `/api/loan-requests/:id` | Detail pengajuan |
| PATCH | `/api/loan-requests/:id` | Ubah terbatas: hanya `returnDate` dan `purpose` |

Spesifikasi lengkap ada di [API-contract.md](./API-contract.md), kebutuhan dan aturan bisnis di [PRD.md](./PRD.md).

## Pengujian dengan Postman

1. Jalankan server dengan `npm run start:dev`.
2. Import `LabGear-API.postman_collection.json` ke Postman.
3. Jalankan **Run collection**. Setiap request memiliki assertion status code dan pesan validasi.

| Folder | Skenario | Hasil |
|---|---|---|
| 1. Valid | Create, list, detail, dan PATCH dengan data benar | 200 / 201 |
| 2. Regex | `assetCode` dan NIM tidak sesuai pola | 400 |
| 3. Angka | Desimal, nol, negatif, atau melebihi batas | 400 |
| 4. Enum, email, field asing | Enum salah, email invalid, field `status` / `createdAt` / `isAdmin` | 400 |
| 5. PATCH dan path param | Field terlarang pada PATCH, id bukan angka | 400 |
| 6. Lintas-field | `returnDate` sebelum `startDate` (belum divalidasi, di luar cakupan UTS) | 201 |

## Struktur Project

```
labgear-api/
├── PRD.md
├── API-contract.md
├── README.md
├── LabGear-API.postman_collection.json
├── package.json
├── nest-cli.json
├── tsconfig.json
├── tsconfig.build.json
└── src/
    ├── main.ts
    ├── app.module.ts
    ├── common/
    │   └── constants/
    │       └── asset-code.constant.ts
    ├── equipment/
    │   ├── equipment.module.ts
    │   ├── equipment.controller.ts
    │   ├── enums/
    │   │   ├── equipment-category.enum.ts
    │   │   └── equipment-condition.enum.ts
    │   └── dto/
    │       ├── create-equipment.dto.ts
    │       ├── update-equipment.dto.ts
    │       └── find-equipment-query.dto.ts
    └── loan-requests/
        ├── loan-requests.module.ts
        ├── loan-requests.controller.ts
        ├── enums/
        │   └── loan-status.enum.ts
        └── dto/
            ├── create-loan-request.dto.ts
            └── update-loan-request.dto.ts
```
