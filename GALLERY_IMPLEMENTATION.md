# Gallery Implementation Guide

## Overview

The TASFA Gallery feature allows users to view festival images and admins to upload and manage them. The frontend uses a festival year concept (2025, 2026) while the backend uses categories for organization.

## Architecture

### Frontend Structure

- **Festival Year Based**: Users select 2025 or 2026
- **Category Filtering**: Performance, Behind the Scenes, Awards, Audience, Other
- **Responsive Design**: 2 columns desktop, 1 column mobile

### Backend Integration

The backend uses a category-based system. The frontend maps festival years to backend categories using the format:

```
{festivalYear}-{category}
```

**Examples:**

- `2025-Performance`
- `2025-Behind-the-Scenes`
- `2026-Awards`
- `2026-Audience`

## API Endpoints Used

### 1. Upload Images

**POST** `/api/gallery/upload-multiple`

**Frontend Implementation:**

```typescript
const formData = new FormData();
const backendCategory = `${festivalYear}-${selectedCategory.replace(
  /\s+/g,
  "-"
)}`;
formData.append("category", backendCategory);
selectedFiles.forEach((file) => {
  formData.append("images", file);
});

const response = await fetch(`${API_BASE_URL}/api/gallery/upload-multiple`, {
  method: "POST",
  body: formData,
});
```

**Location:** `src/components/admin/gallery/ImageUploader.tsx`

---

### 2. Get Images

**GET** `/api/gallery/images?limit=1000`

**Frontend Implementation:**

```typescript
const response = await fetch(`${API_BASE_URL}/api/gallery/images?limit=1000`);
const data = await response.json();

// Filter by festival year
const yearImages = data.data.images
  .filter((img) => img.category.startsWith(`${festivalYear}-`))
  .map((img) => {
    // Parse category to separate year from actual category
    const categoryParts = img.category.split("-");
    const actualCategory = categoryParts.slice(1).join(" ").replace(/-/g, " ");
    return {
      ...img,
      displayCategory: actualCategory || "Other",
    };
  });
```

**Locations:**

- Admin: `src/components/admin/gallery/ImageManager.tsx`
- Public: `src/components/gallery/ImageGrid.tsx`

---

### 3. Delete Image

**DELETE** `/api/gallery/images`

**Frontend Implementation:**

```typescript
const response = await fetch(`${API_BASE_URL}/api/gallery/images`, {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ key: imageKey }),
});
```

**Location:** `src/components/admin/gallery/ImageManager.tsx`

---

## Data Mapping

### Backend Response Format

```json
{
  "success": true,
  "data": {
    "images": [
      {
        "url": "https://bucket.s3.amazonaws.com/festival-gallery/2025-Performance/timestamp-hash.jpg",
        "key": "festival-gallery/2025-Performance/timestamp-hash.jpg",
        "filename": "timestamp-hash.jpg",
        "category": "2025-Performance",
        "size": 1234567,
        "lastModified": "2024-01-15T10:30:00.000Z"
      }
    ]
  }
}
```

### Frontend Display Format

```typescript
{
  id: "festival-gallery/2025-Performance/timestamp-hash.jpg",
  url: "https://bucket.s3.amazonaws.com/festival-gallery/2025-Performance/timestamp-hash.jpg",
  alt: "timestamp-hash.jpg",
  category: "Performance",  // Parsed from "2025-Performance"
  displayCategory: "Performance",
  size: 1234567,
  lastModified: "2024-01-15T10:30:00.000Z"
}
```

## Component Structure

### Public Gallery

```
/gallery
├── GalleryPage.tsx          - Main container
├── FestivalCards.tsx        - Festival year selector
└── ImageGrid.tsx            - Image display & filtering
```

**User Flow:**

1. Select festival year (2025 or 2026)
2. View images in responsive grid
3. Filter by category
4. Click to view in lightbox

### Admin Gallery

```
/admin/gallery
├── AdminGalleryPage.tsx     - Main container with tabs
├── FestivalSelector.tsx     - Festival year selector
├── ImageUploader.tsx        - Upload interface
└── ImageManager.tsx         - View/delete images
```

**Admin Flow:**

1. Select festival year
2. **Upload Tab:**
   - Select category
   - Drag & drop images
   - Upload to backend
3. **Manage Tab:**
   - View all images
   - Filter by category
   - Delete images

## Category Handling

### Frontend Categories

```typescript
const categories = [
  "Performance",
  "Behind the Scenes",
  "Awards",
  "Audience",
  "Other",
];
```

### Backend Category Conversion

```typescript
// Upload: Frontend → Backend
"Performance" → "2025-Performance"
"Behind the Scenes" → "2025-Behind-the-Scenes"

// Display: Backend → Frontend
"2025-Performance" → "Performance"
"2026-Behind-the-Scenes" → "Behind the Scenes"
```

## Image Display

### Admin View

- **Grid:** 3 columns desktop, 1 column mobile
- **Features:**
  - Actual S3 images displayed
  - Category badge overlay
  - File size and date info
  - Two-step delete confirmation
  - Lightbox preview

### Public View

- **Grid:** 2 columns desktop, 1 column mobile
- **Features:**
  - Actual S3 images displayed
  - Category badge overlay
  - Hover effects
  - Lightbox preview
  - Smooth animations

## Error Handling

### Image Load Errors

```typescript
onError={(e) => {
  // Fallback to placeholder on error
  e.currentTarget.style.display = 'none';
  // Show placeholder UI
}}
```

### API Errors

- Upload failures: Toast notification with error message
- Fetch failures: Empty state with helpful message
- Delete failures: Toast notification, item remains in list

## Configuration

### API Base URL

```typescript
// src/config/api.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:10000";
```

### Categories

To add/modify categories, update:

- `src/components/admin/gallery/ImageUploader.tsx`
- `src/components/admin/gallery/ImageManager.tsx`
- `src/components/gallery/ImageGrid.tsx`

## Testing Checklist

### Upload Functionality

- [ ] Select festival year
- [ ] Choose category
- [ ] Upload single image
- [ ] Upload multiple images (up to 10)
- [ ] Verify images appear with correct category prefix
- [ ] Test file size limits (10MB max)
- [ ] Test supported formats (JPG, PNG, GIF, WEBP)

### Display Functionality

- [ ] Images load from S3
- [ ] Category filtering works
- [ ] Festival year filtering works
- [ ] Responsive grid layout
- [ ] Lightbox viewer works
- [ ] Empty states display correctly

### Delete Functionality

- [ ] Two-step confirmation works
- [ ] Image deletes from S3
- [ ] Image removes from list
- [ ] Error handling works

### Navigation

- [ ] Public gallery accessible at `/gallery`
- [ ] Admin gallery accessible at `/admin/gallery`
- [ ] Navigation links work (authenticated users)

## Environment Setup

### Required Environment Variables

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:10000
```

### Backend Requirements

Backend must be running and have:

- S3 bucket configured
- AWS credentials set
- Gallery endpoints implemented
- CORS configured for frontend origin

## Known Limitations

1. **No Pagination**: Currently loads all images (limit: 1000)
2. **No Bulk Operations**: Delete one image at a time
3. **No Image Editing**: Can't change category after upload
4. **No Search**: Filter by category only

## Future Enhancements

### Planned

- Pagination for large galleries
- Bulk delete functionality
- Image reordering
- Category editing
- Search functionality
- Image metadata (captions, alt text)

### Possible

- Image cropping/editing
- Download originals
- Gallery statistics
- Image compression before upload
- Progressive/lazy loading

## Troubleshooting

### Images Not Displaying

1. Check browser console for CORS errors
2. Verify API_BASE_URL is correct
3. Check S3 bucket permissions
4. Verify images exist in S3

### Upload Failing

1. Check file size (max 10MB)
2. Verify file format (JPG, PNG, GIF, WEBP)
3. Check backend logs for errors
4. Verify S3 credentials

### Category Filtering Not Working

1. Check console for filter errors
2. Verify category format matches backend
3. Check backend category response format

## Support

For issues or questions:

1. Check browser console for errors
2. Check backend logs
3. Verify API endpoints match documentation
4. Test with backend API documentation examples

## Code Examples

### Add New Category

1. Update category lists in all components:

```typescript
const categories = [
  "Performance",
  "Behind the Scenes",
  "Awards",
  "Audience",
  "VIP Moments", // New category
  "Other",
];
```

2. Category will automatically:
   - Appear in upload dropdown
   - Appear in filter tabs
   - Be converted to `{year}-VIP-Moments` format
   - Parse back to "VIP Moments" for display

### Change API Base URL

```typescript
// src/config/api.ts
export const API_BASE_URL = "https://api.tasfa.com";
```

### Modify Grid Layout

```typescript
// Change from 2 to 3 columns on desktop
className = "grid grid-cols-1 md:grid-cols-3 gap-6";
```

---

**Last Updated:** December 18, 2024
**Version:** 1.0.0
