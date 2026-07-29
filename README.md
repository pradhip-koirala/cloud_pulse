# cloud_pulse
A Cloud Latency Monitoring and Performance Analysis System
CloudPulse

A lightweight cloud latency monitoring and performance analysis app. Enter a URL, CloudPulse measures response time, status, and size, stores the result, and visualizes trends over time.

Status

🚧 In development — see docs/memory.md for current progress and docs/phases.md for the build roadmap.

Docs
File	Purpose
docs/requirements.md	What's being built, target users, features
docs/architecture.md	App flow, folder structure, tech stack, API contract
docs/rules.md	Libraries to use/avoid, error-handling rules
docs/phases.md	Phase-by-phase build plan with checklists
docs/design.md	Minimalist color/typography/design system
docs/memory.md	Progress log — read this first when resuming work
Tech Stack
Frontend: React, Tailwind CSS, Chart.js, Axios
Backend: Node.js, Express
Database: Firebase Firestore or MongoDB Atlas (Free Tier)
Hosting: Vercel/Firebase Hosting (frontend), Render (backend)
Getting Started
bash
# clone
git clone https://github.com/<your-username>/cloudpulse.git
cd cloudpulse

# backend
cd backend
npm install
cp .env.example .env   # fill in DB credentials
npm run dev

# frontend (in a new terminal)
cd frontend
npm install
cp .env.example .env   # set backend API URL
npm run dev
Project Structure
cloudpulse/
├── frontend/   # React app
├── backend/    # Express API
├── database/   # schema notes / seed scripts
├── docs/       # planning docs (see table above)
└── README.md
License

Not yet decided.