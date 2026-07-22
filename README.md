# 🌾 AgriLink — Complete Master Reference Guide

## 🔗 Repository
- **GitHub URL:** **[https://github.com/Abhisekkumarkilari77/Agrilink.git](https://github.com/Abhisekkumarkilari77/Agrilink.git)**
- **Branch:** `main`

---

## 🛠️ Complete Setup Guide (From Scratch)

### 📋 1. Prerequisites
- **Git**
- **Java 21 (JDK 21)**
- **Node.js (v18+)**
- **MongoDB** (running locally on port `27017`)

---

### 📥 2. Step-by-Step Commands

#### Step A: Clone Repository
```powershell
git clone https://github.com/Abhisekkumarkilari77/Agrilink.git
cd Agrilink
```

#### Step B: Start Local MongoDB
```powershell
net start MongoDB
```

#### Step C: Backend Setup & Launch (Rebuilds `target/`)
Open **Terminal Window #1**:
```powershell
cd Backend\agrilink-backend\agrilink-backend
mvn spring-boot:run
```
> 📌 *On startup, the backend automatically seeds initial Admin, Super Admin, Farmer, Delivery Partner, Categories, and Products into MongoDB.*

- **Backend API Base URL:** `http://localhost:8080/api`
- **Swagger Documentation:** `http://localhost:8080/api/swagger-ui.html`

#### Step D: Frontend Setup & Launch (Installs `node_modules/`)
Open **Terminal Window #2**:
```powershell
cd Frontend\agrilink-frontend
npm install
npm run dev
```
- **Frontend App URL:** `http://localhost:5173`

---

## 🔑 Complete Seeded Account Credentials

| Role | Name | Email / Username | Password | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Admin** | AgriLink Admin | `admin@agrilink.com` | `admin123` | `ACTIVE` |
| **Super Admin** | System Super Admin | `superadmin@agrilink.com` | `superadmin123` | `ACTIVE` |
| **Farmer** | Rajesh Kumar | `farmer@agrilink.com` | `farmer123` | `ACTIVE` |
| **Delivery Partner** | Ravi Kumar | `delivery@agrilink.com` | `delivery123` | `ACTIVE` |

---

## 🚀 Key Features & Workflows Included

1. **Multi-Role Authentication**:
   - Customer, Farmer, and Delivery Partner registration & stateless JWT login.
   - universal test OTP **`123456`** for dev testing.

2. **Admin Verification System**:
   - `GET /api/admin/pending-farmers` & `GET /api/admin/pending-delivery-partners`.
   - `PUT /api/admin/users/{userId}/approve` to activate pending accounts.

3. **Farmer Product Management**:
   - Add, edit, delete, and list products by category or farmer ID.
   - Pre-seeded with 6 categories (*Vegetables, Fruits, Dairy, Grains, Flowers, Eggs*).

4. **Order Logistics & Live OTP Delivery**:
   - Customers place orders stored directly in MongoDB.
   - Delivery partners accept orders via `/api/delivery/{partnerId}/accept/{orderId}`.
   - Pickup OTP verification (`/verify-pickup`) and Dropoff OTP verification (`/verify-delivery`).
