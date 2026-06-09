# VALOR Backend - Deployment Guide

## Prerequisites

- Supabase project created
- PostgreSQL database ready
- Gemini API key
- Supabase CLI installed (`npm install -g supabase`)

## Step 1: Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Create a new project
3. Choose a region close to Valencia, Philippines
4. Save your project credentials

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Supabase credentials:
   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

## Step 3: Initialize Supabase Project Locally (Optional)

```bash
supabase init
supabase link --project-ref your-project-id
```

## Step 4: Apply Database Schema

### Option A: Using Supabase CLI (Recommended)

```bash
# Copy migration files
cp supabase/migrations/*.sql path/to/supabase/migrations/

# Push to remote
supabase db push
```

### Option B: Using Supabase Dashboard

1. Open Supabase dashboard
2. Go to SQL Editor
3. Create a new query
4. Copy and paste content from migration files in order:
   - `001_initial_schema.sql`
   - `002_seed_data.sql`
   - `003_storage_setup.sql`
   - `004_analytics_queries.sql`
5. Execute each file

### Option C: Using psql

```bash
# Get connection string from Supabase dashboard
psql "postgresql://user:password@host:port/database" < supabase/migrations/001_initial_schema.sql
psql "postgresql://user:password@host:port/database" < supabase/migrations/002_seed_data.sql
psql "postgresql://user:password@host:port/database" < supabase/migrations/003_storage_setup.sql
psql "postgresql://user:password@host:port/database" < supabase/migrations/004_analytics_queries.sql
```

## Step 5: Apply Row Level Security (RLS) Policies

```bash
supabase db push
# or manually execute rls_policies/001_auth_policies.sql
```

## Step 6: Deploy Edge Functions

### Using Supabase CLI

```bash
# Deploy classify-report
supabase functions deploy classify-report --project-ref your-project-id

# Deploy summarize-report
supabase functions deploy summarize-report --project-ref your-project-id

# Deploy detect-duplicate
supabase functions deploy detect-duplicate --project-ref your-project-id

# Deploy process-report
supabase functions deploy process-report --project-ref your-project-id
```

### Set Environment Variables for Edge Functions

```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here --project-ref your-project-id
```

### Using Dashboard

1. Go to Edge Functions in Supabase dashboard
2. Create new function for each endpoint:
   - `classify-report`
   - `summarize-report`
   - `detect-duplicate`
   - `process-report`
3. Copy code from corresponding `index.ts` file
4. Deploy

## Step 7: Create Storage Buckets

### Via Supabase Dashboard

1. Go to Storage section
2. Create bucket: `reports-images`
   - Public: ON
   - Max file size: 10MB
3. Create bucket: `incident-files`
   - Public: OFF
   - Max file size: 50MB

### Via CLI (in supabase/migrations/003_storage_setup.sql)

Uncomment and execute the SQL commands for storage setup.

## Step 8: Configure CORS (if needed)

In Supabase dashboard > Settings > API:
- Add your frontend URL to allowed origins
- Example: `http://localhost:3000`, `https://valor.gov.ph`

## Step 9: Enable Realtime (Optional)

In Supabase dashboard > Database > Realtime:
- Enable realtime for tables: `incidents`, `reports`, `incident_updates`

## Step 10: Test the Setup

### 1. Test Database Connection

```bash
curl -X GET "https://your-project.supabase.co/rest/v1/barangays" \
  -H "apikey: your-anon-key" \
  -H "Authorization: Bearer your-anon-key"
```

### 2. Test Edge Function

```bash
curl -X POST "https://your-project.supabase.co/functions/v1/classify-report" \
  -H "Authorization: Bearer your-anon-key" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pothole on Main Street",
    "description": "Large pothole near the market, dangerous for motorcycles"
  }'
```

### 3. Test RLS Policies

Try querying as different user roles to verify access control.

## Step 11: Set Up Backups

In Supabase dashboard > Settings > Backups:
- Enable automated backups
- Set retention period (7-30 days recommended)

## Step 12: Monitor Performance

Set up monitoring in Supabase dashboard:
- Database stats
- Edge Function invocations
- Storage usage
- RLS policy violations

## Production Checklist

- [ ] All environment variables are set
- [ ] Database migrations are applied
- [ ] RLS policies are enabled
- [ ] Edge Functions are deployed
- [ ] Storage buckets are created
- [ ] CORS is configured
- [ ] Backups are enabled
- [ ] Monitoring is active
- [ ] SSL/TLS is enabled (automatic with Supabase)
- [ ] Rate limiting is configured
- [ ] Logging is enabled
- [ ] Security policies reviewed

## Scaling Considerations

1. **Database**: Monitor query performance, add indexes as needed
2. **Edge Functions**: Use caching, optimize API calls to external services
3. **Storage**: Implement cleanup policies for old files
4. **RLS**: Optimize policies to avoid heavy queries

## Maintenance

### Weekly
- Monitor error logs
- Check storage usage
- Review performance metrics

### Monthly
- Review database backups
- Update dependencies
- Check for security patches

### Quarterly
- Analyze usage patterns
- Optimize slow queries
- Review access patterns

## Troubleshooting

### Edge Functions Timing Out
- Check external API responses (Gemini)
- Optimize database queries
- Increase timeout if needed

### RLS Policy Issues
- Check email formatting (must match auth.email())
- Verify user roles in admin_users table
- Test policies with specific users

### Storage Upload Failures
- Check bucket policies
- Verify file size limits
- Check CORS configuration

### High Database Load
- Enable query caching
- Review indexes
- Consider connection pooling

## Support

For issues:
1. Check Supabase logs (Dashboard > Logs)
2. Review Edge Function logs
3. Check database query performance
4. Contact Supabase support if needed

## Rollback Plan

If issues occur:
1. Revert Edge Functions to previous version
2. Rollback database to backup
3. Check error logs for root cause
4. Deploy fix and test thoroughly
