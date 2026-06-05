# 🚀 Panduan Lengkap Testing API Inventaris (Postman)

Panduan ini dirancang untuk membantu Anda mengetes seluruh fitur API (Autentikasi, Kategori, dan Barang) secara berurutan.

---

## 🛠️ 1. Persiapan Awal di Postman

Sebelum menembak API, pastikan Anda melakukan hal ini di setiap request:

1.  **Server Jalan:** Pastikan di terminal Anda sudah menjalankan `php artisan serve`.
2.  **Base URL:** `http://127.0.0.1:8000/api`
3.  **Headers Wajib:**
    Di setiap request, buka tab **Headers** dan tambahkan:
    *   Key: `Accept`
    *   Value: `application/json`
    *(Tanpa ini, Laravel mungkin akan mengembalikan halaman HTML jika ada error, bukan JSON).*

---

## 🔐 2. Alur Autentikasi (Mendapatkan Token)

### A. Register (Daftar Akun)
*   **Method:** `POST`
*   **URL:** `{{base_url}}/register`
*   **Body** -> **form-data**:
    *   `name`: Admin Ganteng
    *   `email`: admin@test.com
    *   `password`: password123
*   **Klik Send:** Anda akan menerima `token`. **Simpan token ini.**

### B. Login (Masuk)
*   **Method:** `POST`
*   **URL:** `{{base_url}}/login`
*   **Body** -> **form-data**:
    *   `email`: admin@test.com
    *   `password`: password123
*   **Klik Send:** Anda akan menerima `token`.

### C. Cara Menggunakan Token (PENTING)
Untuk semua request di bawah (Kategori & Barang), Anda **wajib** menyertakan token:
1.  Buka tab **Authorization**.
2.  Pilih Type: **Bearer Token**.
3.  Paste token Anda di kotak **Token**.

---

## 📁 3. Mengelola Kategori (Categories)

*Lakukan ini sebelum membuat Barang.*

### 1. Tambah Kategori (Create)
*   **Method:** `POST`
*   **URL:** `{{base_url}}/categories`
*   **Body** -> **form-data**:
    *   `name`: Elektronik
*   **Hasil:** Catat `id` kategori yang muncul (misal: `1`).

### 2. Lihat Semua Kategori (List)
*   **Method:** `GET`
*   **URL:** `{{base_url}}/categories`

### 3. Update Kategori
*   **Method:** `PUT`
*   **URL:** `{{base_url}}/categories/1` (ganti `1` dengan ID kategori)
*   **Body** -> **x-www-form-urlencoded**:
    *   `name`: Gadget & Laptop

---

## 📦 4. Mengelola Barang (Items)

### 1. Tambah Barang (Create)
*   **Method:** `POST`
*   **URL:** `{{base_url}}/items`
*   **Body** -> **form-data**:
    *   `category_id`: 1 (Gunakan ID dari langkah kategori tadi)
    *   `name`: Macbook Pro M3
    *   `description`: Laptop kencang untuk coding
    *   `stock`: 5
    *   `price`: 25000000
*   **Klik Send.**

### 2. Lihat Semua Barang
*   **Method:** `GET`
*   **URL:** `{{base_url}}/items`
*   **Keunggulan:** API ini sudah otomatis menampilkan data kategori di dalam setiap barang.

### 3. Update Stok Barang 
*   **Method:** `PUT`
*   **URL:** `{{base_url}}/items/1`
*   **Body** -> **x-www-form-urlencoded**:
    *   `stock`: 10 (misal nambah stok)

---

## 💡 Tips Pro: Menggunakan Variabel di Postman
Agar tidak lelah copy-paste token:
1.  Klik icon **Mata (Quick Look)** di pojok kanan atas Postman.
2.  Klik **Edit** pada Global Variables.
3.  Tambahkan variable `token` dan masukkan token Anda di `Initial Value`.
4.  Di tab Authorization setiap request, cukup ketik `{{token}}` di kolom token.

---
**Status Error yang Sering Muncul:**
- `401 Unauthorized`: Token salah, kadaluarsa, atau lupa belum dimasukkan di tab Authorization.
- `422 Unprocessable Content`: Ada data yang kurang (misal lupa isi nama) atau email sudah terpakai.
- `404 Not Found`: ID yang Anda masukkan tidak ada di database.
