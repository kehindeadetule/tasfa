# Gallery API Documentation

This document outlines the API endpoints required for the Gallery feature.

## Base URL

```
${API_BASE_URL}/api
```

## Authentication

All admin endpoints require authentication via Bearer token:

```
Authorization: Bearer ${token}
```

Token should be retrieved from `localStorage.getItem("tasfa_a_t")`

---

## Public Endpoints

### 1. Get Gallery Images by Festival Year

**GET** `/gallery/:festivalYear`

Get all images for a specific festival year (public view).

**Parameters:**

- `festivalYear` (string): The festival year (e.g., "2025", "2026")

**Query Parameters (optional):**

- `category` (string): Filter by category

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "url": "string",
      "category": "string",
      "festivalYear": "string",
      "filename": "string",
      "uploadedAt": "ISO8601 date string"
    }
  ]
}
```

---

## Admin Endpoints

### 2. Upload Gallery Images

**POST** `/admin/gallery/upload`

Upload multiple images for a festival.

**Headers:**

- `Authorization: Bearer ${token}`
- `Content-Type: multipart/form-data`

**Body (FormData):**

- `images` (File[]): Array of image files
- `festivalYear` (string): Festival year (e.g., "2025")
- `category` (string): Image category (Performance, Behind the Scenes, Awards, Audience, Other)

**Response:**

```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": [
    {
      "_id": "string",
      "url": "string",
      "category": "string",
      "festivalYear": "string",
      "filename": "string",
      "uploadedAt": "ISO8601 date string"
    }
  ]
}
```

### 3. Get All Gallery Images (Admin View)

**GET** `/admin/gallery/:festivalYear`

Get all images for a specific festival year (admin view with full details).

**Headers:**

- `Authorization: Bearer ${token}`

**Parameters:**

- `festivalYear` (string): The festival year

**Query Parameters (optional):**

- `category` (string): Filter by category

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "url": "string",
      "category": "string",
      "festivalYear": "string",
      "filename": "string",
      "uploadedAt": "ISO8601 date string",
      "uploadedBy": "string",
      "size": "number"
    }
  ]
}
```

### 4. Delete Gallery Image

**DELETE** `/admin/gallery/:imageId`

Delete a specific image.

**Headers:**

- `Authorization: Bearer ${token}`

**Parameters:**

- `imageId` (string): The image ID to delete

**Response:**

```json
{
  "success": true,
  "message": "Image deleted successfully"
}
```

---

## Data Models

### GalleryImage Schema

```typescript
interface GalleryImage {
  _id: string;
  url: string; // Full URL to the image
  category: string; // Performance | Behind the Scenes | Awards | Audience | Other
  festivalYear: string; // "2025" | "2026"
  filename: string; // Original filename
  uploadedAt: Date; // Upload timestamp
  uploadedBy?: string; // Admin user ID (optional)
  size?: number; // File size in bytes (optional)
}
```

---

## Image Categories

The following categories are available:

- **Performance**: Stage performances, acts, and shows
- **Behind the Scenes**: Backstage, preparation, rehearsals
- **Awards**: Award ceremonies, winners, trophies
- **Audience**: Crowd shots, attendees, reactions
- **Other**: Miscellaneous images

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

**Common HTTP Status Codes:**

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error

---

## Frontend Components

### User-Facing Pages

1. **Gallery Page** (`/gallery`)
   - Festival selection cards (2025 active, 2026 coming soon)
   - Image grid (2 columns desktop, 1 column mobile)
   - Category filtering
   - Lightbox image viewer

### Admin Pages

1. **Admin Gallery Management** (`/admin/gallery`)
   - Festival selector
   - Upload interface with drag-and-drop
   - Image manager with grid view
   - Delete functionality with confirmation
   - Category filtering

---

## Notes

- Images are currently shown as placeholders until the backend API is ready
- Frontend is fully functional with mock data
- All API endpoints follow RESTful conventions
- File uploads support multiple files simultaneously
- Images should be optimized on the backend before storage
- Consider implementing pagination for large galleries
- Recommended image formats: JPG, PNG, WEBP
- Maximum file size should be enforced on backend (e.g., 5MB per image)

---

## Testing the Integration

Once the backend is ready:

1. Update `API_BASE_URL` in `/src/config/api.ts` if needed
2. Ensure authentication tokens are properly stored
3. Test upload with various image formats
4. Test category filtering
5. Test delete functionality
6. Verify images are properly displayed in the public gallery
7. Test on both mobile and desktop devices

---

## Future Enhancements

Consider implementing:

- Bulk delete
- Image reordering/sorting
- Image metadata editing (category change, description)
- Image compression before upload
- Progressive image loading
- Lazy loading for better performance
- Search functionality
- Download original images (admin)
- Image statistics and analytics
