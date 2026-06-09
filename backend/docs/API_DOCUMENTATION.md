# VALOR Backend - API Documentation

## Base URL

```
https://your-project.supabase.co
```

## Authentication

All requests require authentication headers:

```http
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

For service-to-service communication, use `SERVICE_ROLE_KEY` instead of `ANON_KEY`.

---

## Edge Functions

### 1. Draft Report From Photo

**Endpoint**: `POST /functions/v1/draft-report`

**Purpose**: Analyzes the uploaded citizen photo in the background and returns a draft title, description, classification, and summary that the citizen can review and edit before submitting.

**Request**:
```json
{
  "photo_url": "https://your-project.supabase.co/storage/v1/object/public/reports-images/report-123.jpg",
  "title": "",
  "description": "",
  "latitude": 8.2456,
  "longitude": 125.1234
}
```

**Response (Success - 200)**:
```json
{
  "suggested_title": "Large Pothole Near Public Market",
  "description": "A large pothole is visible on the road surface near a busy market area. It appears deep enough to damage vehicles and may pose a risk to motorcycles and pedestrians. The damage looks like it needs urgent attention.",
  "category": "Potholes",
  "priority": "high",
  "department": "Engineering Office",
  "confidence": 0.94,
  "summary": "Large pothole near the public market that may damage vehicles and create safety risks."
}
```

**Response (Error - 400)**:
```json
{
  "error": "Missing required field: photo_url"
}
```

---

### 2. Classify Report

**Endpoint**: `POST /functions/v1/classify-report`

**Purpose**: Uses AI to classify a citizen report into a category, priority level, and responsible department. Usually called by the backend only when the final report does not already include reviewed values.

**Request**:
```json
{
  "title": "Large Pothole on Main Street",
  "description": "There's a large pothole near the market that damaged my motorcycle"
}
```

**Response (Success - 200)**:
```json
{
  "category": "Potholes",
  "priority": "high",
  "department": "Engineering Office",
  "confidence": 0.95
}
```

**Response (Error - 400)**:
```json
{
  "error": "Missing required fields: title and description"
}
```

**Categories**:
- Potholes
- Road Damage
- Flooding
- Illegal Dumping
- Garbage Accumulation
- Broken Streetlights
- Fallen Trees
- Water Service Issues
- Public Safety Concerns

**Priorities**:
- critical: Immediate safety risk
- high: Major infrastructure damage
- medium: Moderate issues
- low: Minor issues

---

### 3. Summarize Report

**Endpoint**: `POST /functions/v1/summarize-report`

**Purpose**: Generates a concise AI summary of a citizen report for LGU personnel. The backend uses this only when the citizen has not already edited or supplied a final summary.

**Request**:
```json
{
  "title": "Large Pothole on Main Street",
  "description": "There's a large pothole near the market that damaged my motorcycle. It's about 1 meter wide and 30cm deep. Very dangerous for riders."
}
```

**Response (Success - 200)**:
```json
{
  "summary": "Large pothole (1m x 30cm) near the market on Main Street causing damage to motorcycles and posing safety risks."
}
```

**Response (Error - 500)**:
```json
{
  "error": "Internal server error",
  "details": "Failed to generate summary"
}
```

---

### 4. Detect Duplicate

**Endpoint**: `POST /functions/v1/detect-duplicate`

**Purpose**: Finds unresolved incidents of the same category within 100 meters to detect duplicate reports.

**Request**:
```json
{
  "latitude": 8.2456,
  "longitude": 125.1234,
  "category": "Potholes"
}
```

**Response (Success - Duplicate Found - 200)**:
```json
{
  "duplicate_found": true,
  "incident_id": "550e8400-e29b-41d4-a716-446655440000",
  "distance_meters": 47,
  "existing_incident_count": 3
}
```

**Response (Success - No Duplicate - 200)**:
```json
{
  "duplicate_found": false
}
```

**Response (Error - Invalid Coordinates - 400)**:
```json
{
  "error": "Invalid coordinates"
}
```

**Distance Threshold**: 100 meters

---

### 5. Process Report

**Endpoint**: `POST /functions/v1/process-report`

**Purpose**: Orchestrates the complete report processing pipeline while preserving citizen-edited values when they already exist:
1. Classifies the report
2. Summarizes the report
3. Detects duplicate incidents
4. Creates or links to an incident
5. Updates all related data

**Request**:
```json
{
  "report_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (Success - New Incident - 200)**:
```json
{
  "success": true,
  "report_id": "550e8400-e29b-41d4-a716-446655440000",
  "incident_id": "660f9511-f41c-52e5-b827-557766551111",
  "incident_created": true,
  "classification": {
    "category": "Potholes",
    "priority": "high",
    "department": "Engineering Office"
  },
  "summary": "Large pothole near market on Main Street causing vehicle damage.",
  "duplicate_match": null
}
```

**Response (Success - Duplicate Linked - 200)**:
```json
{
  "success": true,
  "report_id": "550e8400-e29b-41d4-a716-446655440000",
  "incident_id": "660f9511-f41c-52e5-b827-557766551111",
  "incident_created": false,
  "classification": {
    "category": "Potholes",
    "priority": "high",
    "department": "Engineering Office"
  },
  "summary": "Large pothole near market on Main Street.",
  "duplicate_match": {
    "incident_id": "770g0622-g52d-63f6-c938-668877662222",
    "distance_meters": 45
  }
}
```

**Response (Error - 500)**:
```json
{
  "error": "Internal server error",
  "details": "Failed to create incident"
}
```

---

## Database REST API

### Reports Table

#### Create Report

**Endpoint**: `POST /rest/v1/reports`

**Request**:
```json
{
  "title": "Pothole on Main Street",
  "description": "Large hole near the market",
  "latitude": 8.2456,
  "longitude": 125.1234,
  "contact_name": "Juan Dela Cruz",
  "contact_number": "+63917234567",
  "contact_email": "juan@example.com",
  "category": "Potholes",
  "photo_url": "https://storage.supabase.co/reports-images/...",
  "status": "submitted"
}
```

**Response (201 Created)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Pothole on Main Street",
  "created_at": "2024-01-15T10:30:00Z",
  ...
}
```

#### Get Reports

**Endpoint**: `GET /rest/v1/reports`

**Query Parameters**:
- `select`: Select specific columns
- `status`: Filter by status (submitted, assigned, in_progress, resolved, cancelled)
- `category`: Filter by category
- `order`: Sort order (created_at.desc default)

**Example**:
```
GET /rest/v1/reports?status=eq.submitted&order=created_at.desc
```

**Response (200)**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Pothole on Main Street",
    "status": "submitted",
    "created_at": "2024-01-15T10:30:00Z",
    ...
  }
]
```

#### Update Report

**Endpoint**: `PATCH /rest/v1/reports?id=eq.550e8400-e29b-41d4-a716-446655440000`

**Request**:
```json
{
  "status": "assigned",
  "incident_id": "660f9511-f41c-52e5-b827-557766551111"
}
```

**Response (200)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "assigned",
  ...
}
```

---

### Incidents Table

#### Get Incidents

**Endpoint**: `GET /rest/v1/incidents`

**Query Parameters**:
- `select`: Specific columns
- `status`: Filter by status (open, assigned, in_progress, resolved, closed)
- `priority`: Filter by priority (critical, high, medium, low)
- `department_id`: Filter by department
- `order`: Sort order

**Example**:
```
GET /rest/v1/incidents?status=eq.open&priority=in.(critical,high)&order=created_at.desc
```

**Response (200)**:
```json
[
  {
    "id": "660f9511-f41c-52e5-b827-557766551111",
    "category": "Potholes",
    "priority": "high",
    "status": "open",
    "report_count": 3,
    "latitude": 8.2456,
    "longitude": 125.1234,
    "created_at": "2024-01-15T10:30:00Z",
    ...
  }
]
```

#### Update Incident

**Endpoint**: `PATCH /rest/v1/incidents?id=eq.660f9511-f41c-52e5-b827-557766551111`

**Request**:
```json
{
  "status": "in_progress",
  "assigned_to": "770h1733-h63e-74g7-d049-779988773333"
}
```

**Response (200)**:
```json
{
  "id": "660f9511-f41c-52e5-b827-557766551111",
  "status": "in_progress",
  "assigned_to": "770h1733-h63e-74g7-d049-779988773333",
  ...
}
```

#### Mark as Resolved

**Endpoint**: `PATCH /rest/v1/incidents?id=eq.660f9511-f41c-52e5-b827-557766551111`

**Request**:
```json
{
  "status": "resolved",
  "resolved_at": "2024-01-16T15:00:00Z",
  "resolved_by": "770h1733-h63e-74g7-d049-779988773333"
}
```

---

### Incident Updates Table

#### Create Update

**Endpoint**: `POST /rest/v1/incident_updates`

**Request**:
```json
{
  "incident_id": "660f9511-f41c-52e5-b827-557766551111",
  "update_message": "Team arrived at site, pothole is 2m x 40cm",
  "updated_by": "770h1733-h63e-74g7-d049-779988773333",
  "status": "in_progress"
}
```

**Response (201 Created)**:
```json
{
  "id": "880i2844-i74f-85h8-e150-880099884444",
  "incident_id": "660f9511-f41c-52e5-b827-557766551111",
  "created_at": "2024-01-16T11:00:00Z",
  ...
}
```

#### Get Updates for Incident

**Endpoint**: `GET /rest/v1/incident_updates?incident_id=eq.660f9511-f41c-52e5-b827-557766551111&order=created_at.desc`

**Response (200)**:
```json
[
  {
    "id": "880i2844-i74f-85h8-e150-880099884444",
    "incident_id": "660f9511-f41c-52e5-b827-557766551111",
    "update_message": "Team arrived at site...",
    "created_at": "2024-01-16T11:00:00Z",
    ...
  }
]
```

---

### Analytics Views

#### Dashboard Summary

**Endpoint**: `GET /rest/v1/dashboard_summary`

**Response (200)**:
```json
[
  {
    "open_incidents": 15,
    "resolved_incidents": 87,
    "pending_reports": 3,
    "total_reports": 105,
    "active_staff": 16,
    "active_departments": 5,
    "generated_at": "2024-01-16T12:00:00Z"
  }
]
```

#### Department Performance

**Endpoint**: `GET /rest/v1/department_performance`

**Response (200)**:
```json
[
  {
    "department": "Engineering Office",
    "assigned_incidents": 25,
    "resolved_incidents": 18,
    "open_incidents": 7,
    "assigned_officers": 4,
    "avg_resolution_hours": 42.5,
    "resolution_rate": 72.0
  }
]
```

#### Category Distribution

**Endpoint**: `GET /rest/v1/category_distribution`

**Response (200)**:
```json
[
  {
    "category": "Potholes",
    "incident_count": 34,
    "priority_levels": ["high", "medium", "low"],
    "resolved_count": 28,
    "open_count": 6,
    "resolution_rate": 82.35
  }
]
```

#### Overdue Incidents

**Endpoint**: `GET /rest/v1/overdue_incidents`

**Response (200)**:
```json
[
  {
    "id": "660f9511-f41c-52e5-b827-557766551111",
    "category": "Flooding",
    "priority": "critical",
    "hours_open": 28,
    "sla_hours": 24,
    "is_overdue": true
  }
]
```

---

## Authentication Examples

### Using JavaScript/Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Create a report
const { data, error } = await supabase
  .from('reports')
  .insert({
    title: 'Pothole',
    description: 'Large hole',
    latitude: 8.2456,
    longitude: 125.1234,
    contact_name: 'Juan',
    contact_number: '+63917234567'
  })

// Get incidents
const { data: incidents } = await supabase
  .from('incidents')
  .select('*')
  .eq('status', 'open')
  .order('created_at', { ascending: false })
```

### Using Fetch API

```javascript
// Draft a report from a photo
const response = await fetch(
  'https://your-project.supabase.co/functions/v1/draft-report',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      photo_url: 'https://your-project.supabase.co/storage/v1/object/public/reports-images/report-123.jpg',
      latitude: 8.2456,
      longitude: 125.1234
    })
  }
)

const draft = await response.json()
console.log(draft.suggested_title, draft.category, draft.priority)
```

### Using cURL

```bash
# Classify report
curl -X POST \
  'https://your-project.supabase.co/functions/v1/classify-report' \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Pothole",
    "description": "Large hole near market"
  }'

# Get reports
curl -X GET \
  'https://your-project.supabase.co/rest/v1/reports?status=eq.submitted' \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY"
```

---

## Error Handling

All endpoints return standard HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden (RLS Policy Violation) |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

**Standard Error Response**:
```json
{
  "error": "Error message",
  "details": "Additional details"
}
```

---

## Rate Limiting

Supabase default rate limits apply:
- 50 requests per second per IP for REST API
- Edge Functions have a 15-minute timeout

---

## Pagination

For large datasets, use pagination:

```
GET /rest/v1/reports?select=*&limit=50&offset=0
```

Query parameters:
- `limit`: Records per page (default 1000, max 1000)
- `offset`: Starting position (for pagination)

---

## Realtime Subscriptions

Subscribe to real-time updates (if enabled):

```typescript
const subscription = supabase
  .on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'incidents' },
    (payload) => {
      console.log('Incident changed:', payload)
    }
  )
  .subscribe()
```

---

## Webhooks

To receive webhooks for incident events:

1. Go to Supabase Dashboard > Database > Webhooks
2. Create webhook on `incidents` table for events: insert, update
3. Configure your endpoint to receive POST requests

**Webhook Payload**:
```json
{
  "type": "INSERT",
  "table": "incidents",
  "record": {
    "id": "660f9511-f41c-52e5-b827-557766551111",
    "category": "Potholes",
    ...
  },
  "schema": "public"
}
```
