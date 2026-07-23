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


##Here are all the pre-seeded account credentials for the **AgriLink** application:

---

### 🔑 **Pre-Seeded Login Credentials**

| Role | Name | Email / Username | Password | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | System Super Admin | `superadmin@agrilink.com` | `superadmin123` | Active |
| **Admin** | AgriLink Admin | `admin@agrilink.com` | `admin123` | Active |
| **Farmer** | Rajesh Kumar | `farmer@agrilink.com` | `farmer123` | Active |
| **Delivery Partner** | Ravi Kumar | `delivery@agrilink.com` | `delivery123` | Active |
| **Customer** | Abhisek Kundu | `customer@agrilink.com` | `password` | Active |

---

### ⚡ **Additional Test Details**

- **Universal Test OTP:** `123456` *(works for all OTP verification prompts)*
- **Frontend App:** [http://localhost:5173/](http://localhost:5173/) (or `http://localhost:5174/`)
- **Backend API:** [http://localhost:8085/api](http://localhost:8085/api)
- **Swagger API Documentation:** [http://localhost:8085/api/swagger-ui.html](http://localhost:8085/api/swagger-ui.html)