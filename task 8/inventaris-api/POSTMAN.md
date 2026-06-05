# Panduan Penggunaan API di Postman

Dokumentasi ini menjelaskan cara mengetes API Inventaris yang telah dibangun menggunakan Laravel Sanctum.

## Persiapan
1. Pastikan server Laravel sedang berjalan: `php artisan serve` (Default: `http://127.0.0.1:8000`)
2. Buka aplikasi Postman.
3. **Penting:** Setiap request harus memiliki Header berikut:
   - `Accept`: `application/json`

---

## 1. Autentikasi (Register & Login)
Lakukan Register/Login untuk mendapatkan token.

- **Register:** `POST http://127.0.0.1:8000/api/register`
- **Login:** `POST http://127.0.0.1:8000/api/login`
- **Logout:** `POST http://127.0.0.1:8000/api/logout` (Butuh Bearer Token)

---

## 2. Pengelolaan Kategori (Categories)
Semua request di bawah ini **WAJIB** menggunakan `Bearer Token` di tab Authorization.

- **List All Categories:** 
  - `GET http://127.0.0.1:8000/api/categories`
- **Create Category:** 
  - `POST http://127.0.0.1:8000/api/categories`
  - Body (form-data): `name` (contoh: "Elektronik")
- **Update Category:** 
  - `PUT http://127.0.0.1:8000/api/categories/{id}`
  - Body (x-www-form-urlencoded): `name` (contoh: "Gadget")
- **Delete Category:** 
  - `DELETE http://127.0.0.1:8000/api/categories/{id}`

---

## 3. Pengelolaan Barang (Items)
Semua request di bawah ini **WAJIB** menggunakan `Bearer Token`.

- **List All Items:** 
  - `GET http://127.0.0.1:8000/api/items`
- **Create Item:** 
  - `POST http://127.0.0.1:8000/api/items`
  - Body (form-data): 
    - `category_id`: (isi dengan ID kategori yang sudah dibuat)
    - `name`: "Laptop ASUS"
    - `description`: "Laptop gaming ROG"
    - `stock`: 10
    - `price`: 15000000
- **Update Item:** 
  - `PUT http://127.0.0.1:8000/api/items/{id}`
  - Body (x-www-form-urlencoded): `stock`: 20
- **Delete Item:** 
  - `DELETE http://127.0.0.1:8000/api/items/{id}`

---
*Tips: Gunakan hasil ID dari List Categories saat membuat Item baru.*
