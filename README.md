# MCP CONSULTANTS — Official Website & Executive Search Portal

Official corporate website and leadership talent portal for **MCP CONSULTANTS** (*"Protect. Shape. Advance"*).

Adapted from the structure, visual aesthetics, and executive positioning of premier executive search consultancies, with a focused specialization in comprehensive **Industry & Manufacturing** sectors.

---

## 📁 Project Structure

The project is structured into two clean, decoupled directories with a modular architecture:

```
e:\MCP CONSULTANTS\
├── frontend/                     # React 19 + Vite Single Page Application (SPA)
│   ├── src/                      # UI components, pages, luxury styling
│   │   ├── components/           # Navbar, Footer, FeedbackModal, StatCounter
│   │   ├── pages/                # Home, About, Services, Industries, Insights, Contact, Admin, ResdexSearch
│   │   ├── data/                 # Comprehensive A-Z databases (skills, companies, designations, industries)
│   │   ├── api.js                # Dynamic API endpoint configuration
│   │   ├── App.jsx               # Client-side router setup
│   │   ├── index.css             # Luxury design system & responsive styling
│   │   └── main.jsx              # Application bootstrap
│   ├── index.html                # HTML entry with typography (Cinzel, Inter, Outfit)
│   ├── vite.config.mjs           # Vite dev proxy configuration (/api & /uploads -> :3000)
│   ├── package.json              # Frontend dependencies (React, Lucide, Vite)
│   └── .env.example              # Frontend environment variables (VITE_API_URL)
│
├── backend/                      # Express.js Modular MVC Backend
│   ├── config/                   # Configuration services
│   │   ├── db.js                 # MongoDB connection & status tracker
│   │   └── mailer.js             # Nodemailer setup & alert email dispatching
│   ├── models/                   # Mongoose data schemas
│   │   ├── Admin.js              # Admin credentials, tokens & OTP schema
│   │   ├── Candidate.js          # Resdex candidate profiles schema
│   │   ├── Inquiry.js            # General contact inquiries schema
│   │   └── Mandate.js            # Client leadership hiring mandates schema
│   ├── middleware/               # Express request middleware
│   │   ├── auth.js               # Bearer token verification for protected endpoints
│   │   └── upload.js             # Multer multipart file upload handling (up to 25MB)
│   ├── controllers/              # Business logic handlers
│   │   ├── adminController.js    # Auth, password reset, credential update, submissions
│   │   ├── candidateController.js# Resdex multi-filter search & recent searches
│   │   └── submissionController.js# Client mandates, candidate CVs & inquiries
│   ├── routes/                   # Modular API routers
│   │   ├── adminRoutes.js        # /api/admin/* endpoints
│   │   ├── candidateRoutes.js    # /api/candidates/* endpoints
│   │   └── submissionRoutes.js   # /api/hiring, /api/candidate, /api/inquiry, /api/db-status
│   ├── seeds/                    # Automatic database seeders
│   │   ├── adminSeed.js          # Initial default admin seeding
│   │   └── candidateSeed.js      # Initial sample Resdex candidate profiles
│   ├── utils/                    # Utility functions
│   │   └── crypto.js             # Scrypt password hashing & verification
│   ├── uploads/                  # Secure folder for uploaded CVs and mandate documents
│   ├── server.js                 # Clean Express application entrypoint (~70 lines)
│   ├── package.json              # Backend dependencies (Express, CORS, Multer, Mongoose, Nodemailer)
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
* **Resdex Executive Candidate Search**: [http://localhost:5173/resdex](http://localhost:5173/resdex)
* **Contact & Hiring Portal**: [http://localhost:5173/contact](http://localhost:5173/contact)
* **Internal Admin Practice Portal**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 🌟 Key Features

### 1. Resdex Executive Candidate Search (`/resdex`)
- **Interactive A-Z Alphabet Scrubbers**: Quick jump letter selectors (`A-Z`) for instant filter discovery.
- **Comprehensive Domain Databases**: Hundreds of categorized keywords across:
  - **Real-World Skills**: CNC Machining, Six Sigma, Lean Manufacturing, Battery Management Systems, Blast Furnace, etc.
  - **Target Companies**: Tier-1 heavy engineering, automotive, aerospace, and metallurgy enterprises.
  - **Executive Designations**: VP Operations, Plant Head, Director Supply Chain, Chief Technology Officer, etc.
  - **Industry Sectors**: Automotive & EV, Heavy Engineering, Steel & Metallurgy, Aerospace & Defence, etc.
- **Multi-Facet Search API**: Backed by MongoDB Atlas with regex keyword querying, numerical experience filters, and notice period filtering.

### 2. Executive Practice Portal (`/admin`)
- **Self-Service Authentication**: Protected by MongoDB session tokens and password hashing via `crypto.scrypt`.
  - **Default Credentials**: `admin` / `McpAdmin@2026`
- **Credential Management**: Update username, email, and password directly from the **⚙️ Settings** modal.
- **Forgot Password (OTP via Email)**: 6-digit verification code dispatched via Nodemailer for self-service resets.
- **Submissions Dashboard**: View and manage incoming client search mandates, candidate resume submissions, and general inquiries.

### 3. Secure File Uploads & Email Alerts
- Powered by `multer` with file size limits (25MB) and collision-free filenames stored in `backend/uploads/`.
- Automated email alerts dispatched to recruiters whenever a new candidate CV, mandate document, or inquiry is submitted.

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
