# Panduan Testing API di Postman

Berikut adalah langkah-langkah untuk melakukan testing API Task Management yang telah selesai dibuat.

## 1. Persiapan Menjalankan Server
Buka terminal/Command Prompt di folder `c:\Users\LEGION\Documents\task7` dan jalankan perintah berikut secara berurutan:

```bash
# 1. Jalankan migrasi database
php artisan migrate

# 2. Jalankan server lokal
php artisan serve
```
Server akan berjalan di `http://127.0.0.1:8000`.

## 2. Testing Endpoint di Postman

### A. Register (Buat Akun)
- **Method**: `POST`
- **URL**: `http://127.0.0.1:8000/api/register`
- **Headers**: `Accept: application/json`
- **Body (raw - JSON)**:
```json
{
    "name": "User Test",
    "email": "test@example.com",
    "password": "password"
}
```

### B. Login (Dapatkan Token Sanctum)
- **Method**: `POST`
- **URL**: `http://127.0.0.1:8000/api/login`
- **Headers**: `Accept: application/json`
- **Body (raw - JSON)**:
```json
{
    "email": "test@example.com",
    "password": "password"
}
```
> **PENTING**: Copy nilai `access_token` dari response JSON. Anda akan menggunakannya untuk endpoint di bawah ini.

### C. Create Task
- **Method**: `POST`
- **URL**: `http://127.0.0.1:8000/api/tasks`
- **Headers**: 
  - `Accept: application/json`
  - `Authorization: Bearer <PASTE_TOKEN_ANDA_DISINI>`
- **Body (raw - JSON)**:
```json
{
    "title": "Belajar Laravel Sanctum",
    "description": "Membuat REST API dari awal hingga 100% selesai.",
    "status": "pending"
}
```

### D. List Semua Tasks
- **Method**: `GET`
- **URL**: `http://127.0.0.1:8000/api/tasks`
- **Headers**: 
  - `Accept: application/json`
  - `Authorization: Bearer <PASTE_TOKEN_ANDA_DISINI>`

### E. Update Task
- **Method**: `PUT`
- **URL**: `http://127.0.0.1:8000/api/tasks/1` (Ganti `1` dengan ID task)
- **Headers**: 
  - `Accept: application/json`
  - `Authorization: Bearer <PASTE_TOKEN_ANDA_DISINI>`
- **Body (raw - JSON)**:
```json
{
    "title": "Belajar Laravel Sanctum (Diperbarui)",
    "status": "completed"
}
```

### F. Delete Task
- **Method**: `DELETE`
- **URL**: `http://127.0.0.1:8000/api/tasks/1` (Ganti `1` dengan ID task)
- **Headers**: 
  - `Accept: application/json`
  - `Authorization: Bearer <PASTE_TOKEN_ANDA_DISINI>`
