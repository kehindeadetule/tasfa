# Gallery Quick Start Guide

## 🎯 What's Built

A complete gallery system with:

- ✅ Public gallery at `/gallery`
- ✅ Admin management at `/admin/gallery`
- ✅ Festival year organization (2025, 2026)
- ✅ Category filtering
- ✅ Upload, view, and delete functionality
- ✅ Fully integrated with your backend API

## 🚀 Backend API Integration

### Your Backend Endpoints Used:

1. **Upload:** `POST /api/gallery/upload-multiple`
2. **Get Images:** `GET /api/gallery/images?limit=1000`
3. **Delete:** `DELETE /api/gallery/images` (with `key` in body)

### How We Map Festival Years:

**Upload Format:**

```
Frontend: "2025" + "Performance"
Backend:  "2025-Performance" (category)
```

**Display Format:**

```
Backend:  "2025-Performance" (category)
Frontend: Filters by "2025-", displays as "Performance"
```

## 📋 Testing Steps

### 1. Start Your Backend

```bash
# Make sure your backend is running on port 10000
# or update NEXT_PUBLIC_API_BASE_URL in .env
```

### 2. Test Public Gallery

1. Visit: `http://localhost:3000/gallery`
2. Click on "TASFA 2025" card
3. Should fetch and display images from backend
4. Test category filtering
5. Click images to view in lightbox

### 3. Test Admin Upload

1. Login as admin
2. Visit: `http://localhost:3000/admin/gallery`
3. Click "Gallery" link in navbar (shows when authenticated)
4. Select "TASFA 2025"
5. Choose category (e.g., "Performance")
6. Drag & drop images or click to browse
7. Click upload
8. Backend should receive category as "2025-Performance"

### 4. Test Admin Management

1. Switch to "Manage Images" tab
2. View all uploaded images
3. Filter by category
4. Click image to preview
5. Click delete → confirm to remove

## 🔍 Verification

### Check Upload Works:

1. Upload an image with category "Performance" for 2025
2. Backend receives: `category: "2025-Performance"`
3. S3 path: `festival-gallery/2025-performance/timestamp-hash.jpg`

### Check Display Works:

1. Backend returns: `{ category: "2025-Performance", url: "..." }`
2. Frontend filters: Images starting with "2025-"
3. Frontend displays: Category as "Performance"

### Check Delete Works:

1. Click delete on an image
2. Confirm deletion
3. Frontend sends: `{ key: "festival-gallery/2025-performance/file.jpg" }`
4. Backend deletes from S3
5. Image removed from list

## 🎨 UI Features

### Public Gallery

- Beautiful hero section
- Festival year cards (2025 active, 2026 coming soon)
- 2-column grid (desktop), 1-column (mobile)
- Category filter tabs
- Lightbox viewer
- Smooth animations

### Admin Gallery

- Festival year selector
- Two tabs: Upload & Manage
- Drag & drop upload with preview
- Grid view with real S3 images
- Two-step delete confirmation
- Category filtering
- Image size and date info

## 🔧 Configuration

### Backend URL

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:10000
```

### Categories

Currently configured:

- Performance
- Behind the Scenes
- Awards
- Audience
- Other

To add more, edit:

- `src/components/admin/gallery/ImageUploader.tsx` (line 14)
- `src/components/admin/gallery/ImageManager.tsx` (line 23)
- `src/components/gallery/ImageGrid.tsx` (line 34)

## 📱 Navigation

### Public Users:

- Navbar: "Gallery" link visible to all

### Authenticated Admins:

- Navbar: "Dashboard" + "Gallery" links (desktop)
- Mobile menu: "Admin Dashboard" + "Manage Gallery" links

## ⚠️ Important Notes

1. **Category Naming:** Spaces in categories are converted to hyphens

   - "Behind the Scenes" → "2025-Behind-the-Scenes"

2. **Filtering:** Both admin and public views filter by festival year prefix

3. **No Authentication:** Backend endpoints are public (based on your docs)

4. **File Limits:**

   - Max 10MB per image
   - Max 10 images per upload
   - Formats: JPG, JPEG, PNG, GIF, WEBP

5. **S3 Storage:** All images stored in `festival-gallery/` folder

## 🐛 Troubleshooting

### "No images found"

- Check if backend is running
- Verify API_BASE_URL is correct
- Check browser console for CORS errors
- Verify images exist with correct category prefix

### Upload fails

- Check file size (< 10MB)
- Check file format
- Check backend logs
- Verify S3 credentials

### Images don't display

- Check S3 bucket permissions (public read)
- Verify URL in browser
- Check CORS settings

## 📚 Documentation

- **Backend API:** See your provided `Festival Gallery API Documentation`
- **Implementation:** See `GALLERY_IMPLEMENTATION.md`
- **Original Plan:** See `GALLERY_API_DOCUMENTATION.md` (old version)

## ✅ Ready to Use!

Everything is integrated and ready. Just:

1. Ensure backend is running
2. Visit `/gallery` or `/admin/gallery`
3. Start uploading and viewing images!

---

**Questions?** Check `GALLERY_IMPLEMENTATION.md` for detailed technical info.
