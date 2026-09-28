# Ministry of Tribal Affairs (MoTA) Scholarship & Fellowship Portal

AI-enabled, multi-stakeholder digital governance platform designed for the Ministry of Tribal Affairs to automate, monitor, and streamline scholarship and fellowship lifecycle workflows (NFST, NOS, and Post-Matric schemes).

---

## Architecture Overview

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router v7, Lucide Icons, Recharts.
- **Backend**: Node.js (ES Modules), Express 4.x, Mongoose 8.x, JWT Authentication, Multer file upload handling.
- **Database**: MongoDB Atlas.
- **Deployment Platform**: **Vercel** (Frontend deployed to Edge CDN; Backend deployed as Serverless Functions).

---

## Deployment Strategy: Separate vs Unified

### Recommended: Two Separate Vercel Projects

For production environments, **deploying Frontend and Backend as two separate Vercel projects is strongly recommended**:

1. **Frontend Optimization**: Pure static assets hosted on Vercel's global Edge CDN with instant cache invalidation, sub-second TTFB, and zero cold starts.
2. **Backend Serverless Isolation**: Express backend runs in Node.js serverless functions with isolated dependencies and environment secrets (`MONGO_URI`, `JWT_SECRET`).
3. **Independent Lifecycles**: Frontend UI updates and backend API rollouts/reverts can be shipped independently without rebuilding the other.
4. **Zero Secret Leakage**: Strict boundary preventing server credentials from accidentally bundling into client browser code.

> **Note**: A unified single-project deployment configuration (`vercel.json` at root) is also provided if you prefer a single repository deployment.

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v20+ recommended).
- **npm**: v9.0.0 or higher.
- **MongoDB Atlas Cluster**: A live MongoDB instance.
  - In MongoDB Atlas, navigate to **Network Access** and ensure **`0.0.0.0/0` (Allow Access from Anywhere)** is added to the IP Access List because Vercel Serverless Functions execute on dynamic IP addresses.

---

## Environment Variables

### Backend Environment Variables (`BACKEND/.env`)

| Variable Name | Required | Default / Example | Purpose |
|---|---|---|---|
| `NODE_ENV` | Yes | `production` | Set to `production` in Vercel to activate secure headers and strict checks. |
| `PORT` | No | `5000` | Port for local standalone HTTP server. |
| `MONGO_URI` | Yes | `mongodb+srv://user:pass@cluster.mongodb.net/scholarship` | MongoDB Atlas connection string. |
| `JWT_SECRET` | Yes | `min-32-char-random-secret` | Cryptographic secret for signing applicant/officer JWT tokens. |
| `JWT_EXPIRES_IN` | No | `7d` | Token session validity duration. |
| `CLIENT_URL` | Yes | `https://your-frontend.vercel.app` | Allowed frontend origin(s) for CORS. Can be a single URL or comma-separated list. |
| `UPLOAD_DIR` | No | `/tmp/uploads/documents` | Storage folder for uploaded documents. Automatically defaults to `/tmp/uploads/documents` on Vercel. |

### Frontend Environment Variables (`FRONTEND/.env`)

| Variable Name | Required | Default / Example | Purpose |
|---|---|---|---|
| `VITE_API_URL` | Yes (in prod) | `https://your-backend.vercel.app/api` | Base URL of the backend API. In local dev, defaults to `/api` (proxied by Vite). |

---

## Local Development Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone <repo-url>
cd SCHOLARSHIP

# Install Backend dependencies
cd BACKEND
npm install

# Install Frontend dependencies
cd ../FRONTEND
npm install
```

### 2. Configure Local Environment

Create `BACKEND/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/scholarship
JWT_SECRET=mota_dev_jwt_secret_tribal_affairs_2026
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

Create `FRONTEND/.env` (optional, defaults to `/api`):
```env
VITE_API_URL=/api
```

### 3. Seed Default Demonstration & Admin Accounts

Populate the database with pre-configured officer accounts (Admin, Screening Officer, Verification Officer, Demo Applicant) and statutory schemes (NFST, NOS, Post-Matric):

```bash
cd BACKEND
npm run seed
```

Default credentials seeded:
- **Admin**: `admin@mota.gov.in` / `Password@123`
- **Verification Officer**: `verifier@mota.gov.in` / `Password@123`
- **Screening Officer**: `screening@mota.gov.in` / `Password@123`
- **Demo Applicant**: `applicant@test.com` / `Password@123`

### 4. Run Locally

In Terminal 1 (Backend):
```bash
cd BACKEND
npm run dev
```

In Terminal 2 (Frontend):
```bash
cd FRONTEND
npm run dev
```

Visit `http://localhost:5173` to test the application.

---

## Step-by-Step Vercel Deployment

### Phase 1: Deploy Backend to Vercel

1. Log into your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** > **Project** and import your Git repository.
3. In **Project Settings**:
   - **Project Name**: `mota-scholarship-backend` (or your chosen name)
   - **Framework Preset**: **Other**
   - **Root Directory**: Click *Edit* and select **`BACKEND`**
4. Expand **Environment Variables** and add:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: Your MongoDB Atlas URI (e.g., `mongodb+srv://...`)
   - `JWT_SECRET`: A long random secret key
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `http://localhost:5173` (you can update this with your frontend Vercel URL once Phase 2 is complete)
5. Click **Deploy**.
6. When deployment finishes, copy your backend URL:
   `https://mota-scholarship-backend.vercel.app`
7. Test the health endpoint:
   `https://mota-scholarship-backend.vercel.app/api/health`

---

### Phase 2: Deploy Frontend to Vercel

1. In the Vercel Dashboard, click **Add New...** > **Project** and import the same repository.
2. In **Project Settings**:
   - **Project Name**: `mota-scholarship-frontend` (or your chosen name)
   - **Framework Preset**: **Vite**
   - **Root Directory**: Click *Edit* and select **`FRONTEND`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Expand **Environment Variables** and add:
   - `VITE_API_URL`: `https://mota-scholarship-backend.vercel.app/api` (use the URL from Phase 1)
4. Click **Deploy**.
5. Once deployed, note your frontend URL:
   `https://mota-scholarship-frontend.vercel.app`

---

### Phase 3: Link Backend CORS to Frontend Domain

1. Go back to your **Backend Project** on Vercel (`mota-scholarship-backend`).
2. Navigate to **Settings** > **Environment Variables**.
3. Edit `CLIENT_URL` to include your production frontend URL:
   `https://mota-scholarship-frontend.vercel.app`
4. Redeploy the backend (or trigger a new commit) for the updated `CLIENT_URL` to take effect.
   *(Note: The backend CORS configuration automatically permits all `*.vercel.app` preview deployments out-of-the-box).*

---

## Alternative: Unified Monorepo Deployment

If you prefer deploying both Frontend and Backend together in a single Vercel project:

1. Import the root repository in Vercel.
2. Leave **Root Directory** as `./`.
3. In **Build Settings**:
   - **Build Command**: `npm --prefix FRONTEND install && npm --prefix FRONTEND run build`
   - **Output Directory**: `FRONTEND/dist`
4. Add all environment variables from both tables (`MONGO_URI`, `JWT_SECRET`, `VITE_API_URL=/api`, etc.).
5. Click **Deploy**.

---

## Production Verification Checklist

- [x] **API Health Check**: `GET /api/health` returns `HTTP 200` with database status `Connected`.
- [x] **SPA Routing**: Navigating directly to `/login`, `/schemes`, or `/applicant` works and does not return 404 on page refresh.
- [x] **CORS Preflight**: Preflight `OPTIONS` requests from frontend domains are authorized.
- [x] **Authentication Flow**: Signing in with seeded credentials generates a valid signed JWT.
- [x] **Document Viewing**: Document links adapt to `VITE_API_URL` without hardcoded localhost references.
- [x] **Serverless File Uploads**: Multer lazily writes to `/tmp` in serverless instances to avoid read-only filesystem errors (`EROFS`).

---

## Note on Serverless File Storage

Vercel Serverless Functions have an ephemeral filesystem (`/tmp`). While files can be temporarily stored and processed, they do not persist permanently across cold starts.

For long-term production file persistence:
- Connect an object store such as **Vercel Blob**, **AWS S3**, or **Cloudinary**.
- The `getFileUrl` helper and document controller are already structured to accept and pass through full external URLs seamlessly.
