# VALOR Backend - Valencia Automated Local Operations & Response

> **Production-ready AI-powered citizen issue reporting and incident management platform for the City Government of Valencia**

## 🎯 Project Overview

VALOR is a complete backend system for managing citizen reports about city infrastructure issues, using AI to classify, prioritize, and route incidents to the appropriate government departments.

### Core Features

✅ **Citizen Report Submission** - Citizens submit issues with photos and location data  
✅ **AI Drafting & Classification** - Auto-generates report descriptions, categories, and priorities from uploaded photos, then lets citizens review and edit before submit  
✅ **Duplicate Detection** - Geographic clustering to identify related incidents  
✅ **Incident Management** - Track incidents from creation to resolution  
✅ **Department Assignment** - Automatic routing to responsible departments  
✅ **Progress Tracking** - Real-time status updates from LGU personnel  
✅ **Analytics Dashboard** - Comprehensive performance metrics and insights  
✅ **Audit Logging** - Complete compliance trail for all operations  
✅ **Role-Based Access Control** - Granular permissions via RLS policies  

### Report Categories

- Potholes
- Road Damage
- Flooding
- Illegal Dumping
- Garbage Accumulation
- Broken Streetlights
- Fallen Trees
- Water Service Issues
- Public Safety Concerns

### Departments

- Engineering Office
- CENRO (Environmental & Natural Resources)
- Disaster Risk Reduction Office
- Water District
- Public Safety Office

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Citizen Frontend                       │
│         (React/Vue/Flutter - Report Submission)         │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│              Supabase Edge Functions                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ draft-report    │ classify-report   │ summarize  │   │
│  │  process-report │   (AI Orchestrator)            │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ├──────────────┬──────────────┐
                      ▼              ▼              ▼
            ┌──────────────┐  ┌───────────┐  ┌─────────┐
            │ PostgreSQL   │  │ Gemini    │  │ Storage │
            │ Database     │  │ API       │  │ Buckets │
            └──────────────┘  └───────────┘  └─────────┘
                      │
┌─────────────────────┴───────────────────────────────────┐
│         LGU Dashboard (Admin Frontend)                   │
│    (Real-time incidents, analytics, assignments)        │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
VALOR/
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql         # Core tables & indexes
│   │   ├── 002_seed_data.sql              # Initial data
│   │   ├── 003_storage_setup.sql          # Storage configuration
│   │   └── 004_analytics_queries.sql      # Views & analytics
│   ├── functions/
│   │   ├── draft-report/index.ts          # Photo-based AI draft
│   │   ├── classify-report/index.ts       # AI classification
│   │   ├── summarize-report/index.ts      # AI summarization
│   │   ├── detect-duplicate/index.ts      # Duplicate detection
│   │   └── process-report/index.ts        # Orchestration
│   └── rls_policies/
│       └── 001_auth_policies.sql          # Security & access control
├── docs/
│   ├── DEPLOYMENT_GUIDE.md                # Step-by-step deployment
│   └── API_DOCUMENTATION.md               # Complete API reference
├── api_examples/
│   ├── create_report.js                   # Report creation example
│   └── get_incidents.js                   # Query examples
├── .env.example                           # Environment variables template
└── README.md                              # This file
```

---

## 🚀 Quick Start

### 1. Prerequisites

- Supabase account ([supabase.com](https://supabase.com))
- Gemini API key ([ai.google.dev/gemini-api/docs/api-key](https://ai.google.dev/gemini-api/docs/api-key))
- Note: Gemini API access is separate from Google One or any consumer subscription.
- Node.js 18+ (optional, for running examples)

### 2. Setup Environment

```bash
# Clone repository (or create from files)
cd VALOR

# Copy environment template
cp .env.example .env.local

# Fill in your credentials
# SUPABASE_URL=https://your-project.supabase.co
# SUPABASE_ANON_KEY=...
# SUPABASE_SERVICE_ROLE_KEY=...
# GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Apply Database Schema

**Option A: Using Supabase Dashboard**
1. Open Supabase SQL Editor
2. Execute files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_data.sql`
   - `supabase/migrations/003_storage_setup.sql`
   - `supabase/migrations/004_analytics_queries.sql`
   - `supabase/rls_policies/001_auth_policies.sql`

**Option B: Using CLI**
```bash
supabase db push --project-ref your-project-id
```

### 4. Deploy Edge Functions

```bash
# Deploy each function
supabase functions deploy draft-report --project-ref your-project-id
supabase functions deploy classify-report --project-ref your-project-id
supabase functions deploy summarize-report --project-ref your-project-id
supabase functions deploy detect-duplicate --project-ref your-project-id
supabase functions deploy process-report --project-ref your-project-id

# Set API keys
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here --project-ref your-project-id
```

### 5. Create Storage Buckets

Via Supabase Dashboard > Storage:
1. Create `reports-images` (public)
2. Create `incident-files` (private)

### 6. Test the Setup

```bash
# Test database connection
curl -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://your-project.supabase.co/rest/v1/barangays

# Test Edge Function
curl -X POST -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"photo_url":"https://your-project.supabase.co/storage/v1/object/public/reports-images/report-123.jpg"}' \
  https://your-project.supabase.co/functions/v1/draft-report
```

---

## 💻 Usage Examples

### Create a Report (JavaScript)

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const ANON_KEY = 'your-anon-key';

const response = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${ANON_KEY}`,
    'Content-Type': 'application/json',
    'apikey': ANON_KEY
  },
  body: JSON.stringify({
    title: 'Large Pothole on Main Street',
    description: 'Dangerous hole near the market',
    latitude: 8.2456,
    longitude: 125.1234,
    contact_name: 'Juan Dela Cruz',
    contact_number: '+63917234567',
    contact_email: 'juan@example.com'
  })
});

const report = await response.json();
console.log('Report created:', report.id);
```

### Classify a Report

```javascript
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/classify-report`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: 'Pothole on Main Street',
      description: 'Large hole damaging vehicles'
    })
  }
);

const { category, priority, department } = await response.json();
console.log(`Category: ${category}, Priority: ${priority}`);
```

### Get Open Incidents

```javascript
const response = await fetch(
  `${SUPABASE_URL}/rest/v1/incidents?status=eq.open&order=created_at.desc`,
  {
    headers: {
      'Authorization': `Bearer ${ANON_KEY}`,
      'apikey': ANON_KEY
    }
  }
);

const incidents = await response.json();
incidents.forEach(incident => {
  console.log(`${incident.category} (${incident.priority}): ${incident.report_count} reports`);
});
```

See `api_examples/` for more complete examples.

---

## 📊 Database Schema

### Core Tables

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `reports` | Citizen submissions | title, description, location, status |
| `incidents` | Grouped incidents | category, priority, department, status |
| `departments` | LGU departments | name, contact info, head assignment |
| `admin_users` | LGU personnel | email, role, department, permissions |
| `incident_updates` | Progress tracking | message, status, timestamp |
| `barangays` | Geographic divisions | name, code, coordinates |
| `audit_logs` | Compliance trail | action, user, timestamp |

### Analytics Views

- `dashboard_summary` - High-level KPIs
- `category_distribution` - Incidents by type
- `department_performance` - Department metrics
- `staff_performance` - Officer metrics
- `monthly_trends` - Time-based analysis
- `overdue_incidents` - SLA violations
- `response_time_analysis` - Resolution times

---

## 🔒 Security & Access Control

### Row Level Security (RLS) Policies

```
Citizens:
  ✓ Create reports
  ✗ Modify existing reports
  
LGU Officers/Heads:
  ✓ View all incidents
  ✓ Update assigned incidents
  ✓ Create incident updates
  ✓ View analytics
  ✗ Delete records (audit trail preserved)
  
Super Admins:
  ✓ Full access to all tables
  ✓ Manage users and departments
  ✓ View audit logs
```

### Authentication

- Uses Supabase Auth with email/password
- Service role key for backend operations
- Anon key for citizen-facing operations

---

## 🤖 AI Integration

### Models & APIs

- **Gemini 2.5 Flash** (via Google Gemini API) for:
  - Report classification
  - Priority determination
  - AI summarization

### Processing Pipeline

```
1. Citizen submits report
   ↓
2. System classifies:
   - Category (9 types)
   - Priority (critical/high/medium/low)
   - Department assignment
   ↓
3. AI summarizes for officials
   ↓
4. Duplicate detection:
   - Geographic clustering (100m radius)
   - Category matching
   ↓
5. Incident management:
   - Create new incident OR
   - Link to existing incident
   ↓
6. Department notification & assignment
```

### Cost Optimization

- Batch process reports during off-peak hours
- Cache classifications for similar reports
- Monitor API usage in Supabase dashboard

---

## 📈 Analytics & Reporting

### Dashboard Metrics

**KPIs Tracked:**
- Total open/resolved incidents
- Average response time (by category, department)
- Resolution rate (by priority, department)
- Duplicate detection effectiveness
- SLA compliance rate
- Staff productivity metrics

### Custom Queries

View examples in `docs/API_DOCUMENTATION.md` for:
- Department performance comparison
- Category distribution analysis
- Monthly trend analysis
- Overdue incident tracking
- Staff performance ranking

---

## 🔧 API Reference

### Edge Functions

| Function | Purpose | Input | Output |
|----------|---------|-------|--------|
| `draft-report` | Photo-based AI draft | photo_url, title?, description? | suggested_title, description, category, priority, department, summary |
| `classify-report` | AI classification | title, description, photo_url? | category, priority, department |
| `summarize-report` | Generate summary | title, description, photo_url? | summary text |
| `detect-duplicate` | Find similar incidents | latitude, longitude, category | found, incident_id, distance |
| `process-report` | Full pipeline | report_id | incident_id, classification, summary |

### REST Endpoints

**Create Report:**
```
POST /rest/v1/reports
```

**Get Incidents:**
```
GET /rest/v1/incidents?status=eq.open&order=created_at.desc
```

**Update Incident:**
```
PATCH /rest/v1/incidents?id=eq.{id}
```

**Add Progress Update:**
```
POST /rest/v1/incident_updates
```

See `docs/API_DOCUMENTATION.md` for complete reference.

---

## 🚀 Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] RLS policies enabled
- [ ] Edge Functions deployed
- [ ] Storage buckets created
- [ ] CORS configured
- [ ] Backups enabled
- [ ] Monitoring active
- [ ] API rate limits configured
- [ ] Security policies reviewed

### Deployment Steps

1. Follow `docs/DEPLOYMENT_GUIDE.md`
2. Test all endpoints
3. Verify RLS policies
4. Configure monitoring
5. Set up error alerting

---

## 📝 Configuration

### Environment Variables

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# AI/ML
GEMINI_API_KEY=your_gemini_api_key_here

# Optional
ENVIRONMENT=production
LOG_LEVEL=info
```

### Database Configuration

- **Region**: Choose region closest to Valencia, Philippines
- **Backups**: Enable daily backups with 30-day retention
- **Connection**: Use connection pooling for production

---

## 📚 Documentation

- **[DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)** - Step-by-step setup instructions
- **[API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)** - Complete API reference with examples
- **[API Examples](api_examples/)** - Working code samples

---

## 🛠️ Maintenance & Operations

### Weekly Tasks
- Monitor error logs
- Check storage usage
- Review performance metrics

### Monthly Tasks
- Verify database backups
- Update dependencies
- Review security policies

### Quarterly Tasks
- Analyze usage patterns
- Optimize slow queries
- Review access patterns

---

## 🐛 Troubleshooting

### Common Issues

**Edge Functions Timing Out**
- Check Gemini API response times
- Optimize database queries
- Review function logs

**RLS Policy Violations**
- Verify user email in admin_users table
- Check user role assignment
- Test policies with specific user

**Storage Upload Failures**
- Verify bucket policies
- Check file size limits
- Validate CORS configuration

See `docs/DEPLOYMENT_GUIDE.md#troubleshooting` for more.

---

## 📊 Performance Metrics

### Expected Performance

- Report creation: <2 seconds
- AI classification: <5 seconds
- Duplicate detection: <1 second
- Dashboard queries: <2 seconds
- Full pipeline (process-report): <10 seconds

### Scaling

- PostgreSQL: Handles millions of records
- Edge Functions: Auto-scales to demand
- Storage: Unlimited with cost controls

---

## 🔐 Security Best Practices

1. **API Keys**: Rotate regularly, use environment variables
2. **Database**: Keep backups, enable encryption
3. **RLS**: Test policies before production
4. **Audit**: Monitor audit_logs table regularly
5. **Secrets**: Never commit credentials to git

---

## 📞 Support & Contact

For issues or questions:
1. Check documentation
2. Review error logs in Supabase
3. Test with API examples
4. Contact: [City Government of Valencia IT Department]

---

## 📄 License

This project is proprietary to the City Government of Valencia.

---

## 🙏 Acknowledgments

- Built with Supabase PostgreSQL
- AI powered by Gemini (Gemini 2.5 Flash)
- Designed for Valencia, Bukidnon, Philippines

---

## 📈 Roadmap

- [ ] Mobile app integration
- [ ] SMS report submission
- [ ] Chatbot interface
- [ ] Predictive analytics
- [ ] Integration with payment systems
- [ ] Public dashboard
- [ ] Blockchain audit trail (optional)

---

## 📅 Version History

**v1.0.0** (Current)
- Initial production release
- Complete schema and RLS
- 4 Edge Functions
- Analytics dashboard
- Audit logging

---

**Built for Valencia. Powered by Supabase. Driven by AI.** 🚀
