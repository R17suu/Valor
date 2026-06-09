# VALOR Supabase Deployment - Visual Step-by-Step Guide

## 🎯 Visual Walkthrough (Screenshots descriptions)

---

## ⏱️ Timeline

| Step | Task | Time | Difficulty |
|------|------|------|------------|
| 1 | Create Supabase Project | 5 min | Easy |
| 2 | Get Credentials | 2 min | Easy |
| 3 | Run Migrations | 5 min | Easy |
| 4 | Create Storage Buckets | 3 min | Easy |
| 5 | Deploy Edge Functions | 5 min | Medium |
| 6 | Set Secrets | 2 min | Easy |
| 7 | Verify Setup | 3 min | Easy |
| **TOTAL** | **DEPLOYMENT** | **25 min** | **Easy** |

---

## STEP 1: Create Supabase Project

### 1.1 Visit Supabase.com

```
URL: https://supabase.com

What you'll see:
- Supabase homepage
- "Sign In" button (top right)
- "Get Started" button (center)

Action: Click "Sign In" → Create account or login with Google/GitHub
```

### 1.2 After Login

```
Dashboard shows:
- Left sidebar with menu
- "New project" button
- List of your projects (empty if new account)

Action: Click "New project" button
```

### 1.3 Create Project Form

```
Form fields to fill:

1. Project Name:
   Input: "VALOR" (or "VALOR-Valencia")
   
2. Database Password:
   Input: Create strong password (e.g., "VaLor@2024#Secure123!")
   ⚠️ SAVE THIS! You'll need it later
   
3. Region:
   Select: Singapore (closest to Philippines)
   Alternative: Tokyo
   
4. Pricing Plan:
   Select: "Free" (to start)
   ✓ Free plan includes:
     - 500 MB database
     - 1 GB storage
     - 50,000 function invocations/month
   
Action: Click "Create new project" (green button)
```

### 1.4 Wait for Creation

```
You'll see:
- Loading spinner
- Message: "Creating database..."
- Progress indicator

Wait time: 1-2 minutes

Once done:
- Dashboard loads
- Left sidebar appears
- Project is ready to use
```

---

## STEP 2: Get Your Credentials

### 2.1 Open Settings

```
In dashboard (left sidebar):
1. Scroll down to bottom
2. Click "Settings" (gear icon)
3. Go to "API" tab

You'll see three sections:
- Project Details (top)
- API Credentials (middle)
- Logs (bottom)
```

### 2.2 Copy API Keys

```
Under "API Credentials", you'll see:

📋 Project URL:
   Format: https://[project-id].supabase.co
   Action: Click copy icon → Save in .env file
   
📋 anon public key:
   Format: eyJhbGc... (long string)
   Action: Click copy icon → Save in .env file
   
📋 service_role key:
   Format: eyJhbGc... (different long string)
   Action: Click copy icon → Save in .env file (KEEP SECRET!)
```

### 2.3 Update .env File

```
In your VALOR folder:

Create file: .env

Content:
SUPABASE_URL=https://[your-project].supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## STEP 3: Run Database Migrations

### 3.1 Open SQL Editor

```
In Supabase Dashboard:
1. Click "SQL Editor" (left sidebar, top section)
2. Click "New Query" (red button, top right)

You'll see:
- Blank SQL editor
- List of templates on right
- Run button (blue) at top right
```

### 3.2 First Migration: 001_initial_schema.sql

```
Action sequence:

1. Open file on your computer:
   C:\Users\kayaos\Desktop\VALOR\supabase\migrations\001_initial_schema.sql
   
2. Select all content: Ctrl+A
3. Copy: Ctrl+C
4. In Supabase SQL Editor, paste: Ctrl+V
5. Click "RUN" button (blue, top right)

Wait for completion:
- You'll see green checkmark ✅
- Message: "Query executed successfully"
- Takes 10-30 seconds
```

### 3.3 Second Migration: 002_seed_data.sql

```
Repeat the process:

1. Click "New Query" again
2. Open: supabase\migrations\002_seed_data.sql
3. Copy all content
4. Paste in Supabase
5. Click RUN

This inserts:
- 31 barangays
- 5 departments
- 16 admin users
```

### 3.4 Verify Migrations

```
After all 5 migrations run:

Check by running this query:
SELECT count(*) FROM information_schema.tables 
WHERE table_schema = 'public';

Expected result: 7 (7 tables created)
```

### 3.5 All Migrations Summary

```
Run in this order:
1️⃣  001_initial_schema.sql      ← MAIN TABLES
2️⃣  002_seed_data.sql           ← TEST DATA
3️⃣  003_storage_setup.sql       ← STORAGE CONFIG
4️⃣  004_analytics_queries.sql   ← VIEWS
5️⃣  rls_policies/001_auth_policies.sql ← SECURITY
```

---

## STEP 4: Create Storage Buckets

### 4.1 Open Storage Section

```
In Supabase Dashboard:
1. Click "Storage" (left sidebar)
2. You'll see empty storage area
3. Click "Create a new bucket" (red button)
```

### 4.2 Create Bucket #1: reports-images

```
Fill in form:

📝 Bucket name: reports-images
   ⚠️  Must be lowercase
   ⚠️  No spaces
   ✅  Use hyphens for separation
   
✅ Public bucket: TURN ON
   This allows citizens to upload photos
   
📊 File size limit: 10 MB
   Good for photos

Action: Click "Create bucket" button
```

### 4.3 Create Bucket #2: incident-files

```
Fill in form:

📝 Bucket name: incident-files
   
🔒 Public bucket: TURN OFF
   This is private for admin only
   
📊 File size limit: 50 MB
   For documents and evidence

Action: Click "Create bucket" button
```

### 4.4 Verify Buckets

```
After creation, you should see:

Storage section shows:
- reports-images (Public badge)
- incident-files (Private badge)

Both buckets are ready!
```

---

## STEP 5: Deploy Edge Functions

### 5.1 Open Edge Functions

```
In Supabase Dashboard:
1. Click "Edge Functions" (left sidebar)
2. You'll see empty functions list
3. Click "Create a new function" (red button)
```

### 5.2 Deploy classify-report

```
Step 1: Create function
- Function name: classify-report
- Click "Create function"
- Supabase creates template code

Step 2: Replace code
- Open: supabase\functions\classify-report\index.ts
- Copy ALL content
- In Supabase editor, select all (Ctrl+A)
- Paste (Ctrl+V)

Step 3: Deploy
- Click "Deploy" button (blue, bottom right)
- Wait for ✅ checkmark
```

### 5.3 Deploy Other Functions

```
Repeat the process for:
1️⃣  classify-report     ✅ (done)
2️⃣  summarize-report
3️⃣  detect-duplicate
4️⃣  process-report

For each:
- Click "Create a new function"
- Name it (e.g., "summarize-report")
- Copy code from corresponding file
- Replace template
- Click Deploy
```

### 5.4 Verify Functions Deployed

```
After deploying all 4:

Edge Functions section shows:
- classify-report ✅
- summarize-report ✅
- detect-duplicate ✅
- process-report ✅

Each should show "Deployed" status
```

---

## STEP 6: Set API Secrets

### 6.1 Add Gemini API Key

```
In Edge Functions section:

1. Click on classify-report function
2. Scroll down to "Secrets" section
3. Click "Add a secret"

Fill in:
Name: GEMINI_API_KEY
Value: your_gemini_api_key_here (your Gemini key from Google AI Studio)

Click "Add"
```

### 6.2 Verify Secret Added

```
You should see:
- Secret name: GEMINI_API_KEY
- Value: Hidden (shows ••••••••)

Note: All functions share this secret
No need to add it again
```

---

## STEP 7: Verify Everything Works

### 7.1 Test Database

```
In SQL Editor:

Run this query:
SELECT COUNT(*) as barangay_count FROM barangays;

Expected result: 31

This proves:
✅ Database is working
✅ Seed data is loaded
✅ Tables are created
```

### 7.2 Test Edge Function

```
In Edge Functions section:

1. Click classify-report
2. Go to "Invocations" tab
3. Click "Invoke" button
4. In popup, enter:
{
  "title": "Pothole on Main Street",
  "description": "Large hole near market"
}
5. Click "Invoke"

Expected result:
{
  "category": "Potholes",
  "priority": "high",
  "department": "Engineering Office",
  "confidence": 0.95
}

This proves:
✅ Functions are working
✅ Gemini API is connected
✅ Classification is working
```

### 7.3 Create Test Report

```
In Terminal/Command Prompt, run:

curl -X POST https://your-project.supabase.co/rest/v1/reports \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Pothole",
    "description": "Test description",
    "latitude": 8.2456,
    "longitude": 125.1234,
    "contact_name": "Test User",
    "contact_number": "+63917234567",
    "contact_email": "test@example.com",
    "status": "submitted"
  }'

Expected result:
Returns JSON with:
- id: (UUID)
- created_at: (timestamp)
- status: "submitted"

This proves:
✅ REST API is working
✅ Authentication is working
✅ Database inserts work
```

### 7.4 Check Report in Table Editor

```
In Supabase Dashboard:

1. Click "Table Editor" (left sidebar)
2. Click "reports" table
3. You should see your test report!

Shows:
- id
- title: "Test Pothole"
- contact_name: "Test User"
- created_at: (timestamp)

This proves:
✅ Data is being saved
✅ Table structure is correct
```

---

## ✅ FINAL CHECKLIST

### Before You Start
- [ ] Have Supabase account (supabase.com)
- [ ] Have Gemini API key
- [ ] Have VALOR files on your computer

### Create & Configure
- [ ] Created Supabase project
- [ ] Got Project URL (SUPABASE_URL)
- [ ] Got Anon Key (SUPABASE_ANON_KEY)
- [ ] Got Service Role Key (SUPABASE_SERVICE_ROLE_KEY)
- [ ] Created .env file with credentials

### Database Setup
- [ ] Ran 001_initial_schema.sql ✅
- [ ] Ran 002_seed_data.sql ✅
- [ ] Ran 003_storage_setup.sql ✅
- [ ] Ran 004_analytics_queries.sql ✅
- [ ] Ran 001_auth_policies.sql ✅

### Storage Setup
- [ ] Created "reports-images" bucket (public)
- [ ] Created "incident-files" bucket (private)

### Edge Functions
- [ ] Deployed classify-report
- [ ] Deployed summarize-report
- [ ] Deployed detect-duplicate
- [ ] Deployed process-report
- [ ] Set GEMINI_API_KEY secret

### Verification
- [ ] Database query returned 31 barangays
- [ ] classify-report function test returned JSON
- [ ] Created test report successfully
- [ ] Report visible in Table Editor

### Optional (Nice to Have)
- [ ] Enabled Realtime (Database → Replication)
- [ ] Configured CORS (Settings → API)
- [ ] Set up backups (Settings → Backups)

---

## 🎉 SUCCESS!

If all checkmarks are done, your VALOR backend is **LIVE** on Supabase!

---

## Next Steps

### Option 1: Test Full Flow
```bash
cd C:\Users\kayaos\Desktop\VALOR
node api_examples\create_report.js
```

### Option 2: Build Frontend
- Create React/Vue app
- Use Supabase credentials
- Follow API_DOCUMENTATION.md

### Option 3: Monitor
- Go to Supabase Dashboard
- Click Database Health
- Click Edge Functions
- Monitor usage

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| SQL migration fails | Copy entire file, paste in new query, check for errors |
| Function won't deploy | Check TypeScript syntax, verify secret is set |
| Can't call API | Check .env credentials, verify RLS policies |
| Bucket creation fails | Use lowercase name, no spaces, try again |
| Can't see data | Refresh table editor (F5), check migrations ran |

---

## 📞 Get Help

### Documentation Files
- `README.md` - Overview
- `DEPLOYMENT_GUIDE.md` - Detailed guide
- `API_DOCUMENTATION.md` - API reference
- `QUICK_START_SUPABASE.md` - This guide

### Supabase Help
- Dashboard → Help (?) → Docs
- Supabase Discord Community
- Stack Overflow (tag: supabase)

---

**You've got this! 💪**

**Questions? Check the docs folder or Supabase official documentation.**

**Timeline: 15-25 minutes to complete deployment.**
