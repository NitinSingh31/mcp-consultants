# MCP CONSULTANTS — Official Website & Executive Search Portal

Official corporate website and leadership talent portal for **MCP CONSULTANTS** (*"Protect. Shape. Advance"*).

Adapted from the structure, visual aesthetics, and executive positioning of ABC Consultants, with all references to IT & Telecommunications removed and replaced with comprehensive **Industry & Manufacturing** sectors.

---

## Features

- **React Single Page Application (SPA)**:
  - `/` (Home): Hero banner slider, 8 "All-Weather Allies" service cards, 20+ Industrial vertical practices, cross-functional leadership matrix, animated numerical counters, client testimonials, core manifesto, and corporate footer.
  - `/industries`: Dedicated industrial hub with real-time category filter pills and live search bar.
  - `/services`: Executive search, fractional CXO, board advisory, and 4-stage search methodology.
  - `/about`: Heritage narrative, leadership team profiles, and corporate values.
  - `/insights`: Annual flagship studies, CXO remuneration reports, and board succession whitepapers.
  - `/contact`: Multi-intent portal (*I Am Hiring*, *I am Seeking Leadership Roles* with CV upload, and *General Queries*).
  - `/admin`: Internal executive practice dashboard to view mandates, review candidate submissions, download attached CVs, and export data to CSV.

- **Backend & Database**:
  - **Database**: **MongoDB Atlas** using Mongoose for scalable, production cloud storage (`mcp_consultants` database).
  - Multipart resume upload handler saving documents into `/uploads`.
  - Automated recruitment email notifications via `nodemailer`.
  - REST endpoints for mandates, candidates, inquiries, and admin metrics.

---

## Quick Start (Local Run)

Requires **Node.js v18.0.0+**.

```powershell
# 1. Start the backend API server (Node.js + MongoDB)
node server.js

# 2. In a separate terminal, start the React Vite dev server
npm run dev
```

Open your browser:
* **Main Website**: [http://localhost:5173/](http://localhost:5173/)
* **Contact & Hiring Portal**: [http://localhost:5173/contact](http://localhost:5173/contact)
* **Internal Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## Deployment Guide (Putting it Live on the Internet)

### Option A: Render.com (Recommended - Fast & Free)
1. Push this folder to a GitHub or GitLab repository.
2. Log into [Render.com](https://render.com) and click **New Web Service**.
3. Connect your repository.
4. Settings:
   - **Environment**: `Node`
   - **Build Command**: *(leave blank or `npm install`)*
   - **Start Command**: `node server.js`
   - **Plan**: Free or Starter
5. Click **Create Web Service**. Your website is immediately live on a custom URL (e.g. `mcp-consultants.onrender.com`), and you can attach your custom domain `mcpconsultants.in`.

### Option B: Railway.app (With Persistent Disk)
1. Push repository to GitHub.
2. On [Railway.app](https://railway.app), choose **Deploy from GitHub repo**.
3. Railway automatically detects Node.js and runs `npm start`.
4. (Optional) Add a Persistent Volume mounted at `/uploads` and for `mcp_database.sqlite` so uploaded resumes and database persist across deploys.

### Option C: VPS / DigitalOcean / AWS EC2
```bash
git clone <your-repo-url>
cd mcp-consultants
npm install -g pm2
pm2 start server.js --name "mcp-website"
pm2 startup
pm2 save
```
Configure Nginx as a reverse proxy to forward port 80/443 to `localhost:3000`.

---

## Database Architecture: MongoDB Atlas

The backend is powered by **MongoDB Atlas** using Mongoose in `server.js`:

- Configured via `MONGODB_URI` in `.env`.
- Stores all client hiring mandates, executive candidate profiles, CV references, and contact inquiries in cloud collections (`mandates`, `candidates`, `inquiries`).
- Automatically managed schemas with timestamps and ObjectId references.
