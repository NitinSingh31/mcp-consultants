# MCP CONSULTANTS — Official Website & Executive Search Portal

Official corporate website and leadership talent portal for **MCP CONSULTANTS** (*"Protect. Shape. Advance"*).

Adapted from the structure, visual aesthetics, and executive positioning of ABC Consultants, with all references to IT & Telecommunications removed and replaced with comprehensive **Industry & Manufacturing** sectors.

---

## 📁 Project Structure

The project is decoupled into two clean, independent directories:

```
e:\MCP CONSULTANTS\
├── frontend/                     # React 19 + Vite Single Page Application (SPA)
│   ├── src/                      # UI components, pages, luxury styling
│   │   ├── components/           # Navbar, Footer, FeedbackModal, StatCounter
│   │   ├── pages/                # Home, About, Services, Industries, Insights, Contact, Admin
│   │   ├── api.js                # Dynamic API endpoint configuration
│   │   ├── App.jsx               # Client-side router setup
│   │   ├── index.css             # Luxury design system & responsive styling
│   │   └── main.jsx              # Application bootstrap
│   ├── index.html                # HTML entry with typography (Cinzel, Inter, Outfit)
│   ├── vite.config.mjs           # Vite dev proxy configuration (/api & /uploads -> :3000)
│   ├── package.json              # Frontend dependencies (React, Lucide, Vite)
│   └── .env.example              # Frontend environment variables (VITE_API_URL)
│
├── backend/                      # Node.js API & Microservices
│   ├── server.js                 # API server, MongoDB connection, Nodemailer, Auth
│   ├── uploads/                  # Secure folder for uploaded CVs and mandate documents
│   ├── package.json              # Backend dependencies (Mongoose, Nodemailer, Dotenv)
│   ├── .env                      # Atlas credentials, email credentials, port
│   └── .env.example              # Template configuration
│
├── package.json                  # Root monorepo script runner (npm run dev, build, etc.)
├── render.yaml                   # Cloud deployment blueprint for Render
├── .gitignore                    # Monorepo ignores (node_modules, .env, dist, uploads)
└── README.md                     # Project documentation
```

---

## ⚡ Quick Start (Local Development)

Requires **Node.js v18.0.0+**.

### 1. Install Dependencies
You can install dependencies for both `frontend` and `backend` with a single command from the root directory:
```powershell
npm run install:all
```
*(Or individually: `cd frontend && npm install`, `cd ../backend && npm install`)*

### 2. Start Development Servers
From the root directory, run:
```powershell
npm run dev
```
This runs both the backend API and frontend Vite dev server concurrently!

Or run them individually:
```powershell
# Frontend alone (port 5173):
npm run dev:frontend

# Backend alone (port 3000):
npm run dev:backend
```

### 3. Open in Browser
* **Main Website**: [http://localhost:5173/](http://localhost:5173/)
* **Contact & Hiring Portal**: [http://localhost:5173/contact](http://localhost:5173/contact)
* **Internal Admin Practice Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 🔒 Admin Portal & Authentication

The Executive Practice Portal (`/admin`) features self-service authentication backed by **MongoDB Atlas**:
- **Initial Default Login**:
  - **Username**: `admin`
  - **Password**: `McpAdmin@2026`
- **Self-Service Credentials**: Admins can change their username, email, and password directly from the **⚙️ Settings** modal inside the portal without touching the `.env` file.
- **Forgot Password (OTP via Email)**: If password is forgotten, click *"Forgot Password?"* on the login gate. A 6-digit OTP code will be sent to the registered email address.

---

## 🌐 Deployment Guide

### Option 1: Unified Fullstack Service (Render / Railway)
The backend is equipped to automatically detect and serve `frontend/dist` when compiled!

1. In **Render.com**, select **New Web Service** and connect your repo.
2. Build & Start Commands:
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
3. Environment Variables in Render Dashboard:
   - `NODE_VERSION`: `20.18.0`
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `EMAIL_USER`: `Recruiter.mcpconsultants@gmail.com`
   - `EMAIL_PASS`: *Your Google App Password*
   - `NOTIFICATION_EMAILS`: `Recruiter.mcpconsultants@gmail.com, Shallu.mcpconsultants@gmail.com, Shikha.mcpconsultants@gmail.com`

### Option 2: Decoupled (Frontend on Vercel/Netlify + Backend on Render)
- **Frontend**: Deploy `frontend/` folder to Vercel or Netlify. Set `VITE_API_URL=https://your-backend-api.onrender.com`.
- **Backend**: Deploy `backend/` folder to Render or Railway. Backend includes full CORS support for cross-domain requests.
