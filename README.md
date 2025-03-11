# Claims Management Platform

## 📌 Overview
This project is a **Claims Management Platform** designed for both **patients and insurers** to submit, review, and manage claims efficiently. The platform is built using **NestJS** for the backend and **MongoDB** for the database.

## 🎯 Objective
The platform consists of two interfaces:
- **Patient Portal:** Submit and track claims.
- **Insurer Portal:** Review and manage claims.

## 🚀 Features
### 🏥 Patient Side
- **Submit a Claim:**
  - Form fields: `Name`, `Email`, `Claim Amount`, `Description`
  - Upload a supporting document
- **View Claims:**
  - Dashboard listing submitted claims
  - Status: `Pending`, `Approved`, `Rejected`
  - Approved Amount & Submission Date

### 🏦 Insurer Side
- **Claims Dashboard:**
  - View all submitted claims
  - Filter by `Status`, `Date`, `Claim Amount`
- **Manage Claims:**
  - Review claim details & uploaded documents
  - Update claim status (`Approve/Reject`)
  - Add `Approved Amount` & `Insurer Comments`

### 🔒 Shared Features
- **Authentication:**
  - Basic login for **patients and insurers** (mock authentication)
- **API Development:**
  - `POST /claims` → Submit a claim
  - `GET /claims` → Fetch all claims (with filters)
  - `PATCH /claims/:id` → Update claim status

## 🛠️ Tech Stack
- **Backend:** NestJS (Node.js + Express.js framework)
- **Database:** MongoDB
- **Authentication:** JWT (mock authentication for now)
- **File Upload:** Multer (for handling document uploads)

## 📅 3-Day Plan
### **Day 1: Backend Development** ✅ (Completed)
- Set up NestJS project and connect to MongoDB
- Create **Claim Model**
- Develop API Endpoints: `POST`, `GET`, `PATCH`
- Implement Mock Authentication

### **Day 2: Frontend Development** 🛠️ (In Progress)
- Setup React.js project
- Build Patient & Insurer Dashboards
- Connect frontend to backend via API calls

### **Day 3: Testing & Deployment** 🔥
- Test APIs using Postman
- Refine UI/UX
- Deploy on **Vercel (Frontend)** & **Render (Backend)**

## 🏃‍♂️ Getting Started
### 1️⃣ **Clone the Repository**
```sh
 git clone https://github.com/jithu2023/claims-management.git
 cd claims-management
```

### 2️⃣ **Backend Setup**
```sh
cd backend
npm install
```

#### Configure Environment Variables (`.env`)
```
MONGO_URI=mongodb+srv://your-mongodb-url
JWT_SECRET=your-secret-key
```

#### Run the Backend Server
```sh
npm run start
```

### 3️⃣ **Frontend Setup (Coming Soon)**
```sh
cd frontend
npm install
npm start
```

## 📷 Screenshots / Demo
🚀 [**Demo Video**](#) (To be uploaded upon completion)

---
✅ **Developed with ❤️ by Jithumon Jacob**

