# Intercomp 🌟
> **Next-Generation Liquid Glass Internship & Recruitment Platform**

Intercomp is a full-stack, dual-sided platform designed to streamline student career acceleration and company talent acquisition. Built with a high-performance **Liquid Glass Elite** design system, Intercomp delivers an immersive experience for students, recruiters, and administrators.

---

## 📸 Core Features

### 🎓 1. Student Portal
- **Habit Loop Dashboard**: Track daily streaks, skills mastery, upcoming deadlines, and platform trust score.
- **Courses & Video Player**: Categorized learning paths (Design, Engineering, Business, Data Science) with embedded playback and note taking.
- **Assignments & Submissions**: Real-time assignment trackers, code sandbox submissions, and automated grading.
- **Weekly Quizzes & Integrity Player**: Anti-cheat environment with proctoring simulations, integrity guidelines, and instant test results.
- **AI Mock Interviews**: Realistic interview simulations (Technical Coding, Behavioral, System Design, Problem Solving) featuring question prompts, live answer recorder, and AI feedback.
- **Opportunities & Direct Apply**: Smart job matching based on student skill assessment and portfolio score.
- **Interactive Library**: Curated interview prep guides, cheat sheets, and resource downloads.
- **Direct Messaging & Contextual AI Agent**: Multi-channel messaging and active-screen AI guidance.
- **Ambassador & Referral Hub**: Gamified missions, referral links, and community leaderboards.

---

### 🏢 2. Company / Recruiter Portal
- **Command Center**: High-level metrics for candidate pipeline, active listings, and interview schedules.
- **Talent Pool Search**: AI-assisted candidate discovery with skill filtering and match rate scoring.
- **ATS Kanban Board**: Drag-and-drop applicant progression from applied to hired.
- **Split-View Job Creator**: Live preview markdown/rich-text job post generator.
- **Interview Scheduler**: Seamless interview slot booking and candidate calendar integration.
- **Recruitment Analytics**: Funnel conversion analytics, applicant demographics, and time-to-hire metrics.
- **Ad Campaigns & Billing**: Promotional campaign launcher and automated invoices.

---

### 📱 3. Mobile Simulator
- Interactive **iOS Simulator** showcasing responsive mobile screens, orientation toggle, and mobile auth/workflows.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | HTML5, JavaScript (ES6+), Vanilla CSS, Tailwind CSS |
| **Design System** | Liquid Glass Elite (Backdrop Blur, Frosted Translucency, Radial Ambient Lighting) |
| **Backend** | Node.js, Express.js |
| **Database & Auth** | Supabase (PostgreSQL), Firebase Auth & Storage |
| **AI Integration** | Google Gemini / Vertex AI Studio |
| **Email Service** | Nodemailer (SMTP) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- `npm` (bundled with Node.js)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/intercomp.git
cd intercomp
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy the sample environment file and configure your API keys:
```bash
cp .env.example .env
```
Fill in your credentials in `.env`:
- `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`
- `FIREBASE_API_KEY` (and related configuration)
- `SMTP_USER` and `SMTP_PASS` (optional)

### 4. Database Setup (Optional)
To initialize the Supabase schema, run the queries from `schema.sql` in your Supabase SQL Editor.

### 5. Run the Server
```bash
npm start
```
By default, the server will start on `http://localhost:8080`.

---

## 🌐 Application URLs

Once running, access the portal via:
- **Gateway / Home**: `http://localhost:8080/`
- **Student Dashboard**: `http://localhost:8080/website/index.html#/student/dashboard`
- **Mock Interviews**: `http://localhost:8080/website/index.html#/student/mock-interviews`
- **Company Dashboard**: `http://localhost:8080/website/index.html#/company/dashboard`
- **Recruiter Job Board**: `http://localhost:8080/website/index.html#/company/jobboard`
- **Mobile Simulator**: `http://localhost:8080/mobile/index.html`

---

## 📁 Project Structure

```
intercomp/
├── .env.example            # Environment variables blueprint
├── .gitignore              # Files and folders excluded from Git
├── README.md               # Project documentation
├── package.json            # Node.js dependencies & scripts
├── server.js               # Node/Express backend server & API routes
├── schema.sql              # Supabase / PostgreSQL database schema
├── db.json                 # Local fallback / mock database
├── website/                # Desktop SPA portal
│   ├── index.html          # Main desktop SPA wrapper & navigation
│   ├── app.js              # Desktop SPA routing & state manager
│   ├── screens/            # Liquid Glass desktop views & screen components
│   └── assets/             # Images, logos, and UI assets
├── mobile/                 # Mobile iOS showcase simulator
│   ├── index.html          # Mobile simulator shell
│   └── screens/            # Responsive mobile screens
└── admin/                  # Admin console screens
```

---

## 📄 License
This project is licensed under the ISC License.
