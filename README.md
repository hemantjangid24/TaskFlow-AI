# TaskFlow AI ⚡

> AI-Powered Smart Task & Project Management Platform  
> Built with MERN Stack + Google Gemini AI

---

## 📸 Screenshots

| Page | Description |
|------|-------------|
| `/` | Landing page — hero, features, pricing, testimonials |
| `/auth/login` | Login with email + password |
| `/auth/signup` | Register with OTP email verification |
| `/dashboard` | Metrics, charts, recent boards, activity feed |
| `/boards` | Board grid with progress bars and task stats |
| `/boards/:id/kanban` | Kanban with drag-and-drop, filters, AI assistant |
| `/settings` | Theme toggle (light/dark/system), notifications |

> **Note:** Deploy to Vercel and add screenshots of the live app here.

---

## 🚀 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS v3, Framer Motion, Zustand, TanStack Query, React Hook Form, Recharts, @hello-pangea/dnd |
| **Backend** | Node.js, Express.js, Zod (validation) |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT (Bearer token), bcryptjs (12 rounds), OTP email verification |
| **AI** | Google Gemini 1.5 Flash (server-side only) |
| **Email** | Nodemailer (Gmail SMTP / Ethereal fallback) |
| **Testing** | Jest + Supertest |

---

## ✅ Features Implemented

### Authentication
- Register with name, email, password
- Password validation: 8+ chars, uppercase, lowercase, number, special character
- Password strength meter with live checklist
- Email OTP verification (6-digit, 10-min TTL, auto-delete via MongoDB TTL index)
- OTP resend with 60-second cooldown
- JWT login with persistent session (localStorage)
- Forgot password flow (email reset link, 15-min expiry)
- Reset password with token verification
- Protected routes + auto-redirect on 401

### Board Management
- Create, edit (rename), delete boards with confirmation
- Board color + emoji picker
- Task count stats per board (Todo / Active / Done)
- Progress bar per board
- Full-text search across boards
- Empty state with CTA

### Kanban Workspace
- 4 columns: Todo, In Progress, In Review, Done
- Drag-and-drop between columns (@hello-pangea/dnd)
- Optimistic UI updates on drag
- **Filter by priority** (urgent / high / medium / low)
- **Sort by**: priority, due date ascending, due date descending, default order
- **Overdue-only filter** toggle
- Active filter chips with individual clear buttons
- Task count per column

### Task Management
- Create task (title, description, status, priority, due date, effort hours, labels)
- Edit task via slide-in drawer
- Delete, duplicate, archive tasks
- Visual overdue indicator (red date)
- Label management (add/remove inline)

### AI Assistant (Gemini 1.5 Flash)
- "Suggest Estimate" button on every task
- Returns: effort hours, due date, priority, reasoning
- Server-side only — API key never reaches browser
- Loading animation, retry on error, graceful fallback
- Apply suggestion with one click

### Dashboard
- Metric cards: Total boards, Active tasks, Completed, Overdue
- Bar chart: Tasks per board (Recharts)
- Pie chart: Task status breakdown
- Recent boards list
- Activity feed (last 8 events)

### Global Search (⌘K / Ctrl+K)
- Opens search modal from anywhere in the app
- Searches boards and tasks simultaneously
- Debounced (300ms) to avoid excessive requests
- Quick navigation links when no query entered
- Keyboard hint footer (↵ select, ↑↓ navigate, Esc close)

### UI/UX
- Fully responsive: mobile, tablet, desktop
- Dark / Light / System theme with localStorage persistence
- Anti-flash theme script in index.html (no white flash)
- Custom 404 page with floating animations and quick links
- Error boundary catches React crashes gracefully
- Loading skeletons on all data-fetching pages
- Toast notifications for all actions
- Framer Motion animations throughout

### Security
- bcryptjs with 12 salt rounds
- JWT with configurable expiry
- Zod server-side validation on all POST/PATCH routes
- Rate limiting: 100 req/15min globally, 20 req/15min on auth routes
- Helmet.js HTTP security headers
- CORS whitelist
- OTP attempt limiting (max 5 before lockout)
- Password reset token hashed with SHA-256 before DB storage
- Email enumeration prevention on forgot-password

---

## 🗂️ Project Structure

```
taskflow-ai/
├── client/                    # React 18 + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── common/        # Button, Input, Modal, Skeleton, ErrorBoundary, GlobalSearch
│       │   ├── layout/        # AppLayout, Sidebar, Topbar
│       │   └── task/          # TaskDrawer, CreateTaskModal
│       ├── pages/
│       │   ├── auth/          # Login, Signup (OTP), ForgotPassword, ResetPassword
│       │   ├── dashboard/     # DashboardPage
│       │   ├── boards/        # BoardsPage
│       │   ├── kanban/        # KanbanPage (with filters/sort)
│       │   ├── profile/       # ProfilePage
│       │   ├── settings/      # SettingsPage
│       │   └── landing/       # LandingPage
│       ├── stores/            # Zustand: authStore, uiStore
│       └── lib/               # api.js (axios), utils.js
│
└── server/                    # Node.js + Express backend
    └── src/
        ├── config/            # db.js, mailer.js, gemini.js
        ├── controllers/       # auth, board, task, ai, user, activity
        ├── middleware/        # auth, error, validate (Zod)
        ├── models/            # User, Board, Task, Activity, Notification, OTP
        ├── routes/            # auth, boards, tasks, ai, user, activities
        ├── services/          # auth.service (register/login/OTP/forgot/reset)
        ├── tests/             # auth.test.js, boards.test.js (Jest + Supertest)
        ├── utils/             # jwt.js, password.js, crypto.js, apiResponse.js
        └── validators/        # schemas.js (Zod)
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier)
- Google Gemini API key — [get free key here](https://aistudio.google.com)
- Gmail account (for email OTP) — optional, falls back to console

### 1. Clone and install

```bash
git clone <your-repo-url>
cd taskflow-ai
cd server && npm install
cd ../client && npm install
```

### 2. Configure server environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskflow
JWT_SECRET=your_super_secret_min_32_characters_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Email (OTP + Password Reset)
# Get Gmail App Password: https://myaccount.google.com/apppasswords
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_16_char_app_password
EMAIL_FROM=TaskFlow AI <your_gmail@gmail.com>
```

> **No SMTP configured?** OTPs and reset links print to the server terminal automatically. You can still test the full flow.

### 3. Run development servers

**Terminal 1 — Backend (port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend (port 5173):**
```bash
cd client
npm run dev
```

Open **http://localhost:5173**

### 4. Run backend tests

```bash
cd server
npm test
```

---

## 🌐 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ✗ | Step 1: validate + send OTP |
| POST | `/auth/verify-otp` | ✗ | Step 2: verify OTP, create account |
| POST | `/auth/resend-otp` | ✗ | Resend OTP to email |
| POST | `/auth/login` | ✗ | Login, receive JWT |
| GET  | `/auth/me` | ✓ | Get current user |
| POST | `/auth/forgot-password` | ✗ | Send password reset email |
| POST | `/auth/reset-password` | ✗ | Reset password with token |

### User

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/user/me` | ✓ | Get profile |
| PATCH | `/user/me` | ✓ | Update name/avatar/preferences |
| PATCH | `/user/password` | ✓ | Change password |
| GET | `/user/dashboard-stats` | ✓ | Metric counts for dashboard |

### Boards

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/boards` | ✓ | List all boards (with task stats) |
| POST | `/boards` | ✓ | Create board |
| GET | `/boards/:id` | ✓ | Get single board |
| PATCH | `/boards/:id` | ✓ | Rename/edit board |
| DELETE | `/boards/:id` | ✓ | Delete board + tasks |

### Tasks

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/tasks/board/:boardId` | ✓ | All tasks for a board |
| POST | `/tasks/board/:boardId` | ✓ | Create task |
| GET | `/tasks/search?q=` | ✓ | Search tasks by title/label |
| GET | `/tasks/:id` | ✓ | Get single task |
| PATCH | `/tasks/:id` | ✓ | Update task |
| PATCH | `/tasks/:id/move` | ✓ | Move task to column |
| DELETE | `/tasks/:id` | ✓ | Delete task |
| POST | `/tasks/:id/duplicate` | ✓ | Duplicate task |
| PATCH | `/tasks/:id/archive` | ✓ | Archive task |

### AI

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/ai/suggest` | ✓ | Get Gemini AI estimate |

**Request body:**
```json
{ "title": "string", "description": "string", "priority": "medium", "labels": [] }
```
**Response:**
```json
{ "effortHours": 4, "suggestedDueDate": "2026-07-05", "priority": "high", "reasoning": "..." }
```

### Activities

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/activities?limit=20&page=1` | ✓ | Paginated activity timeline |

---

## 🤖 AI Integration

**Provider:** Google Gemini 1.5 Flash  
**Why:** Generous free tier, fast response time (~1–2s), structured JSON output, no credit card required for free tier.

**How it works:**
1. User clicks "Suggest Estimate" on any task in the drawer
2. Frontend calls `POST /api/ai/suggest` with task title, description, priority, labels
3. Backend builds a structured prompt and sends to Gemini API
4. Gemini returns JSON: `{ effortHours, suggestedDueDate, priority, reasoning }`
5. Response is shown to user — they can apply or ignore it
6. If Gemini fails (key missing, quota exceeded, timeout), a sensible fallback is returned and the app continues working

The Gemini API key is stored in `server/.env` and never sent to the browser.

---

## 🚢 Deployment

### Backend → Render

1. Push to GitHub
2. New Web Service on Render → root: `server`
3. Build: `npm install` · Start: `npm start`
4. Add all env vars from `.env.example`
5. Note the deployed URL: `https://taskflow-api-xxxx.onrender.com`

### Frontend → Vercel

1. New project on Vercel → root: `client`
2. Build: `npm run build` · Output: `dist`
3. Add env var: `VITE_API_URL=https://taskflow-api-xxxx.onrender.com`
4. Update `client/src/lib/api.js` — change baseURL to:
   ```js
   baseURL: import.meta.env.VITE_API_URL + '/api'
   ```

### Database → MongoDB Atlas

1. Create free M0 cluster at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Whitelist `0.0.0.0/0` for Render (or Render's IP range)
3. Use connection string in `MONGO_URI`

---

## 🔑 Test Credentials (Demo)

After deploying, add test credentials here:

```
Email:    abc1de3@gmail.com
Password: @Bc1de3
```

> Or register with any email — OTP will appear in the server logs if SMTP is not configured.

---

## ⚠️ Known Issues & Limitations

1. **Email delivery** — Requires Gmail App Password or other SMTP. Without it, OTPs print to the server console (fine for local dev, but production needs SMTP configured).

2. **Gemini quota** — Free tier has rate limits (~60 requests/min). If exceeded, the app falls back gracefully with default estimates.

3. **File uploads** — Avatar is a colour picker only; image upload is not implemented.

4. **Real-time updates** — Changes by one user don't reflect instantly for another user on the same board (no WebSocket/SSE). A page refresh shows the latest data.

5. **Board sharing** — Boards are currently single-user only. Collaboration/multi-member boards are not implemented.

6. **Pagination** — Task lists are not paginated. Boards with 100+ tasks may be slow to load.

7. **Tests** — Only auth and boards endpoints have automated tests. Task, AI, and activity endpoints are covered by manual testing.

---

## 🔮 What I Would Improve With More Time

- **Real-time collaboration** via WebSockets (Socket.io) — live cursor, live card moves
- **Board sharing** — invite members by email, read/edit permissions
- **Subtasks** — nested checklist items inside each task
- **Recurring tasks** — daily/weekly/monthly recurrence
- **Email digest** — daily summary of overdue and upcoming tasks
- **Server-side pagination** — infinite scroll on boards and tasks
- **Mobile app** — React Native port using the same backend API
- **More AI features** — auto-categorise tasks, natural-language "add task" input
- **End-to-end tests** — Playwright or Cypress for critical flows

---

## 📄 License

MIT — built for the TaskFlow Full Stack Assignment.
