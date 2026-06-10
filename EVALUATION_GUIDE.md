# Gully XI Premier League — Evaluation Guide

> **Project URL:** *(Deploy on Vercel/Railway/Render and paste your live link here)*  
> **Custom Domain:** *(Optional — e.g., gullyxi.com / gullyxi.pk / yourgaminghub.net)*  
> **Date:** June 2026  

---

## 1. Project Reach & Vision (Elevator Pitch)

**"Gully XI Premier League"** is a full-stack web platform built to digitize Pakistan's street-cricket (gully cricket) culture. It allows:

- **Players** to register for tapeball tournaments online with real payment gateway simulations.
- **Admins** to manage registrations, track payments, and maintain a live roster via a protected console.
- **Spectators** to browse schedules, view interactive venue maps, filter players by rank/game, and watch real-time leaderboard updates.

The project demonstrates production-grade practices: REST API design, relational database normalization, input validation on both frontend and backend, dual-database fallback (MongoDB → SQLite), responsive multi-page architecture, and a fully functional mock-payment checkout system.

---

## 2. Rubric-to-Feature Mapping (How to Score 100/100)

| Rubric Component | Marks | Where It Lives | What to Show the Evaluator |
|---|---|---|---|
| **Website Design & UI** | 10 | Every page | Cyberpunk/esports aesthetic, neon glows, 3D GLB model viewer (`/contact`), animated butterfly canvas, flip-card player profiles, glassmorphism panels, custom SVG cricket-ball logo. |
| **Navigation & Multi-page Structure** | 5 | `app/` folder | 7 pages: **Home, Schedule, Players, Leaderboard, Contact, Login, Signup**. Sticky navbar with active-route highlighting + mobile hamburger menu (Sheet). Breadcrumb-style headers on every page. |
| **Validation** | 10 | Login, Signup, Contact, Registration, Payment | Client-side + server-side validation everywhere: email regex, password strength meter (5 criteria), age range (10–60), required fields, Pakistani mobile format (`03XXXXXXXXX`), card number (15–16 digits), expiry (`MM/YY`), CVC (3–4 digits), crypto TX hash (≥10 chars). |
| **Authentication System** | 5 | `/login`, `/signup` | Complete auth UI with form states, error handling, password show/hide toggle, password-strength visualization, success confirmation screens, and redirect to leaderboard. |
| **Search & Filtering** | 10 | `/players` → `PlayersFilter` | Real-time search by **name, nickname, or mohalla**. Dropdown filters for **Game Type** and **Rank Level** (Champion → Elite → Ace → Pro → Rising). Clear-filters button. Result count display. |
| **Theme System** | 10 | `ThemeToggle`, `ThemeInitializer`, `use-theme.ts` | Three-mode toggle: **Light / Dark / System**. Persists in `localStorage`. No hydration flicker (inline `<script>` in `<head>` checks preference before React mounts). Icon rotates on switch. |
| **Backend Development** | 10 | `backend/server.js` | Express.js server with CORS, JSON parsing, 10+ REST endpoints, request validation, mock authorization logic (declined cards ending in `0000`, failed wallets ending in `000`), and graceful MongoDB → SQLite fallback on startup. |
| **Database Design** | 10 | `backend/database.js`, `backend/database-mongo.js` | Two tables/collections: **`registrations`** (9 fields, TEXT PK) and **`payments`** (8 fields, TEXT PK, FK to registration). Normalized schema. Auto-initialization on server boot. MongoDB Mongoose schemas as secondary option. |
| **CRUD Operations** | 10 | Tournament Registration + Leaderboard | **Registrations:** Create (POST `/registrations`), Read (GET `/registrations`), Update (PUT `/registrations/:id`), Delete (DELETE `/registrations/:id`). **Payments:** Create (POST `/payments/process`), Read (GET `/payments`), Delete (DELETE `/payments/:id`). **Leaderboard:** Add player, remove player, persist to `localStorage`. Admin portal edits registrations inline. |
| **Map API** | 10 | `/contact` → `VenueMap` | Embedded **OpenStreetMap** iframe with bounding box covering Pakistan. 9 clickable venue markers with lat/lng coordinates. Selected venue reveals detail card with "View on OpenStreetMap" deep-link. |
| **Payment API** | 10 | `POST /payments/process`, Admin Payments Log | Full mock checkout supporting **JazzCash, EasyPaisa, Stripe, PayPal, USDT, BTC, ETH**. Gateway-specific validation rules. On success: inserts registration → inserts payment → returns receipt with TXID. Admin portal fetches live payment history from database and supports deletion. |

**Total = 100 Marks**  
*Bonus: Deploy on a custom domain = +25% bonus marks*

---

## 3. How to Demonstrate Each Feature (Live Demo Script)

### A. Home Page (`/`)
- Scroll through the hero section with the **3D butterfly canvas**.
- Mention the cyber-grid background and neon-border glow effects.
- Click **"Open Leaderboard"** CTA to prove routing works.

### B. Schedule (`/schedule`)
- Show the full match table with statuses: **Completed, Live (pulsing red), Upcoming, Final (accent border)**.
- Point out responsive hiding of columns on mobile.

### C. Players (`/players`)
1. **Tournament Registration** (top half):
   - Fill the form: name, nickname, select mohalla, contact number, batting style, choose **JazzCash**.
   - Click **"Proceed to Payment"** → enter mobile number `03001234567` → confirm.
   - Show the **success receipt** with Transaction ID, Gateway Ref, Amount, Timestamp.
   - Switch to **Admin Portal** tab → verify the new player appears in the roster with `Paid` status.
   - Click **Payments Log** sub-tab → verify the payment record appears with `PAY-XXXXXXX` ID.
   - Demonstrate **Delete** on a payment or registration to prove CRUD.
   - Demonstrate **Edit** (pencil icon) on a registration → change nickname → Save → watch table update.

2. **Player Filter** (bottom half):
   - Type in the **search box** (e.g., "Ahmed") → cards filter instantly.
   - Use **Game Type** and **Rank Level** dropdowns.
   - Click a **player card** to flip it and reveal stats (batting style, total runs).

### D. Leaderboard (`/leaderboard`)
- **Local Rankings:** Add a player via the form (name, mohalla, runs) → watch them sort automatically by score. Remove a player with the trash icon.
- **Global Rankings:** Show the LootLocker integration section (fetches real leaderboard data from external API).

### E. Contact (`/contact`)
- Fill the contact form with invalid email → show inline error.
- Submit valid data → show success state.
- Scroll down to the **Venue Map** → click any stadium marker → show coordinates + OpenStreetMap link.
- Point out the **interactive GLB 3D model** in the sidebar.

### F. Login (`/login`) & Signup (`/signup`)
- **Login:** Enter invalid email → error. Enter valid data → success screen → redirect.
- **Signup:** Show password strength bar filling as you type. Type mismatching passwords → "Passwords do not match". Fix → "Passwords match". Submit → welcome screen.

### G. Theme Toggle
- Click the **sun/moon/settings icon** in the navbar. Cycle through Light → Dark → System. Reload page → theme persists.

---

## 4. Backend & Database Deep Dive (For Oral Exam / Viva)

### Tech Stack
- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI, Three.js (R3F), Recharts
- **Backend:** Node.js, Express.js 5, CORS
- **Database:** SQLite3 (primary fallback) + MongoDB/Mongoose (optional primary)
- **External APIs:** OpenStreetMap (embed), LootLocker (global leaderboard)

### Database Schema
```sql
-- registrations
id TEXT PRIMARY KEY,
name TEXT NOT NULL,
nickname TEXT NOT NULL,
mohalla TEXT NOT NULL,
contactNumber TEXT NOT NULL,
battingStyle TEXT NOT NULL,
paymentMethod TEXT,
paymentStatus TEXT DEFAULT 'Pending',
registeredAt TEXT NOT NULL

-- payments
id TEXT PRIMARY KEY,
registrationId TEXT NOT NULL,
amount INTEGER NOT NULL,
currency TEXT NOT NULL,
method TEXT NOT NULL,
status TEXT NOT NULL,
txHash TEXT,
paymentDate TEXT NOT NULL
```

### API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server + DB status |
| GET | `/players` | Static player JSON (supports `?game=` filter) |
| GET | `/tournaments` | Static tournament JSON |
| GET | `/teams` | Static team JSON |
| GET | `/registrations` | List all registrations |
| POST | `/registrations` | Create a registration |
| PUT | `/registrations/:id` | Update a registration |
| DELETE | `/registrations/:id` | Delete a registration |
| POST | `/payments/process` | **Checkout:** validates payment + creates reg + creates payment |
| GET | `/payments` | List all payment records |
| DELETE | `/payments/:id` | Delete a payment record |

### Validation Rules (Payment API)
- **JazzCash / EasyPaisa:** `^(03|923|\+923)\d{9}$`
- **Stripe / PayPal:** Card = 15–16 digits, Expiry = `MM/YY`, CVC = 3–4 digits
- **Crypto (USDT/BTC/ETH):** TX hash ≥ 10 characters
- **Mock Decline:** Cards ending in `0000` → `402 Payment Required`. Wallets ending in `000` → `402 Payment Required`.

---

## 5. Deployment Guide (Bonus Marks)

### Option A: Vercel (Frontend) + Railway/Render (Backend) — FREE
1. Push code to **GitHub**.
2. Import repo into [Vercel](https://vercel.com). Build command: `next build`. Output: `.next`.
3. Deploy backend to [Railway](https://railway.app) or [Render](https://render.com):
   - Root directory: `backend`
   - Start command: `node server.js`
   - Set env var: `PORT=3000`
4. In Vercel, add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.com`
5. **Custom Domain:** Buy a domain (Namecheap, Cloudflare, GoDaddy). Add it to Vercel project settings. Enable SSL.

### Option B: Single-Server Deployment
- Use a VPS (DigitalOcean, AWS EC2, Hetzner).
- Run frontend: `pnpm build && pnpm start` (port 3001).
- Run backend: `cd backend && node server.js` (port 3000).
- Use **Nginx reverse proxy** + **PM2** for process management.
- Point custom domain A-record to server IP.

### Required Screenshots for Submission
1. Homepage hero section
2. Player registration form + payment modal
3. Admin portal with roster table
4. Admin portal with Payments Log
5. Contact page with venue map
6. Leaderboard with added players
7. Login / Signup pages
8. Mobile view (responsive hamburger menu)
9. Database file or API response (JSON) showing records
10. Theme toggle (Light vs Dark mode)

---

## 6. Quick Commands for Evaluator

```bash
# Install all dependencies
pnpm install
cd backend && pnpm install

# Run everything (frontend on :3001, backend on :3000)
pnpm run dev:all

# Or run separately
pnpm run dev:frontend   # Next.js
pnpm run dev:backend    # Express + SQLite

# Build for production
pnpm run build
```

---

## 7. Common Questions & Answers

**Q: Is the payment system real?**  
A: It is a **mock integration** designed for academic demonstration. It validates input formats exactly like real gateways (Stripe, JazzCash, EasyPaisa, Crypto) and performs real database transactions on success, but no actual money is transferred. This satisfies the rubric without requiring merchant accounts.

**Q: Why SQLite instead of MongoDB?**  
A: The server tries MongoDB first (if `MONGODB_URI` is set). If unavailable, it gracefully falls back to SQLite. Both share the same function interface, proving database-agnostic architecture.

**Q: How is the theme system implemented without flicker?**  
A: A small inline script runs in `<head>` before React hydrates, checking `localStorage` and `prefers-color-scheme`, then toggles the `dark` class immediately.

**Q: Where is the map API used?**  
A: OpenStreetMap iframe embed on the Contact page, plus interactive venue cards with real lat/lng coordinates linking directly to OpenStreetMap.

---

## 8. File Checklist (Ensure These Exist in Submission)

- [ ] `app/` — all 7 page routes
- [ ] `components/tournament-registration.tsx` — payment + admin portal
- [ ] `components/venue-map.tsx` — map API
- [ ] `components/players-filter.tsx` — search & filtering
- [ ] `components/theme-toggle.tsx`, `components/theme-initializer.tsx`, `lib/use-theme.ts` — theme system
- [ ] `app/login/page.tsx`, `app/signup/page.tsx` — auth system
- [ ] `backend/server.js` — Express API
- [ ] `backend/database.js` — SQLite CRUD
- [ ] `backend/database-mongo.js` — MongoDB CRUD
- [ ] `backend/models/Registration.js`, `backend/models/Payment.js` — Mongoose schemas
- [ ] `public/data/` or `backend/data/` — static JSON + SQLite file
- [ ] Screenshots (10+) as specified above
- [ ] Live URL (deployed project)
- [ ] *(Bonus)* Custom domain purchased and configured

---

**Good luck with your evaluation! 🏏**
