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
`Here is a complete list of commands to run the project from a fresh clone, followed by the issues we solved and the commands used to resolve them:

---

### 🚀 Complete Commands to Run From Clone

#### 1. Start MongoDB (Prerequisite)
Ensure MongoDB is running locally on port `27017`:
```powershell
net start MongoDB
```

#### 2. Backend Setup & Run
Run these commands from the root directory of the cloned repository:
```powershell
# Navigate to the backend folder
cd Backend\agrilink-backend\agrilink-backend

# Clean target and compile code
mvn clean compile

# Start the Spring Boot Application
mvn spring-boot:run
```
* The backend will run on `http://localhost:8085/api`.
* On startup, the database seeder will automatically initialize categories, users, and 50 default products.

#### 3. Frontend Setup & Run
Open a new terminal window at the repository root:
```powershell
# Navigate to the frontend folder
cd Frontend\agrilink-frontend

# Install node dependencies
npm install

# Run the local Vite dev server
npm run dev
```
* The frontend application will run on `http://localhost:5173`.

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
