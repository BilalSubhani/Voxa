# Voxa

**Voxa** is a full-stack real-time chat and admin dashboard application built using **Next.js** (frontend) and **Nest.js** (backend). It features OTP-based authentication, encrypted messaging, file sharing, and a fully functional admin panel with analytics. The app is designed to be modular, scalable, and production-ready — ideal for learning or as a professional showcase project.

---

## 🧠 What is Voxa?

Voxa is a secure, role-based messaging platform that supports:

- Real-time one-to-one chat between users
- OTP-based login & password reset
- Admin dashboard with user insights and analytics
- Media file uploads via Cloudinary
- Encrypted chat messages using WebSocket
- Modular frontend and backend with clean separation

---

## 💻 Frontend – Built with Next.js

The frontend is developed using **Next.js App Router**, with **Tailwind CSS** for styling and **Zustand** for state management. 

Key frontend features:

- Role-based routing and protected pages
- Real-time chat UI using `socket.io-client`
- OTP verification and password reset forms
- Admin dashboard with analytics and user control
- Reusable UI components and modern UX practices
- Image and file preview support via Cloudinary

---

## 🚀 Backend – Powered by Nest.js

The backend is developed using **Nest.js** and MongoDB with Mongoose.

Key backend features:

- OTP-based login and secure JWT auth
- Role-based access (User / Admin)
- Encrypted chat system with WebSocket
- File uploads to Cloudinary
- User analytics and admin tools
- Centralized API response structure

---

## 🛠️ Setup Instructions

### 📦 Prerequisites

- Node.js (18+)
- MongoDB (Atlas or local)
- Cloudinary account (for media upload)
- Vercel (for optional frontend deployment)

---

### 🔧 Backend Setup

```bash
# Clone the repo
git clone https://github.com/your-username/Voxa.git
cd Voxa/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Add your MongoDB URI, JWT secret, Cloudinary keys, etc.

# Run the backend
npm run start:dev
```

---

### 💻 Frontend Setup

```bash
# In a new terminal
cd Voxa/frontend

# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local
# Add your backend API base URL, Cloudinary keys, etc.

# Run the frontend
npm run dev
```

---

## 📁 Folder Structure

The project is divided into:

```
Voxa/
├── frontend/   → Next.js app with App Router
└── backend/    → Nest.js REST API + WebSocket server
```

Each folder contains its own `README.md` with detailed documentation.

---

## 🎯 Why Voxa?

- Learn full-stack architecture using real-world tools
- Practice production-ready patterns (auth, roles, chat, dashboards)
- Great project for portfolio or interviews
- Clean code, clean structure, professional quality

---

## 🧑‍💻 Built by

Bilal Subhani — Full Stack Developer & Engineer
