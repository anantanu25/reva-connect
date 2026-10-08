# 🎓 Teacher-Student Communication Portal (Reva Connect)

> **Problem Statement:** Students and teachers need a secure platform for academic communication and information sharing.

A modern, responsive, role-secured web portal facilitating seamless, real-time academic communication, official broadcast distribution, subject-specific channels, doubt resolution forum, course resource repositories, and assignment workflows between university faculty and students.

Built with **HTML5**, **CSS3 (Custom Design System)**, **JavaScript (ES6+)**, **Supabase (PostgreSQL, Auth, RLS)**, deployed on **Vercel**, and version controlled with **GitHub**.

---

## 🌟 Key Highlights & Features

### 1. 🔐 Role-Based Access & Security (Faculty vs Student)
- Distinct interfaces and capabilities tailored for **Faculty (Teachers)** and **Students**.
- **Faculty Capabilities:** Broadcast official announcements, pin notices, verify student doubt solutions with a "Verified by Faculty" seal, upload course materials, create assignments, review and grade submissions.
- **Student Capabilities:** View announcements with acknowledgement receipts, engage in course channels, ask academic doubts with optional code snippets, vote on helpful answers, download course materials, and submit assignments with countdown deadlines.
- **One-Click Quick Role Switcher:** Toggle between **Dr. Rajesh Sharma** (Faculty) and **Aanya Patel** (Student) to test permissions instantly.

### 2. 📢 Academic Announcements & Urgent Broadcasts
- Categorized broadcasts: `Urgent Alert`, `Exam & Dates`, `Assignments`, `General`, `Workshops`.
- Pinning mechanism for high-priority university circulars.
- Real-time search and category filtering chips.
- Integrated read acknowledgement tracker (`✓ Acknowledge`).

### 3. 💬 Real-Time Academic Chat & Subject Channels
- Dedicated discussion channels for courses:
  - `#cs301-data-structures`
  - `#cs304-database-systems`
  - `#cs308-web-technologies`
  - `#general-academic-help`
- Message classification tags: `General`, `Doubt`, `Solution`, `Official Notice`, `Code Snippet`.
- Syntax-highlighted code blocks and interactive emoji reactions (`👍`, `❤️`, `💡`, `🔥`, `❓`, `🚀`).

### 4. 💡 Doubts & Q&A Forum (Peer & Teacher Learning)
- Students can submit doubts with descriptions and code snippets.
- Teachers can verify answers with an official green badge.
- Helpful upvoting system to surface high-quality explanations.
- Filter by `All`, `Unresolved`, or `Teacher Verified`.

### 5. 📚 Course Resource Repository
- Categorized course files: `Lecture Notes`, `Lab Manuals`, `PYQs (Previous Year Papers)`, `Syllabus`, `Reference Code`.
- Metadata tracking (file size, downloads counter, uploader name).
- Download simulation with status toasts.

### 6. 📝 Assignments & Submission Tracker
- Deadlines with countdown indicators (`Due in 2 days`, `Overdue`).
- Student file / link submission modal with status tracking (`Submitted`, `Graded`).
- Faculty grading modal with direct feedback notes.

### 7. ⚡ Supabase Hybrid Architecture
- Works out-of-the-box in **Interactive Demo Mode** with pre-populated realistic academic data.
- 1-Click connect to a live Supabase database via the in-app Supabase Configuration modal.
- Includes a complete SQL migration script (`supabase-schema.sql`) with tables, Row Level Security (RLS) policies, and seed data.

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Structure** | HTML5 | Semantic, accessible elements, WCAG-friendly markup |
| **Styling & System** | CSS3 | Obsidian dark mode + light theme, glassmorphism, responsive grid |
| **Logic & State** | Vanilla JS (ES6+) | Modular architecture, LocalStorage cache, event-driven |
| **Backend & Database** | Supabase | PostgreSQL, Auth, Realtime, Row Level Security (RLS) |
| **Hosting & CI/CD** | Vercel | Instant global edge CDN distribution with `vercel.json` |
| **Version Control** | Git & GitHub | Branch workflows, clean commit history, `.gitignore` |

---

## 📂 Project Directory Structure

```plaintext
Reva Connect/
├── assets/
│   └── images/
│       └── hero-banner.jpg       # Modern high-tech portal hero illustration
├── css/
│   └── style.css                 # Comprehensive design system & component styles
├── js/
│   ├── app.js                    # Main controller, UI state & event management
│   ├── mock-data.js              # Realistic seed data for courses, users, notices
│   └── supabase-config.js        # Supabase client adapter & hybrid data service
├── .gitignore                    # Git ignore file
├── index.html                    # Single Page Application shell
├── README.md                     # Project documentation
├── supabase-schema.sql           # Complete Supabase database migration script
└── vercel.json                   # Vercel deployment & routing configuration
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Any modern web browser (Chrome, Edge, Firefox, Safari)
- Optional: Python 3 or Node.js to serve files locally

### Option 1: Serve with Python
```bash
# In the project root directory:
python3 -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Serve with Node `npx serve`
```bash
npx serve .
```

### Option 3: Double-click `index.html`
You can open `index.html` directly in your web browser!

---

## 🗄️ Supabase Cloud Database Setup

Follow these simple steps to link your live Supabase database:

1. Go to [supabase.com](https://supabase.com) and create a free project.
2. In your Supabase Dashboard, navigate to the **SQL Editor** in the left sidebar.
3. Click **New Query**, open the file [`supabase-schema.sql`](supabase-schema.sql), copy its contents, paste them into the query editor, and click **Run**.
4. Go to **Project Settings &rarr; API** and copy:
   - **Project URL** (e.g. `https://xyzcompany.supabase.co`)
   - **Project API Keys &rarr; `anon` `public`** key
5. In the Reva Connect portal web interface, click the **⚡ Demo Mode (Connect Supabase)** badge in the top navigation bar.
6. Paste your **Project URL** and **Anon Key**, then click **Save & Connect**.
7. The status badge will switch to **🟢 Connected to Supabase**!

---

## ☁️ Deploying to Vercel

### Method A: Deploy via GitHub & Vercel Dashboard (Recommended)
1. Push this repository to GitHub (see instructions below).
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **Add New... &rarr; Project** and select your GitHub repository.
4. Leave settings as default (Framework Preset: **Other**, Root Directory: `./`).
5. Click **Deploy**. Vercel will build and assign you a live production URL (e.g. `https://reva-connect.vercel.app`).

### Method B: Deploy using Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Run deployment from repository root
vercel
```

---

## 🐙 Pushing to GitHub

```bash
# 1. Initialize git (if not already done)
git init

# 2. Stage all files
git add .

# 3. Create initial commit
git commit -m "feat: initial commit of Teacher-Student Communication Portal"

# 4. Create repository on GitHub and link remote:
# git remote add origin https://github.com/<your-username>/teacher-student-communication-portal.git

# 5. Push to main branch:
# git branch -M main
# git push -u origin main
```

---

## 👥 Authors & Academic Credits
- **Project Title:** Teacher-Student Communication Portal
- **Department:** School of Computing & Information Technology, REVA University
- **Problem Solved:** Secure academic communications, streamlined broadcasts, peer/faculty doubt clearing, and resource distribution.
