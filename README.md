# Patient Case-Taking Software — SIH26047

A full-stack digital patient registration, case-taking, case history, and
dashboard application.

- **Frontend:** React + TypeScript + Vite (`/`)
- **Backend:** Node.js + Express + SQLite + JWT auth (`/server`)

This version replaces the original demo's browser `localStorage` persistence
with a real backend API and a SQLite database, so data now persists on the
server and is shared across devices/browsers instead of being local to one
browser tab.

## Requirements

- Node.js 18+ (Node.js 20+ recommended)
- npm

## 1. Set up and run the backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API starts on **http://localhost:4000** and automatically creates and
seeds a SQLite database file at `server/data/app.db` on first run, with the
same demo users/patients/cases the original frontend-only version shipped
with. See `server/README.md` (below) for the full API reference.

## 2. Set up and run the frontend

In a second terminal, from the project root:

```bash
npm install
npm run dev
```

Open the URL shown by Vite (normally `http://localhost:3000`). During
development, Vite proxies any `/api/*` request to `http://localhost:4000`
(configured in `vite.config.ts`), so the frontend and backend can talk to
each other without CORS issues.

## Demo login

- Doctor: `doctor` / `doctor123`
- Staff: `staff` / `staff123`
- Administrator: `admin` / `admin123`

These accounts are seeded directly into the backend's SQLite database (see
`server/src/db/seed.js`) — they are real accounts with bcrypt-hashed
passwords, not a frontend simulation.

## Production build

```bash
npm run build
npm run preview
```

For a real deployment, also set `VITE_API_URL` (e.g. in a `.env` file read
by Vite) to your deployed backend's URL, e.g.
`VITE_API_URL=https://api.example.com/api`, and set `CORS_ORIGIN` in the
backend's `.env` to your deployed frontend's URL.

## Check TypeScript

```bash
npm run lint
```

## Architecture

```
├── src/                      Frontend (React + TypeScript)
│   ├── lib/api.ts            Typed fetch client for the backend API
│   ├── features/             Feature-organized UI (auth, patients, cases, dashboard, docs)
│   └── types.ts              Shared TypeScript types (User, Patient, CaseRecord, Vitals)
│
└── server/                   Backend (Node.js + Express + SQLite)
    ├── src/db/               SQLite connection, schema, and demo-data seeding
    ├── src/middleware/auth.js  JWT verification + role-based access control
    ├── src/routes/           REST endpoints: auth, users, patients, cases, admin
    ├── src/serializers.js    Maps DB rows to the frontend's exact TS shapes
    └── src/app.js / index.js Express app assembly + entry point
```

## Main features

- Real authentication: bcrypt-hashed passwords, JWT-based sessions
- Role-based UI and access control (doctor / staff / administrator)
- Dashboard with live counts from the database
- Patient registration, editing, and search
- Patient list and details
- New case-taking form (7-section clinical intake)
- Case history, filterable by patient
- Admin-only user management API
- "Reset to demo data" — wipes and reseeds the database
- SIH documentation/demo tour

## Important

Change `JWT_SECRET` in `server/.env` to a long random value before deploying
this anywhere beyond a local demo or hackathon judging environment. The
public `/api/auth/register` endpoint lets a new account choose its own role
(matching the original demo's registration form) — restrict or remove this
in a production deployment where only administrators should be able to
create `administrator` or `doctor` accounts.
