# VALOR: Valencia Automated Local Operations & Response

## Overview

VALOR is an AI-powered citizen issue reporting and incident management platform designed for the City Government of Valencia. The platform enables residents to report community concerns through a web application while helping LGU departments respond faster through AI-assisted classification, incident clustering, geospatial monitoring, and analytics.

Unlike traditional complaint systems, VALOR automatically identifies duplicate reports based on location and issue type, creating a single incident record that can be tracked and resolved efficiently.

---

# Problem Statement

Local governments often receive reports through:

- Walk-ins
- Phone calls
- Facebook messages
- Paper forms
- Multiple reporting channels

This results in:

- Duplicate complaints
- Delayed responses
- Manual report sorting
- Limited visibility of community issues
- Lack of actionable data for planning

---

# Solution

VALOR provides a centralized platform (mobile first UI/UX) where citizens can:

- Report local issues
- Upload photos
- Pin locations on a map
- Track incident status

The platform uses AI to:

- Classify reports
- Assign responsible departments
- Determine urgency levels
- Summarize complaints
- Detect potential duplicate incidents

---

# Key Features

## Citizen Reporting Portal

Residents can report:

- Potholes
- Road damage
- Flooding
- Illegal dumping
- Garbage accumulation
- Broken streetlights
- Fallen trees
- Water service issues
- Public safety concerns

### Submission Information

- Report title
- Description
- Location
- Photo upload
- Contact information (optional)

No citizen account is required for the MVP.

---

## AI-Powered Complaint Classification

Gemini automatically analyzes submitted reports and determines:

- Issue category
- Priority level
- Assigned department

### Example

Input:

"There is a large pothole near Valencia National High School."

Output:

```json
{
  "category": "Infrastructure",
  "priority": "High",
  "department": "Engineering Office"
}
```

---

## Incident Clustering & Duplicate Detection

One of VALOR's core innovations is incident clustering.

Instead of creating multiple records for the same issue, the system:

1. Checks report location.
2. Identifies nearby unresolved incidents.
3. Compares issue categories.
4. Optionally uses AI similarity scoring.
5. Groups reports into a single incident.

### Example

30 residents report the same pothole.

VALOR creates:

- 1 Incident Record
- 30 Linked Citizen Reports

Benefits:

- Reduced dashboard clutter
- Fewer duplicate work orders
- Better issue tracking

---

## Interactive Incident Map

All incidents are displayed on a city map.

Features:

- Incident markers
- Barangay filtering
- Status filtering
- Department filtering
- Heatmaps of issue concentration

Map visualization helps LGU personnel identify:

- Flood-prone areas
- Infrastructure hotspots
- Illegal dumping locations

---

## AI Report Summarization

Long reports are automatically condensed into short actionable summaries.

Example:

Original:

"The road beside the market has been damaged for several weeks and vehicles are having difficulty passing through the area."

Summary:

"Road damage near public market affecting vehicle access."

---

## LGU Dashboard

Authorized LGU personnel can:

- View incidents
- Assign personnel
- Update statuses
- Monitor response times
- Analyze trends

### Incident Statuses

- Submitted
- Under Review
- Assigned
- In Progress
- Resolved
- Closed

---

## Analytics Dashboard

Provides decision-making insights including:

- Total incidents
- Resolution rate
- Average response time
- Most reported categories
- Barangay rankings
- Department workload

---

# System Architecture

## Frontend

- Next.js
- React
- Tailwind CSS
- Leaflet Maps

## Backend

- Supabase

Responsibilities:

- API services
- AI integration
- Incident management
- Analytics

## Database

- Supabase PostgreSQL

Stores:

- Reports
- Incidents
- Departments
- Barangays
- Audit logs

## Storage

- cloudinary

Stores:

- Uploaded images
- Supporting files

---

# AI Components

## Gemini API

Used for:

- Complaint classification
- Department routing
- Priority scoring
- Report summarization
- Similarity analysis

## Computer Vision (Future Phase): 

Potential integration:

- YOLOv11

Detection capabilities:

- Potholes
- Garbage
- Flooding
- Damaged infrastructure
- Fallen trees

---

# Database Design

## Reports

| Field | Type |
|---------|---------|
| id | UUID |
| title | Text |
| description | Text |
| latitude | Float |
| longitude | Float |
| category | Text |
| status | Text |
| incident_id | UUID |
| created_at | Timestamp |

## Incidents

| Field | Type |
|---------|---------|
| id | UUID |
| category | Text |
| priority | Text |
| department | Text |
| latitude | Float |
| longitude | Float |
| report_count | Integer |
| status | Text |

## Departments

| Field | Type |
|---------|---------|
| id | UUID |
| name | Text |
| email | Text |

---

# User Workflow

## Citizen

1. Submit report.
2. Add description.
3. Upload photo.
4. Pin location.
5. Submit report.

AI automatically:

- Categorizes issue
- Assigns department
- Checks duplicates
- Creates or updates incident

---

## LGU Personnel

1. View incident dashboard.
2. Review assigned incidents.
3. Deploy response team.
4. Update progress.
5. Mark incident as resolved.

---

# Benefits

## For Citizens

- Easy reporting
- Greater transparency
- Faster government response
- Issue tracking

## For LGU

- Centralized reporting
- Reduced duplicate complaints
- Better resource allocation
- Data-driven decision making

## For Valencia City

- Improved public services
- Better infrastructure monitoring
- Increased citizen engagement
- Smarter governance

---

# Future Enhancements

## Phase 2

- Citizen authentication
- SMS notifications
- Voice reporting
- Barangay dashboards

## Phase 3

- Computer vision integration
- CCTV monitoring
- Predictive analytics
- Disaster response modules

---

# SDG Alignment

- SDG 9: Industry, Innovation and Infrastructure
- SDG 11: Sustainable Cities and Communities
- SDG 16: Peace, Justice and Strong Institutions

---

# Tagline

**Empowering Citizens. Accelerating Government Response. Building a Smarter Valencia City.**
