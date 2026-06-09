# VALOR on Supabase - Quick Start Guide

## ⏱️ Time Required: 15-20 minutes

This guide shows exactly what to do in Supabase to deploy VALOR backend.

---

## STEP 1: Create Supabase Project (5 minutes)

### 1.1 Go to Supabase Dashboard
```
→ Visit: https://supabase.com
→ Sign in or create account
→ Click "New project"
```

### 1.2 Configure Project
**Fill in:**
- **Project name**: `VALOR` (or any name)
- **Database password**: Create a strong password (save this!)
- **Region**: Choose nearest to Philippines (Singapore or Tokyo recommended)
- **Pricing plan**: Start with "Free" tier

### 1.3 Wait for Creation
The database will be created in 1-2 minutes. You'll see a loading screen.

---

## STEP 2: Get Your Credentials (2 minutes)

### 2.1 In Supabase Dashboard
1. Go to **Settings** (bottom left) → **API**
2. Copy these values:
   - **Project URL**: (starts with `https://...supabase.co`)
   - **anon public key**: (long string starting with `eyJ...`)
   - **service_role key**: (long string starting with `eyJ...`)

### 2.2 Update Your .env File
In your VALOR folder, edit `.env.example` or create `.env`:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (paste the anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (paste the service_role key)
GEMINI_API_KEY=your_gemini_api_key_here (get this from Google AI Studio)
```

**Don't use .env.example — create a new .env file!**

---

## STEP 3: Run Database Migrations (5 minutes)

### Method A: Using Supabase Dashboard (Easiest) ✅ RECOMMENDED

#### 3A.1 Open SQL Editor
In Supabase Dashboard:
1. Click **SQL Editor** (left sidebar)
2. Click **New Query**

#### 3A.2 Copy & Paste First Migration
1. Open file: `supabase/migrations/001_initial_schema.sql`
2. Copy **ALL content**
3. Paste into Supabase SQL Editor
4. Click **RUN** (blue button, top right)

**Wait for it to complete** (you'll see ✅ checkmark)

#### 3A.3 Run Remaining Migrations (One at a time)

Repeat for each file in order:

```
1️⃣  supabase/migrations/001_initial_schema.sql ← DONE
2️⃣  supabase/migrations/002_seed_data.sql
3️⃣  supabase/migrations/003_storage_setup.sql
4️⃣  supabase/migrations/004_analytics_queries.sql
5️⃣  supabase/rls_policies/001_auth_policies.sql
```

**Copy → Paste → RUN** for each file.

---

## STEP 4: Create Storage Buckets (3 minutes)

### 4.1 In Supabase Dashboard
1. Click **Storage** (left sidebar)
2. Click **Create a new bucket**

### 4.2 Create Bucket #1: "reports-images"
**Settings:**
- **Bucket name**: `reports-images`
- **Public bucket**: ✅ Turn ON
- **File size limit**: 10 MB

Click **Create bucket**

### 4.3 Create Bucket #2: "incident-files"
**Settings:**
- **Bucket name**: `incident-files`
- **Public bucket**: ❌ Turn OFF (keep private)
- **File size limit**: 50 MB

Click **Create bucket**

**Result:** You should see 2 buckets in Storage section.

---

## STEP 5: Deploy Edge Functions (5 minutes)

### Method A: Using Supabase Dashboard (Web Editor)

#### 5A.1 Deploy classify-report

In Supabase Dashboard:
1. Click **Edge Functions** (left sidebar)
2. Click **Create a new function**
3. **Function name**: `classify-report`
4. Click **Create function**

#### 5A.2 Copy & Paste Code

1. Open file: `supabase/functions/classify-report/index.ts`
2. Copy **ALL content**
3. In Supabase editor, paste (replace the template code)
4. Click **Deploy** (blue button)

#### 5A.3 Repeat for Other Functions

Repeat steps 5A.1 and 5A.2 for:
- `summarize-report` (copy from `supabase/functions/summarize-report/index.ts`)
- `detect-duplicate` (copy from `supabase/functions/detect-duplicate/index.ts`)
- `process-report` (copy from `supabase/functions/process-report/index.ts`)

### Method B: Using CLI (If you have Node.js installed)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Deploy all functions at once
supabase functions deploy classify-report --project-ref your-project-id
supabase functions deploy summarize-report --project-ref your-project-id
supabase functions deploy detect-duplicate --project-ref your-project-id
supabase functions deploy process-report --project-ref your-project-id

# Set secret for Gemini API
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here --project-ref your-project-id
```

---

## STEP 6: Set Edge Function Secrets (2 minutes)

### 6.1 In Supabase Dashboard
1. Go to **Edge Functions**
2. Click on **classify-report** function
3. Scroll down to **Secrets** section
4. Click **Add secret**
5. **Name**: `GEMINI_API_KEY`
6. **Value**: (paste your Gemini API key from Google AI Studio)
7. Click **Add**

**Note:** All functions share the same secret, so you only need to add it once.

---

## STEP 7: Verify Everything Works (3 minutes)

### 7.1 Test Database Connection

In Supabase Dashboard:
1. Click **SQL Editor**
2. Run this query:

```sql
SELECT COUNT(*) as barangay_count FROM barangays;
```

**Expected result:** Should show `31` (from seed data)

### 7.2 Test Edge Function

1. Click **Edge Functions** → **classify-report**
2. Go to the **Invocations** tab
3. Click **Invoke** button

**Or use curl in terminal:**

```bash
curl -X POST https://your-project.supabase.co/functions/v1/classify-report \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pothole on Main Street",
    "description": "Large hole near the market"
  }'
```

**Expected result:** JSON with category, priority, department

### 7.3 Check Reports Table

In Supabase Dashboard:
1. Click **Table Editor** (left sidebar)
2. Click on **reports** table
3. You should see it's empty (no rows yet) ✓

---

## STEP 8: Enable Optional Features (2 minutes)

### 8.1 Enable Realtime (For Live Updates)

1. In Supabase Dashboard, click **Database** (left sidebar)
2. Go to **Replication** tab
3. Under "Replication", enable for these tables:
   - `incidents`
   - `reports`
   - `incident_updates`

This allows real-time updates in your frontend.

### 8.2 Configure CORS (For Web Apps)

1. Go to **Settings** → **API**
2. Under **Allowed domains**, add your frontend URL:
   - `http://localhost:3000` (for local testing)
   - `https://yourdomain.com` (for production)

---

## STEP 9: Test Everything (3 minutes)

### 9.1 Create a Test Report

Run in terminal:

```bash
curl -X POST https://your-project.supabase.co/rest/v1/reports \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Large Pothole",
    "description": "Dangerous hole near market",
    "latitude": 8.2456,
    "longitude": 125.1234,
    "contact_name": "Juan",
    "contact_number": "+63917234567",
    "contact_email": "juan@test.com",
    "status": "submitted"
  }'
```

**You should get back a JSON with:** `id`, `created_at`, etc.

### 9.2 Check in Table Editor

1. In Supabase Dashboard, click **Table Editor**
2. Click **reports** table
3. You should see your test report ✓

---

## ✅ Deployment Checklist

```
BEFORE YOU START:
☐ Created Supabase account
☐ Created new Supabase project
☐ Have Gemini API key ready

SETUP:
☐ Copied SUPABASE_URL
☐ Copied SUPABASE_ANON_KEY
☐ Copied SUPABASE_SERVICE_ROLE_KEY
☐ Updated .env file

MIGRATIONS:
☐ Ran 001_initial_schema.sql
☐ Ran 002_seed_data.sql
☐ Ran 003_storage_setup.sql
☐ Ran 004_analytics_queries.sql
☐ Ran 001_auth_policies.sql

STORAGE:
☐ Created "reports-images" bucket (public)
☐ Created "incident-files" bucket (private)

EDGE FUNCTIONS:
☐ Deployed classify-report
☐ Deployed summarize-report
☐ Deployed detect-duplicate
☐ Deployed process-report
☐ Set GEMINI_API_KEY secret

VERIFICATION:
☐ Database query returned 31 barangays
☐ Edge function test returned classification
☐ Created test report successfully
☐ Report appears in Table Editor

OPTIONAL:
☐ Enabled Realtime
☐ Configured CORS
```

---

## 🔧 Troubleshooting

### Issue: "Permission denied" error in SQL Editor

**Solution:**
- Make sure you're using a **New Query**, not opening an existing one
- Copy the entire file content (all migrations)
- Check for syntax errors

### Issue: Edge Function deployment fails

**Solution:**
- Check that TypeScript code is copied correctly
- Make sure you set the `GEMINI_API_KEY` secret
- Check the function logs in Supabase dashboard

### Issue: "CORS error" when calling API from frontend

**Solution:**
- Go to Settings → API → Allowed domains
- Add your frontend URL
- Restart your frontend app

### Issue: Storage bucket creation fails

**Solution:**
- Bucket names must be lowercase
- No spaces allowed in bucket names
- Use `reports-images` not `reports_images`

### Issue: Can't find table after running migration

**Solution:**
- Refresh the Table Editor (press F5)
- Make sure migration ran without errors
- Check SQL Editor for error messages

---

## 📚 What to Do Next

### Test the Complete Flow

Run the example from `api_examples/create_report.js`:

```bash
# If you have Node.js installed
node api_examples/create_report.js
```

This will:
1. Create a new report
2. Classify it with AI
3. Summarize it
4. Detect duplicates
5. Create an incident

### Build Your Frontend

Now that backend is ready, build your app:
- Citizen mobile/web app for submitting reports
- LGU admin dashboard for viewing incidents
- Use the API examples as reference

### Monitor Your Usage

In Supabase Dashboard:
- Click **Database** → **Database Health** to monitor performance
- Click **Edge Functions** → **Invocations** to see function calls
- Check Storage usage in **Storage** tab

---

## 🔐 Security Notes

### Keep These Secret!
- ❌ Never share `SUPABASE_SERVICE_ROLE_KEY`
- ❌ Never commit `.env` file to git
- ✅ Only share `SUPABASE_ANON_KEY` with frontend
- ✅ Keep `GEMINI_API_KEY` in environment only

### RLS Policies Are Active
- Citizens can only create reports
- LGU officers can view and update incidents
- Admins have full access
- All changes are logged

---

## 📞 Support

### If Something Goes Wrong

1. **Check logs:**
   - Supabase Dashboard → SQL Editor → See error message
   - Supabase Dashboard → Edge Functions → See invocation logs

2. **Review documentation:**
   - `docs/API_DOCUMENTATION.md` - API reference
   - `docs/DEPLOYMENT_GUIDE.md` - Detailed guide
   - `README.md` - Project overview

3. **Test with curl:**
   - Use curl commands to test API
   - Check response errors

---

## 🎉 You're Done!

Your VALOR backend is now live on Supabase! 

**Next:** Build the frontend apps that use this API.

---

**Estimated time: 15-20 minutes**

**Questions?** Check `docs/` folder for detailed documentation.

**Ready to test?** Use examples in `api_examples/` folder.
