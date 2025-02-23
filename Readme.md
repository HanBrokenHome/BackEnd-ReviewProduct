# Review Product API

API ini digunakan untuk mengelola produk dan ulasan pengguna. Dibangun dengan Express.js dan MongoDB.

## Instalasi

```sh
git clone https://github.com/username/ReviewProduct.git
cd ReviewProduct
npm install
node index.js
```

## Endpoint API

### 1. Register User
**Endpoint:** `POST http://localhost:5005/register`

**Body:**
```json
{
  "email": "user@gmail.com",
  "username": "user123",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Berhasil membuat akun"
}
```

---
### 2. Login User
**Endpoint:** `POST http://localhost:5005/login`

**Body:**
```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Berhasil login",
  "token": "jwt-token"
}
```

---
### 3. Tambah Produk
**Endpoint:** `POST http://localhost:5005/Product`

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Body:**
```json
{
  "name": "Laptop Gaming",
  "description": "Laptop dengan spesifikasi tinggi."
}
```

**Response:**
```json
{
  "message": "Product berhasil di tambah"
}
```

---
### 4. Ambil Semua Produk
**Endpoint:** `GET http://localhost:5005/AllProduct`

**Response:**
```json
[
  {
    "_id": "productId",
    "name": "Laptop Gaming",
    "description": "Laptop dengan spesifikasi tinggi.",
    "user": {
      "username": "user123",
      "email": "user@gmail.com"
    }
  }
]
```

---
### 5. Tambah Review Produk
**Endpoint:** `POST http://localhost:5005/ReviewProduct/:productId`

**Headers:**
```json
{
  "Authorization": "Bearer jwt-token"
}
```

**Body:**
```json
{
  "rating": 5,
  "comment": "Produk sangat bagus!"
}
```

**Response:**
```json
{
  "message": "Berhasil merating product"
}
```

---
### 6. Ambil Review Berdasarkan Produk
**Endpoint:** `GET http://localhost:5005/review/:productId`

**Response:**
```json
[
  {
    "user": {
      "username": "user123"
    },
    "product": {
      "name": "Laptop Gaming"
    },
    "rating": 5,
    "comment": "Produk sangat bagus!"
  }
]
```

## Menjalankan Server
Server berjalan di port `5005`.

```sh
node index.js
```

## Teknologi yang Digunakan
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (JSON Web Token)
- bcrypt.js untuk hashing password
- CORS untuk komunikasi antar domain

