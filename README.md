# MusicCoach
AI Music Coach and Practice Planner

## Tech Stack
- **Frontend:** Next.js 14 (App Router) + TypeScript
- **Styling:** Tailwind CSS 3
- **Backend:** Firebase (Auth + Firestore + Storage)
- **Icons:** lucide-react
- **Deployment:** Vercel

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Firebase
Copy the environment template and fill in your Firebase config:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase project values.

### 3. Copy image assets
```bash
node setup-assets.js
```

### 4. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── (protected)/        # Auth-guarded routes
│       ├── home/           # Main dashboard
│       ├── record/         # Recording page
│       ├── saved/          # Saved recordings
│       ├── todo/           # Practice to-do list
│       └── settings/       # User settings
├── components/             # Reusable UI components
├── contexts/               # React context providers
├── hooks/                  # Custom React hooks
├── lib/                    # Firebase & utility modules
├── types/                  # TypeScript interfaces
└── data/                   # Mock data (replaceable)
```

## Deployment
Deploy to Vercel:
```bash
npx vercel
```

Set the same environment variables from `.env.local` in Vercel's project settings.
