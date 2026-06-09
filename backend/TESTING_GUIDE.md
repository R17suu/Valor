# VALOR Backend - Testing Guide

Test your VALOR backend API outside of Supabase Dashboard using Postman, cURL, or JavaScript.

## Prerequisites

1. **Supabase Project Details** (from Project Settings):
   - Project URL: `https://[project-id].supabase.co`
   - Anon Key: Found in Settings → API → Project API keys
   - Service Role Key: Found in Settings → API (keep secret!)

2. **Environment Setup**:
   - Postman (or similar API client)
   - cURL (command line)
   - Or a simple Node.js/JavaScript script

---

## Test 1: Get All Barangays (Public Access)

**Using cURL:**
```bash
curl -X GET "https://[project-id].supabase.co/rest/v1/barangays" \
  -H "apikey: [your-anon-key]" \
  -H "Content-Type: application/json"
```

**Expected Response:**
- Status: 200 OK
- Returns array of 31 barangays

**Using JavaScript:**
```javascript
const supabaseUrl = "https://[project-id].supabase.co";
const anonKey = "[your-anon-key]";

fetch(`${supabaseUrl}/rest/v1/barangays`, {
  headers: {
    apikey: anonKey,
    "Content-Type": "application/json"
  }
})
  .then(res => res.json())
  .then(data => console.log("Barangays:", data))
  .catch(err => console.error("Error:", err));
```

---

## Test 2: Get All Departments (Public Access)

**Using cURL:**
```bash
curl -X GET "https://[project-id].supabase.co/rest/v1/departments" \
  -H "apikey: [your-anon-key]" \
  -H "Content-Type: application/json"
```

**Expected Response:**
- Status: 200 OK
- Returns 5 departments (Engineering, CENRO, DRRO, Water District, Public Safety)

---

## Test 3: Get All Reports (Requires Authentication)

**Note:** Without authentication, you should get NO results due to RLS policies.

**Using cURL (without auth - should fail):**
```bash
curl -X GET "https://[project-id].supabase.co/rest/v1/reports" \
  -H "apikey: [your-anon-key]" \
  -H "Content-Type: application/json"
```

**Expected Response:**
- Status: 200 OK but empty array `[]` (RLS blocks access)

---

## Test 4: Create a Report (As a Citizen)

First, you need to sign up and get an auth token.

**Step 1: Sign Up**
```bash
curl -X POST "https://[project-id].supabase.co/auth/v1/signup" \
  -H "apikey: [your-anon-key]" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "citizen@example.com",
    "password": "TestPassword123!"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "[user-id]",
    "email": "citizen@example.com"
  },
  "session": {
    "access_token": "[your-jwt-token]",
    "refresh_token": "[refresh-token]"
  }
}
```

**Step 2: Create a Report with the Auth Token**
```bash
curl -X POST "https://[project-id].supabase.co/rest/v1/reports" \
  -H "apikey: [your-anon-key]" \
  -H "Authorization: Bearer [access-token-from-step-1]" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Report - Pothole on Main Street",
    "description": "Found a dangerous pothole near the market",
    "latitude": 7.9042,
    "longitude": 125.0928,
    "contact_name": "Test Citizen",
    "contact_number": "+63-900-0000000",
    "contact_email": "citizen@example.com",
    "category": "Infrastructure",
    "priority": "high",
    "barangay_id": "[barangay-id-from-test-1]"
  }'
```

**Expected Response:**
- Status: 201 Created
- Returns the created report with ID

---

## Test 5: Get Admin Users (LGU Officer Access)

You need to sign in as an LGU officer to see this data.

**Step 1: Sign In as Admin**
```bash
curl -X POST "https://[project-id].supabase.co/auth/v1/token?grant_type=password" \
  -H "apikey: [your-anon-key]" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria.santos@valencia.gov.ph",
    "password": "[admin-password]"
  }'
```

**Note:** You need to set passwords for admin users first. You can do this in Supabase Dashboard → Authentication → Users.

**Step 2: Get All Reports (with LGU access)**
```bash
curl -X GET "https://[project-id].supabase.co/rest/v1/reports" \
  -H "apikey: [your-anon-key]" \
  -H "Authorization: Bearer [lgu-officer-token]" \
  -H "Content-Type: application/json"
```

**Expected Response:**
- Status: 200 OK
- Returns all 10 seed reports + any reports created by citizens

---

## Test 6: Query Analytics Views

**Get Response Time Analysis:**
```bash
curl -X GET "https://[project-id].supabase.co/rest/v1/response_time_analysis" \
  -H "apikey: [your-anon-key]" \
  -H "Content-Type: application/json"
```

**Get Reports by Status:**
```bash
curl -X GET "https://[project-id].supabase.co/rest/v1/reports_by_status" \
  -H "apikey: [your-anon-key]" \
  -H "Content-Type: application/json"
```

---

## Postman Setup (Easier Alternative)

1. **Create a new collection** in Postman
2. **Add collection variables**:
   - `base_url`: `https://[project-id].supabase.co`
   - `anon_key`: Your anon key
   - `auth_token`: Will be populated after login

3. **Create requests**:
   - GET `{{base_url}}/rest/v1/barangays` with header `apikey: {{anon_key}}`
   - POST `{{base_url}}/auth/v1/signup` to create users
   - POST `{{base_url}}/rest/v1/reports` to create reports

4. **Use Tests tab** to automatically extract and store tokens for subsequent requests

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| `401 Unauthorized` | Invalid or missing API key | Check your anon key is correct |
| `403 Forbidden` | RLS policy blocks access | Ensure you're authenticated with correct role |
| `404 Not Found` | Wrong table name or URL | Check table name in database |
| `CORS Error` | Frontend URL not in Redirect URLs | Add URL to Auth → URL Configuration |
| Empty array when querying reports | RLS policies blocking access | Need valid auth token or create public policy |

---

## Quick Testing Script (JavaScript)

Create `test-api.js`:

```javascript
const PROJECT_ID = "[your-project-id]";
const ANON_KEY = "[your-anon-key]";
const BASE_URL = `https://${PROJECT_ID}.supabase.co`;

async function testAPI() {
  try {
    // Test 1: Get barangays
    console.log("Testing barangays...");
    let res = await fetch(`${BASE_URL}/rest/v1/barangays`, {
      headers: { apikey: ANON_KEY }
    });
    let data = await res.json();
    console.log(`✅ Barangays: ${data.length} found`);

    // Test 2: Get departments
    console.log("Testing departments...");
    res = await fetch(`${BASE_URL}/rest/v1/departments`, {
      headers: { apikey: ANON_KEY }
    });
    data = await res.json();
    console.log(`✅ Departments: ${data.length} found`);

    // Test 3: Get reports (should be empty without auth)
    console.log("Testing reports (no auth)...");
    res = await fetch(`${BASE_URL}/rest/v1/reports`, {
      headers: { apikey: ANON_KEY }
    });
    data = await res.json();
    console.log(`✅ Reports (unauthenticated): ${data.length} found (should be 0)`);

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testAPI();
```

Run with:
```bash
node test-api.js
```

---

## What's NOT Testable Yet (Edge Functions)

- Report classification (AI)
- Report summarization (AI)
- Duplicate detection (AI)

These will be available once you implement the Edge Functions.

---

## Next Steps

1. ✅ Test public endpoints (barangays, departments)
2. ✅ Test authentication (sign up, sign in)
3. ✅ Test report creation
4. ✅ Test RLS policies
5. ⏳ Implement frontend
6. ⏳ Implement edge functions
