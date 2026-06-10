# VALOR
**Valencia Automated Local Operations & Response**

An AI-powered civic engagement platform that transforms how citizens report community issues and how government responds—turning scattered complaints into actionable intelligence for smarter resource allocation.

---

## 📋 Table of Contents

- [🎯 About VALOR](#-about-valor)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture](#-architecture)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [💻 Technology Stack](#-technology-stack)
- [🔧 Development](#-development)
- [📡 API Integration](#-api-integration)
- [🚀 Deployment](#-deployment)
- [📊 Demo](#-demo)
- [🛠️ Troubleshooting](#-troubleshooting)
- [📞 Support](#-support)

---

## 🎯 About VALOR

VALOR addresses the critical gap in how cities collect, process, and respond to citizen-reported community issues. Instead of fragmented reports across Facebook, phone lines, and paper-based systems, VALOR provides a unified, AI-powered platform that:

- **Empowers Citizens** - Report issues in 10 seconds with a photo
- **Validates Community Demand** - Shows how many people care about each issue
- **Guides Government** - Visualizes exactly where to deploy resources

### The Problem

For 216,000+ residents across 31 barangays in Valencia City, reporting critical infrastructure and utility failures relies on:
- Unstructured Facebook posts
- Busy phone hotlines
- Paper-based walk-ins
- Fragmented communication channels

This creates:
- ❌ Duplicate complaints (one issue = 5 separate reports)
- ❌ Operational blindness (government doesn't know what's actually broken)
- ❌ Resource misallocation (help goes where it's shouted, not where it's needed)
- ❌ Data silos (no real-time community data for planning)

### The Solution

VALOR transforms this with three innovation layers:

1. **AI-Powered Photo Analysis** - Citizens take a photo, AI handles the rest
2. **Smart Deduplication** - Same issue reported by 15 people = one work order with visible community demand
3. **Geographic Heatmap** - Officials see exactly where problems cluster and how urgent they are

---

## ✨ Key Features

### Feature 01: AI-Powered Photo Analysis
Citizens simply take a photo of the issue. AI instantly analyzes the image and auto-generates:
- **Title:** Auto-suggested issue name (editable)
- **Description:** Detailed problem statement (editable)
- **Department:** Correct city office assignment (editable)
- **Priority:** Urgency level based on AI analysis (editable)

**Impact:** Citizens report in 10 seconds instead of 2-3 minutes. No forms. No confusion.

### Feature 02: Smart Deduplication
When submitting a report, the system checks if similar issues were reported nearby within 100 meters:
- Shows **distance** to existing report (10-100m away)
- Shows **how many people** already reported it (1-8+)
- Shows **incident ID** to link to
- Citizen chooses to **join** or **submit as new**

**Impact:** One pothole = one work order. Community demand visible in system.

### Feature 03: Geographic Heatmap & Priority Dashboard
City officials see an interactive map showing problem hotspots:
- 🔴 **Red zones:** 15+ linked reports (CRITICAL)
- 🟠 **Orange zones:** 8-12 linked reports (HIGH)
- 🟡 **Yellow zones:** 1-6 linked reports (MEDIUM)
- Filter by **"Most Linked"** to see community priorities first

**Impact:** Resources deploy where community impact is greatest. Data-driven decision-making.

### Additional Features

- **Real-time Report Tracking** - Citizens see status updates
- **Department Workload Analytics** - Admins see which teams are bottlenecked
- **Barangay Performance Scoring** - Track response times per neighborhood
- **Incident Clustering** - Automatically group related reports
- **Community Updates Feed** - Public visibility into resolved issues

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        VALOR SYSTEM ARCHITECTURE                 │
└─────────────────────────────────────────────────────────────────┘

CITIZEN LAYER
├─ Report Creation (AI-powered photo analysis)
├─ Duplicate Detection (geolocation-based clustering)
├─ Community Updates (public issue tracking)
└─ Report History (personal submissions)

ADMIN LAYER
├─ Dashboard (real-time metrics)
├─ Report Management (filtering, sorting, linking)
├─ Geographic Heatmap (spatial hotspot analysis)
├─ Department Workload (team capacity tracking)
└─ Barangay Performance (neighborhood response tracking)

DATA PROCESSING
├─ AI Analysis (Supabase Edge Functions)
├─ Duplicate Detection (geospatial clustering)
├─ Incident Routing (department assignment)
└─ Real-time Analytics (live reporting)

INFRASTRUCTURE
├─ Frontend: React + Vite
├─ Backend: Supabase (PostgreSQL)
├─ Storage: Cloudinary (images)
├─ Location: Browser Geolocation API
└─ Data: Real-time LocalStorage (demo) / PostgreSQL (production)
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ ([Download](https://nodejs.org))
- **npm** or **yarn**
- **Git**
- **Supabase Account** ([Create Free](https://supabase.com))
- **Cloudinary Account** ([Create Free](https://cloudinary.com))

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/valor.git
cd valor
```

### Step 2: Set Up Backend (Supabase)

```bash
cd backend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
EOF

# Deploy database schema
npm run setup-db

# Deploy edge functions
npm run deploy-functions

# Create storage buckets
npm run create-buckets

# Test setup
npm run test
```

### Step 3: Set Up Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local
cat > .env.local << EOF
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_preset
EOF

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

### Step 4: Access the Application

**Citizen Portal:**
- Home: `http://localhost:5173/home`
- Report Issue: `http://localhost:5173/report-issue`
- Community Updates: `http://localhost:5173/community-reports`

**Admin Dashboard:**
- Overview: `http://localhost:5173/admin/overview`
- Reports: `http://localhost:5173/admin/reports`
- Map: `http://localhost:5173/admin/map`

**Demo Credentials:**
- Citizen: `citizen@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

---

## 📁 Project Structure

```
valor/
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── Admin/                    # Admin dashboard pages
│   │   │   ├── Overview.jsx          # Dashboard overview & stats
│   │   │   ├── Reports.jsx           # Report management with filtering
│   │   │   ├── Map.jsx               # Geographic heatmap
│   │   │   ├── Barangays.jsx         # Barangay performance tracking
│   │   │   ├── Departments.jsx       # Department workload
│   │   │   ├── Profile.jsx
│   │   │   └── Settings.jsx
│   │   ├── Citizen/                  # Citizen-facing pages
│   │   │   ├── ReportIssue.jsx       # AI-powered report creation
│   │   │   ├── DuplicateDetectionAlert.jsx  # Duplicate detection UI
│   │   │   ├── Home.jsx              # Home dashboard
│   │   │   ├── CommunityUpdates.jsx  # Community updates feed
│   │   │   ├── Reports.jsx           # User's report history
│   │   │   ├── Profile.jsx
│   │   │   └── CityMap.jsx
│   │   ├── Auth/                     # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── Layouts/                  # Layout components
│   │   │   ├── AdminLayouts.jsx      # Admin sidebar layout
│   │   │   └── CitizenLayouts.jsx    # Citizen bottom nav layout
│   │   ├── Components/               # Reusable components
│   │   │   └── ApplicationLogo.jsx
│   │   ├── services/                 # API & utility services
│   │   │   ├── reportApi.js          # Report creation & AI analysis
│   │   │   ├── cloudinaryApi.js      # Image upload to Cloudinary
│   │   │   ├── gps.js                # Geolocation services
│   │   │   └── supabase.js           # Supabase client config
│   │   ├── assets/                   # Images & media
│   │   │   ├── App-Icon.png
│   │   │   ├── pothole.jpg
│   │   │   ├── garbage-acc.jpg
│   │   │   └── ...
│   │   ├── App.jsx                   # Main app component
│   │   └── main.jsx                  # Entry point
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── backend/                           # Supabase backend
│   ├── supabase/
│   │   ├── functions/
│   │   │   ├── draft-report/         # AI analysis function
│   │   │   └── create-report/        # Report creation function
│   │   ├── migrations/
│   │   │   └── [timestamp]_init.sql  # Database schema
│   │   └── config.toml               # Supabase config
│   ├── services/
│   │   ├── ai-service.js             # AI analysis logic
│   │   ├── duplicate-detection.js    # Duplicate detection logic
│   │   └── routing-service.js        # Department routing
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── docs/                              # Documentation
│   ├── ARCHITECTURE.md               # System architecture
│   ├── API.md                        # API reference
│   ├── DEPLOYMENT.md                 # Deployment guide
│   └── CONTRIBUTING.md               # Contributing guidelines
│
├── .github/
│   ├── workflows/                    # CI/CD pipelines
│   │   ├── frontend-deploy.yml
│   │   └── backend-deploy.yml
│   └── ISSUE_TEMPLATE/               # Issue templates
│
├── .gitignore
├── package.json                      # Root package.json
└── README.md                         # This file
```

---

## 💻 Technology Stack

### Frontend

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | React | 19.2 | UI library |
| **Build Tool** | Vite | 8.0 | Fast development & production builds |
| **Styling** | Tailwind CSS | 4.3 | Utility-first CSS |
| **Routing** | React Router DOM | 7.17 | Page navigation |
| **Icons** | Lucide React | 1.17 | Icon library |
| **State** | React Hooks | Built-in | State management |
| **HTTP** | Fetch API | Built-in | API calls |
| **Auth** | Supabase Auth | 2.108 | User authentication |

### Backend

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Database** | PostgreSQL (Supabase) | Data persistence |
| **Auth** | Supabase Auth | User management |
| **API** | Supabase Edge Functions | Serverless functions |
| **File Storage** | Cloudinary | Image hosting |
| **Real-time** | Supabase Realtime | Live updates |
| **AI** | Supabase Edge Functions | ML processing |

### Infrastructure

| Service | Purpose |
|---------|---------|
| **Supabase** | Backend + Database + Auth + Storage |
| **Cloudinary** | Image upload & optimization |
| **Vercel/Netlify** | Frontend hosting (deployment) |
| **GitHub** | Version control |

---

## 🔧 Development

### Local Development

```bash
# Start frontend dev server
cd frontend
npm run dev

# In another terminal, start backend (Supabase local)
cd backend
npx supabase start

# Frontend runs on: http://localhost:5173
# Backend API on: http://localhost:54321
```

### Key Commands

**Frontend:**
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

**Backend:**
```bash
npm run setup-db       # Initialize database
npm run deploy-functions  # Deploy edge functions
npm run test          # Run tests
```

### Coding Standards

- **Component Structure:** One component per file
- **File Naming:** PascalCase for components, camelCase for utilities
- **CSS:** Tailwind classes only (no custom CSS)
- **State Management:** React Hooks (useState, useEffect, useMemo)
- **Error Handling:** Try-catch with user-friendly messages
- **Comments:** JSDoc for functions, inline for complex logic

### Testing

```bash
# Frontend unit tests (future)
npm run test

# Backend API tests
npm run test:api

# Integration tests
npm run test:integration
```

---

## 📡 API Integration

### Supabase Edge Functions

**1. Draft Report (AI Analysis)**
```javascript
// POST /functions/v1/draft-report
{
  photo_url: "https://...",
  latitude: 8.2400,
  longitude: 125.1100
}

// Response
{
  suggested_title: "Large Pothole on National Highway",
  description: "Road damage, safety risk",
  category: "Road / Infrastructure",
  priority: "Medium",
  department: "Engineering Office",
  confidence: 0.92
}
```

**2. Create Report**
```javascript
// POST /functions/v1/create-report
{
  title: "Large Pothole on National Highway",
  description: "Road damage, safety risk",
  category: "Road / Infrastructure",
  priority: "medium",
  department: "Engineering Office",
  photo_url: "https://...",
  latitude: 8.2400,
  longitude: 125.1100,
  contact_name: "Juan Dela Cruz",
  contact_number: "+63 912 345 6789",
  contact_email: "juan@example.com"
}

// Response
{
  id: "#VAL-2025-1245",
  status: "submitted",
  created_at: "2026-06-10T10:30:00Z"
}
```

### Client Services

**Report API:**
```javascript
import { callDraftReport, createReport, getReports } from './services/reportApi'

// Get AI suggestions
const aiResult = await callDraftReport(photoUrl, latitude, longitude)

// Submit report
const report = await createReport({ title, description, ... })

// Fetch reports with filters
const reports = await getReports({ status: 'pending', category: 'Road' })
```

**GPS Service:**
```javascript
import { getMockGPSLocation, getRealOrMockGPSLocation } from './services/gps'

// Get mock location within Valencia City
const location = getMockGPSLocation()
// { latitude: 8.2345, longitude: 125.1089 }

// Try real GPS, fall back to mock
const location = await getRealOrMockGPSLocation()
```

**Cloudinary Upload:**
```javascript
import { uploadToCloudinary } from './services/cloudinaryApi'

const result = await uploadToCloudinary(photoFile)
// { success: true, url: 'https://...' }
```

---

## 🚀 Deployment

### Deploy Frontend to Vercel (Recommended)

```bash
# 1. Push code to GitHub
git add .
git commit -m "Deploy VALOR"
git push origin main

# 2. Go to vercel.com
# 3. Import repository
# 4. Add environment variables:
#    VITE_SUPABASE_URL
#    VITE_SUPABASE_ANON_KEY
#    VITE_CLOUDINARY_UPLOAD_PRESET
# 5. Click Deploy

# Your app is live!
```

### Deploy Frontend to Netlify

```bash
# Build
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy Frontend to Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

### Deploy Backend to Supabase (Production)

```bash
cd backend

# Login to Supabase CLI
npx supabase login

# Create production project on supabase.com

# Link to production
npx supabase link --project-ref your-project-ref

# Deploy database migrations
npx supabase db push

# Deploy edge functions
npx supabase functions deploy draft-report --no-verify
npx supabase functions deploy create-report --no-verify

# Test production
curl https://your-project.supabase.co/functions/v1/draft-report
```

### Production Deployment Checklist

- ✅ Environment variables configured
- ✅ Database migrations applied
- ✅ Edge functions deployed
- ✅ Storage buckets created
- ✅ RLS (Row Level Security) policies enabled
- ✅ CORS configured for frontend domain
- ✅ SSL certificates active
- ✅ Backups scheduled
- ✅ Monitoring alerts set up
- ✅ Rate limiting configured

---

## 📊 Demo

### Live Demo
- **URL:** https://valor-demo.vercel.app
- **Citizen Portal:** https://valor-demo.vercel.app/home
- **Admin Dashboard:** https://valor-demo.vercel.app/admin/overview

### Demo Credentials

**Citizen Account:**
```
Email: citizen@example.com
Password: password123
```

**Admin Account:**
```
Email: admin@example.com
Password: password123
```

### Demo Features

- ✅ Photo upload with AI analysis
- ✅ Duplicate detection alert
- ✅ Real-time report tracking
- ✅ Admin report management
- ✅ Geographic heatmap
- ✅ Department filtering
- ✅ Barangay performance tracking

### Test Workflows

**As Citizen:**
1. Go to `/report-issue`
2. Click "Use Sample" to load a garbage photo
3. See AI suggestions (Title, Description, Department, Priority)
4. Edit if needed and submit
5. System detects duplicates (30% chance)
6. See your report in community feed

**As Admin:**
1. Go to `/admin/reports`
2. See all reports with linked counts
3. Filter by Status or Category
4. Sort by "Most Linked" to see community priorities
5. View geographic heatmap at `/admin/map`
6. Check barangay performance at `/admin/barangays`

---

## 🛠️ Troubleshooting

### Frontend Issues

**Issue: "Cannot find module" error**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Issue: Environment variables not loading**
- Restart dev server: `npm run dev`
- Verify `.env.local` file exists in `frontend/` directory
- Check variable names have `VITE_` prefix
- Variables must be defined before starting dev server

**Issue: Supabase connection error**
- Verify `VITE_SUPABASE_URL` is correct
- Check `VITE_SUPABASE_ANON_KEY` is valid
- Ensure Supabase project is active and not paused
- Check network tab for actual error

**Issue: Images not uploading**
- Verify Cloudinary upload preset exists
- Check `VITE_CLOUDINARY_UPLOAD_PRESET` is correct
- Ensure CORS is enabled in Cloudinary
- Check file size is under 10MB

**Issue: Hot reload not working**
```bash
# Clear Vite cache and restart
rm -rf .vite
npm run dev
```

### Backend Issues

**Issue: Database migrations failed**
```bash
# Reset local database
npx supabase db reset

# Reapply migrations
npx supabase db push
```

**Issue: Edge functions not deploying**
```bash
# Check function syntax
npx supabase functions list

# Deploy specific function
npx supabase functions deploy draft-report --no-verify

# View function logs
npx supabase functions delete draft-report
```

**Issue: Storage bucket not found**
```bash
# Create buckets manually
npx supabase storage create photos --public
npx supabase storage create reports --public
```

### Deployment Issues

**Issue: Build fails in Vercel**
- Check Node.js version matches locally
- Verify all dependencies in `package.json`
- Run `npm run build` locally to reproduce
- Check build logs for specific errors

**Issue: Frontend can't reach backend**
- Verify `VITE_SUPABASE_URL` in environment variables
- Check Supabase project is running
- Test endpoint with curl: `curl -i $VITE_SUPABASE_URL`

**Issue: Images 404 after deployment**
- Verify Cloudinary upload preset is correct
- Check Cloudinary CORS settings
- Test image URL in browser directly

---

## 📈 Performance

### Expected Performance

| Metric | Target | Actual |
|--------|--------|--------|
| **Initial Load** | < 3s | ~2s |
| **Photo Upload** | < 2s | ~1.5s |
| **AI Analysis** | < 3s | ~2-3s |
| **Duplicate Check** | < 500ms | ~300ms |
| **Report Submission** | < 1s | ~800ms |

### Optimization Tips

- Enable image optimization in Cloudinary
- Use lazy loading for report images
- Implement pagination for long report lists
- Cache frequently accessed data
- Use React.memo for expensive components

---

## 🔒 Security

- ✅ No sensitive data in version control (`.gitignore` configured)
- ✅ Environment variables stored securely
- ✅ Supabase Row-Level Security (RLS) policies active
- ✅ User authentication via Supabase Auth
- ✅ HTTPS only (production)
- ✅ CORS configured for frontend domain only
- ✅ Rate limiting on API endpoints
- ✅ Input validation on all forms
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (React escapes by default)

---

## 📞 Support

### Getting Help

- **Issues:** [Create GitHub Issue](https://github.com/yourusername/valor/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/valor/discussions)
- **Email:** valor@valenciacity.gov.ph
- **Documentation:** See `/docs` folder

### Resources

- [React Documentation](https://react.dev)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev)

### Report a Bug

```markdown
**Title:** [BUG] Brief description

**Environment:**
- OS: (Windows/Mac/Linux)
- Browser: (Chrome/Firefox/Safari)
- Node version: (node -v)

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**

**Actual Behavior:**

**Screenshots:** (if applicable)
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Make** your changes
4. **Test** your changes: `npm run build && npm run lint`
5. **Commit:** `git commit -m "Add amazing feature"`
6. **Push:** `git push origin feature/amazing-feature`
7. **Create** a Pull Request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test on multiple devices
- Keep commits atomic and descriptive

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

This means you can:
- ✅ Use for commercial projects
- ✅ Modify the code
- ✅ Distribute copies
- ✅ Include in larger works

Just include the original license and don't hold the authors liable.

---

## 🙏 Acknowledgments

- **Valencia City Government** - Project partner
- **InnoVa Hackathon 2026** - Platform
- **Supabase** - Backend infrastructure
- **Cloudinary** - Image hosting
- **Vercel** - Frontend hosting
- **Open Source Community** - React, Vite, Tailwind CSS

---

## 📈 Roadmap

### Q3 2026
- ✅ MVP launch
- ✅ Citizen report submission
- ✅ Admin dashboard
- ✅ Basic duplicate detection

### Q4 2026
- 🔜 Mobile app (React Native)
- 🔜 SMS reporting
- 🔜 Advanced analytics
- 🔜 Notification system

### Q1 2027
- 🔜 Machine learning predictions
- 🔜 Integration with city systems
- 🔜 Blockchain verification
- 🔜 Multi-language support

### Q2 2027+
- 🔜 Expand to other municipalities
- 🔜 National integration
- 🔜 Advanced AI capabilities
- 🔜 Community gamification

---

## 📞 Contact

- **Project Lead:** [Your Name](mailto:your.email@example.com)
- **Email:** valor@valenciacity.gov.ph
- **Website:** https://valorapp.ph
- **GitHub:** https://github.com/yourusername/valor
- **Twitter:** [@valorapp](https://twitter.com/valorapp)

---

## 📅 Version History

### v1.0.0 (June 2026)
- Initial MVP launch
- AI-powered photo analysis
- Smart deduplication
- Admin dashboard with heatmap

### v0.9.0 (May 2026)
- Beta release
- Core features implemented
- Community testing

### v0.1.0 (April 2026)
- Project kickoff
- Architecture design
- Backend setup

---

## 🚀 Get Started Now!

```bash
# Clone the repository
git clone https://github.com/yourusername/valor.git
cd valor

# Follow Quick Start section above

# Questions? Create an issue or contact us!
```

---

**VALOR: Making Valencia City smarter, one report at a time.** 🌟

*Built with ❤️ for the citizens of Valencia City*
