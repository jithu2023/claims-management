﻿# CLAIMS MANAGEMENT SYSTEM
A full-stack claims management system that allows patients to submit insurance claims and insurers to review and process them. Built using React.js, NestJS, MongoDB, and JWT-based authentication.

## 🌐 Deployment & Resources
- **Live Demo:** [Deployment Link](#)  
- **Short Video Overview:** [Video Link](#)  
- **GitHub Repository:** [GitHub Link](#)  

## 📜 Table of Contents
- [🚀 Features](#-features)
  - [✅ Patient Side](#-patient-side)
  - [✅ Insurer Side](#-insurer-side)
  - [✅ Shared Features](#-shared-features)
- [🛠 Tech Stack](#-tech-stack)
- [📂 Folder Structure](#-folder-structure)
- [⚙️ Installation](#-installation)
  - [Server Setup (NestJS)](#server-setup-nestjs)
  - [Client Setup (React)](#client-setup-react)
- [🔒 Authentication](#-authentication)
- [🔗 API Endpoints](#-api-endpoints)
- [🧪 Testing](#-testing)

---
## 🚀 Features
### ✅ Patient Side
- **Submit Claims:** Enter details such as name, email, amount, and description.
- **Upload Supporting Documents:** e.g., receipts, prescriptions.
- **Track Claim Status:** View submitted claims and their current status.

### ✅ Insurer Side
- **Review & Manage Claims:** See all submitted claims.
- **Approve/Reject Claims:** Update claim status and add comments.
- **Filter Claims:** View claims by status, date, or amount.

### ✅ Shared Features
- **JWT Authentication:** Secure login for both patients and insurers.
- **MongoDB Database:** Store user and claim data.
- **REST API:** Endpoints for claims and authentication.
- **File Uploads:** Patients can upload claim-related documents.
- **Responsive UI:** Built using Tailwind CSS and Headless UI.

---
## 🛠 Tech Stack
| Technology      | Purpose         |
|---------------|----------------|
| React.js      | Frontend UI     |
| Tailwind CSS + Headless UI | Styling |
| NestJS        | Backend API     |
| MongoDB       | Database        |
| JWT (JSON Web Tokens) | Authentication |
| Axios         | API requests    |
| TypeScript    | Type safety     |

---
## 📂 Folder Structure
```
claims-management/
│── frontend/              # Client (React)
│   ├── src/
│   │   ├── pages/
│   │   ├── App.jsx        # Main App component
│   │   ├── main.jsx       # Entry point
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│── backend/              # Server (NestJS)
│   ├── src/
│   │   ├── auth/         # Authentication modules
│   │   ├── claims/       # Claims modules
│   │   ├── models/       # Mongoose schemas
│   │   ├── types/        # TypeScript types
│   │   ├── main.ts       # Entry point
│   ├── uploads/          # File uploads folder
│   ├── .env              # Environment variables
│   ├── package.json
│   ├── test/             # E2E tests
```

---
## ⚙️ Installation
### Server Setup (NestJS)
Navigate to the backend folder:
```sh
cd backend
```
Install dependencies:
```sh
npm install
```
Create a `.env` file with the following:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```
Start the backend:
```sh
npm start
```

### Client Setup (React)
Navigate to the frontend folder:
```sh
cd frontend
```
Install dependencies:
```sh
npm install
```
Start the frontend:
```sh
npm run dev
```
Visit the app in your browser:
```sh
http://localhost:5173
```

---
## 🔒 Authentication
| Role    | Credentials        |
|---------|--------------------|
| Patient | patient / patient123 |
| Insurer | insurer / insurer123 |

- Patients can submit claims and view their status.
- Insurers can review, approve, or reject claims.

---
## 🔗 API Endpoints
| Method | Endpoint        | Description |
|--------|---------------|-------------|
| POST   | /auth/signup  | Register a new user |
| POST   | /auth/login   | Login and get JWT token |
| POST   | /claims       | Submit a new claim |
| GET    | /claims       | Fetch all claims |
| GET    | /claims/user/:id | Fetch claims by user ID |
| GET    | /claims/claim/:id | Fetch a specific claim |
| PATCH  | /claims/:id   | Approve/Reject a claim |

---
## 🧪 Testing
Run backend tests:
```sh
npm run test:e2e
```
Run frontend tests:
```sh
npm run test
```

---
### 📢 Feel free to contribute, report issues, or improve the project! 🚀

