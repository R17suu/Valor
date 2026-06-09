# 📸 VALOR Image Storage Guide

## ✅ Yes, Images Are Stored!

VALOR has **complete image storage functionality** built in with Supabase Storage.

---

## 🎯 Overview

| Aspect | Details |
|--------|---------|
| **Storage Type** | Supabase Storage (cloud storage) |
| **Image Buckets** | 2 buckets configured |
| **Max Image Size** | 10 MB per image |
| **Supported Formats** | JPEG, PNG, WebP |
| **Storage Location** | Cloud (automatically synced) |
| **Access Control** | Public (citizen images), Private (admin files) |

---

## 📦 Two Storage Buckets

### Bucket 1: `reports-images` (PUBLIC)

**Purpose**: Store citizen-submitted report photos

**Settings**:
```
Name:          reports-images
Visibility:    PUBLIC (anyone can view)
Max File Size: 10 MB
File Types:    .jpg, .jpeg, .png, .webp
Ownership:     Citizens own their uploads
```

**Access Control**:
- ✅ Citizens can upload their photos
- ✅ Citizens can update their own photos
- ✅ Citizens can delete their own photos
- ✅ Public can view (for displays, dashboards)
- ❌ Cannot modify other citizens' photos

**Use Cases**:
- Citizen report photos
- Evidence of issues
- Before/after images
- Photo gallery displays

---

### Bucket 2: `incident-files` (PRIVATE)

**Purpose**: Store administrative files, evidence, documents

**Settings**:
```
Name:          incident-files
Visibility:    PRIVATE (LGU staff only)
Max File Size: 50 MB
File Types:    PDF, Images, Documents
Ownership:     LGU personnel
```

**Access Control**:
- ✅ LGU officers can upload files
- ✅ LGU officers can view files
- ✅ LGU officers can update files
- ✅ LGU officers can delete files
- ❌ Citizens cannot access
- ❌ Public cannot view

**Use Cases**:
- LGU evidence photos
- Incident reports (PDF)
- Work orders
- Inspection documents
- Before/after repairs

---

## 🔄 How Image Storage Works in VALOR

### When a Citizen Submits a Report

```
1. Citizen selects photo from phone/camera
   ↓
2. Photo uploaded to Supabase Storage
   ↓
3. Storage returns URL (e.g., https://...)
   ↓
4. URL saved in reports.photo_url field
   ↓
5. Photo accessible for viewing
```

### Example Flow

```typescript
// 1. Citizen uploads image
const file = document.getElementById('photo').files[0];

// 2. Upload to Supabase Storage
const { data, error } = await supabase.storage
  .from('reports-images')
  .upload(`report-${reportId}.jpg`, file);

// 3. Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('reports-images')
  .getPublicUrl(`report-${reportId}.jpg`);

// 4. Save URL in database
await supabase
  .from('reports')
  .update({ photo_url: publicUrl })
  .eq('id', reportId);

// 5. Photo now accessible on web/mobile
<img src={publicUrl} />
```

---

## 📊 Database Integration

### Reports Table
```sql
-- reports table has photo_url column
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  title VARCHAR,
  description TEXT,
  photo_url VARCHAR(2048),  -- ← Stores image URL
  latitude DECIMAL,
  longitude DECIMAL,
  contact_name VARCHAR,
  contact_number VARCHAR,
  ...
)
```

### Example Report with Image
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Pothole on Main Street",
  "description": "Large hole near market",
  "photo_url": "https://project.supabase.co/storage/v1/object/public/reports-images/report-123e4567.jpg",
  "latitude": 7.9042,
  "longitude": 125.0928,
  "contact_name": "Juan Dela Cruz",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## 🖼️ Image Features

### For Citizens (Uploading Images)

✅ **Upload from Phone**
- Take photo directly
- Select from gallery
- Multiple images per report (via separate uploads)

✅ **Image Requirements**
- Max 10 MB per image
- Formats: JPG, PNG, WebP
- Auto-compressed for web

✅ **Image Privacy**
- Only you own your images
- Can't modify other people's images
- Can delete your own images
- Images are publicly viewable (for reports)

### For LGU Staff (Accessing Images)

✅ **View Citizen Photos**
- See all report images
- Use for evidence
- Reference for repairs

✅ **Upload Admin Files**
- Add work order photos
- Upload inspection reports
- Store repair documentation
- Save PDF evidence

✅ **Document Management**
- 50 MB file size limit
- Organize by incident
- Private (only staff access)

---

## 🔐 Security & Access

### Public Images (reports-images bucket)
```
URL Format: https://project.supabase.co/storage/v1/object/public/reports-images/...

Access:
- Citizen: Can upload, update, delete OWN images
- Admin: Can view all
- Public: Can view all (read-only)
```

### Private Files (incident-files bucket)
```
URL Format: https://project.supabase.co/storage/v1/object/authenticated/incident-files/...

Access:
- LGU Staff: Full access (read, write, delete)
- Citizens: No access (blocked by RLS)
- Public: No access
```

---

## 📲 Implementation Examples

### Upload Image from Web App

```typescript
// React/Vue example
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function uploadReportImage(reportId, imageFile) {
  // 1. Upload file to storage
  const fileName = `report-${reportId}-${Date.now()}.jpg`;
  
  const { data, error } = await supabase.storage
    .from('reports-images')
    .upload(fileName, imageFile);
  
  if (error) {
    console.error('Upload failed:', error);
    return null;
  }

  // 2. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('reports-images')
    .getPublicUrl(fileName);

  // 3. Update report with image URL
  const { error: updateError } = await supabase
    .from('reports')
    .update({ photo_url: publicUrl })
    .eq('id', reportId);

  return publicUrl;
}
```

### Display Image in Dashboard

```typescript
// Show citizen-uploaded image
<div className="report-image">
  <img 
    src={report.photo_url} 
    alt={report.title}
    style={{ maxWidth: '100%' }}
  />
</div>

// Download image URL
<a href={report.photo_url} download>Download Image</a>
```

### Upload Admin File (LGU Staff)

```typescript
async function uploadIncidentEvidence(incidentId, pdfFile) {
  const fileName = `incident-${incidentId}-evidence.pdf`;
  
  const { data, error } = await supabase.storage
    .from('incident-files')
    .upload(fileName, pdfFile);
  
  if (error) throw error;
  
  // Get authenticated URL (requires login)
  const { data: { signedURL } } = await supabase.storage
    .from('incident-files')
    .createSignedUrl(fileName, 3600); // 1 hour validity
  
  return signedURL;
}
```

---

## 📈 Storage Usage & Limits

### Free Tier Limits (Supabase)
```
Storage Quota: 1 GB
Bandwidth:     3 GB/month
File Limit:    5 GB max per file
```

### Recommended Limits for VALOR
```
Per Report:    10 MB max (1-5 images)
Per Incident:  50 MB max (multiple files)
Storage Plan:  1 GB (≈ 100-200 full reports)
```

### Upgrade Path
```
Free:     1 GB storage, 3 GB bandwidth/month
Pro:      100 GB storage, 600 GB bandwidth/month
Cost:     $25/month + overage charges
```

---

## 🔍 Viewing & Managing Images

### In Supabase Dashboard

**View Images**:
1. Go to **Storage** section
2. Click **reports-images** bucket
3. See all citizen-uploaded images
4. Click image to preview or download

**Manage Files**:
- Preview images
- Copy public URL
- Delete files
- View file size
- See upload date

### Programmatically

```typescript
// List all images in bucket
const { data: files, error } = await supabase.storage
  .from('reports-images')
  .list();

// Get metadata
files.forEach(file => {
  console.log(`${file.name} - ${file.metadata.size} bytes`);
});

// Delete old images (cleanup)
await supabase.storage
  .from('reports-images')
  .remove([`report-old-id.jpg`]);
```

---

## ⚙️ Setup Instructions

### During Deployment (STEP 4 in Quick Start)

```
1. In Supabase Dashboard, click Storage
2. Click "Create a new bucket"
3. Create bucket: "reports-images"
   - Public: ON
   - File size: 10 MB
4. Create bucket: "incident-files"
   - Public: OFF
   - File size: 50 MB
5. Done!
```

### Verify Storage Works

```bash
# Test upload via curl
curl -X POST \
  'https://project.supabase.co/storage/v1/object/reports-images/test.jpg' \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: image/jpeg" \
  --data-binary @test.jpg

# Response: File uploaded successfully
```

---

## 📊 Common Use Cases

### Citizen Submits Report with Photo
```
1. Citizen takes photo of pothole
2. Opens VALOR app
3. Fills form: title, description, location
4. Clicks "Add Photo"
5. Selects image from phone
6. App uploads to Supabase Storage
7. URL saved in database
8. Report created with image
```

### LGU Views Reports with Images
```
1. Officer opens VALOR dashboard
2. Sees list of incidents
3. Clicks incident
4. Views citizen photos
5. Uses as evidence for work order
6. Uploads repair completion photos
7. Saves to incident-files bucket
```

### Public Sees Image Gallery
```
1. Public accesses VALOR website
2. Sees recent incident reports
3. Clicks report
4. Sees citizen-uploaded image
5. Helps understand issue
6. Can share or download
```

---

## 🚀 Production Considerations

### Image Optimization
```
Recommended:
- Compress images before upload
- Resize to max 2048x2048 px
- Use WebP format for new uploads
- JPG for compatibility
```

### Backup Strategy
```
- Enable Supabase backups (automatic)
- Daily backup retention
- Images included in backups
- 7-30 day retention
```

### Cost Management
```
- Monitor storage usage monthly
- Set file size limits
- Clean up old/duplicate images
- Use CDN for image delivery
```

### Performance
```
- Images served from CDN (fast)
- Public URLs are cached globally
- Automatic image optimization
- Lazy loading recommended
```

---

## ✅ Image Storage Checklist

### Before Deployment
- [ ] Understand 2 buckets (public + private)
- [ ] Know file size limits (10 MB + 50 MB)
- [ ] Review security policies
- [ ] Plan for backups

### During Deployment
- [ ] Create both storage buckets
- [ ] Set correct privacy settings
- [ ] Verify file size limits
- [ ] Test image upload

### After Deployment
- [ ] Upload test image
- [ ] Verify URL works
- [ ] Check dashboard display
- [ ] Monitor storage usage

---

## 📚 Related Files

- **QUICK_START_SUPABASE.md** - Step 4: Create Storage Buckets
- **003_storage_setup.sql** - Storage configuration details
- **API_DOCUMENTATION.md** - Upload/download examples
- **docs/DEPLOYMENT_GUIDE.md** - Complete setup guide

---

## 🎯 Summary

| Aspect | Details |
|--------|---------|
| **Images Stored?** | ✅ Yes, fully supported |
| **Storage Type** | Supabase Cloud Storage |
| **Public Bucket** | reports-images (10 MB max) |
| **Private Bucket** | incident-files (50 MB max) |
| **Automatic?** | Yes, integrated with reports |
| **Accessible?** | Public URLs for citizens, Private for staff |
| **Cost** | Included in Supabase plan |
| **Backup** | Automatic daily backups |
| **Ready** | Yes, fully configured |

---

## 🚀 Ready to Store Images!

Your VALOR backend is fully configured for image storage. When you deploy:

1. Create the 2 storage buckets
2. Citizens can upload photos
3. LGU staff can access images
4. Everything automatically backed up
5. Images served globally via CDN

**Images are ready to go!** 📸✨

---

*For detailed image upload examples, see API_DOCUMENTATION.md*

*For deployment steps, see QUICK_START_SUPABASE.md (STEP 4)*
