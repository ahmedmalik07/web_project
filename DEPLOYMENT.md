# Deployment Guide — Gully XI Premier League

## Status
- ✅ **GitHub:** Pushed to `https://github.com/ahmedmalik07/web_project.git`
- ⏳ **Vercel:** Ready to deploy (requires your login)
- ⏳ **Backend:** Ready to deploy on Render/Railway (optional for full-stack live)

---

## Option 1: Frontend Only on Vercel (Fastest — 5 minutes)

Best for: Getting a live URL quickly for evaluation.

> ⚠️ **Note:** The backend (Express + SQLite) will NOT run on Vercel. The site will look perfect, but database features (registration, payment API) won't work unless you also deploy the backend separately (see Option 2).

### Steps

1. **Go to Vercel Web Dashboard**
   - Open https://vercel.com/new
   - Sign in with your GitHub account
   - Import the repository: `ahmedmalik07/web_project`

2. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (leave as default)
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

3. **Environment Variables**
   Since there is no live backend yet, set:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```
   *(This means API features only work when you also run `pnpm run dev:backend` locally and visit the local frontend, but the deployed site will still display all static content, schedules, player cards, contact page, login/signup UI, leaderboard localStorage features, and maps.)*

4. **Deploy**
   - Click **Deploy**
   - Wait 2–3 minutes
   - You will get a URL like: `https://web-project-xyz.vercel.app`

5. **Custom Domain (Bonus +25%)**
   - In Vercel project → **Settings** → **Domains**
   - Buy a domain (e.g., `gullyxi.pk` from Namecheap or `yourgaminghub.net` from Cloudflare)
   - Add it to Vercel and follow DNS instructions
   - Vercel automatically provisions SSL

---

## Option 2: Full-Stack Live Deployment (Frontend + Backend + Database)

Best for: A fully working live site where registration and payment API work for evaluators without running anything locally.

### Architecture
```
User → Vercel (Next.js Frontend)
            ↓
      Render/Railway (Express Backend)
            ↓
      MongoDB Atlas (Cloud Database)
```

We use **MongoDB Atlas** instead of SQLite because Vercel/Render serverless filesystems don't persist SQLite writes reliably.

---

### Step A: Deploy Backend on Render (Free)

1. Go to https://dashboard.render.com and sign up with GitHub
2. Click **New → Web Service**
3. Connect your GitHub repo: `ahmedmalik07/web_project`
4. Configure:
   - **Name:** `gully-xi-api`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install` (or `pnpm install`)
   - **Start Command:** `node server.js`
   - **Plan:** Free

5. **Environment Variables:**
   ```
   MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/gullyxi?retryWrites=true&w=majority
   PORT=3000
   ```
   *(Get the URI from MongoDB Atlas setup below)*

6. Click **Create Web Service**
7. Wait for deploy. You will get a URL like: `https://gully-xi-api.onrender.com`

---

### Step B: Set Up MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/atlas and sign up
2. Create a **Shared (Free)** cluster
3. In Database Access → Create a user with password
4. In Network Access → Add IP Address → `0.0.0.0/0` (allow from anywhere, needed for Render)
5. In Databases → Click **Connect** → **Drivers** → **Node.js**
6. Copy the connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gullyxi?retryWrites=true&w=majority
   ```
7. Paste this into Render's environment variable `MONGODB_URI`

---

### Step C: Re-deploy Frontend with Live API URL

1. Go back to your Vercel project dashboard
2. Go to **Settings → Environment Variables**
3. Update or add:
   ```
   NEXT_PUBLIC_API_URL=https://gully-xi-api.onrender.com
   ```
4. Go to **Deployments** tab → click the latest deployment → **Redeploy**

Now your full-stack app is live:
- Frontend: `https://web-project-xyz.vercel.app`
- Backend: `https://gully-xi-api.onrender.com`
- Database: MongoDB Atlas

---

## Option 3: Deploy Using Vercel CLI (What I tried)

Since Vercel requires personal authentication, you need to log in yourself:

```bash
# 1. Install Vercel CLI (already done on this machine)
npm install -g vercel

# 2. Log in (opens browser)
vercel login

# 3. Deploy from project root
vercel --prod
```

The CLI will link to your GitHub repo and deploy automatically.

---

## Important Notes for Evaluation

### SQLite vs MongoDB in Production
- **SQLite** works perfectly for local demos (`pnpm run dev:all`). The database file is at `backend/data/database.sqlite`.
- **MongoDB** is required for live serverless deployment because platforms like Render/Vercel reset filesystems on redeploy.
- The backend code already supports both: it tries MongoDB first, then falls back to SQLite.

### What Works on Vercel Frontend-Only
| Feature | Works? | Notes |
|---|---|---|
| Home page UI | ✅ Yes | Fully static |
| Schedule page | ✅ Yes | Static data |
| Player cards & flip | ✅ Yes | Static data + localStorage |
| Contact form UI | ✅ Yes | Form submits locally |
| Venue Map | ✅ Yes | OpenStreetMap embed |
| Login/Signup UI | ✅ Yes | Form validation works |
| Theme toggle | ✅ Yes | localStorage |
| Leaderboard (local) | ✅ Yes | localStorage CRUD |
| Tournament Registration | ❌ No | Needs backend API |
| Payment API | ❌ No | Needs backend API |
| Admin Portal | ❌ No | Needs backend API |
| Global Leaderboard | ⚠️ Partial | LootLocker might need CORS |

### Recommendation for Evaluators
If the evaluator asks to see the database and payment API working:
1. Show them the **live deployed frontend** for design and static pages.
2. Open a terminal locally and run `pnpm run dev:all`.
3. Visit `http://localhost:3001` to demonstrate the full database + payment API features.
4. This proves both the live URL (bonus marks) AND the working backend (rubric marks).

---

## Quick Reference: Environment Variables

### Local Development (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Production (Vercel + Render)
**Vercel:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
```

**Render:**
```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gullyxi
```

---

## Need Help?

If anything fails:
1. Check `vercel --logs` or the Vercel dashboard **Deployments → Logs**
2. Ensure `backend/.env` and `.env.local` are NOT committed (they are in `.gitignore`)
3. For Render backend issues, check **Logs** tab in Render dashboard
4. For MongoDB issues, ensure IP `0.0.0.0/0` is whitelisted in Atlas
