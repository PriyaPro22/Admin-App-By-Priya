# Child Category Media API Integration - COMPLETE GUIDE

## Overview
This guide documents the **correctly implemented** child category media API integration following the backend API documentation for images and videos.

## API Documentation Reference

### Base URL
```
https://api.bijliwalaaya.in/api/product-listing
```

### Authentication
- Header: `x-api-token: super_secure_token`
- Content-Type: `application/json` or `multipart/form-data` (for file uploads)

---

## API Endpoints

### 1. Direct Child Category Media (Root Level)

#### 1.1 Add Image or Video
**POST** `/main/:mainId/child-category/media`

**Request Body for Image:**
```json
{
  "childCatMedia": {
    "images": {
      "imageTitle": "Installation Image 1",
      "url": "https://example.com/images/install-1.jpg",
      "visibility": true
    }
  }
}
```

**Request Body for Video:**
```json
{
  "childCatMedia": {
    "videos": {
      "videoTitle": "Installation Video 1",
      "url": "https://example.com/videos/install-1.mp4",
      "visibility": true
    }
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "name": "childCat",
    "visibility": true,
    "images": {
      "0": {
        "imageTitle": "Installation Image 1",
        "url": "https://example.com/images/install-1.jpg",
        "visibility": true
      }
    },
    "videos": {
      "0": {
        "videoTitle": "Installation Video 1",
        "url": "https://example.com/videos/install-1.mp4",
        "visibility": true
      }
    }
  }
}
```

#### 1.2 Get All Media
**GET** `/main/:mainId/child-category/media`

Returns all images and videos for the specified main category.

#### 1.3 Update Media By Index
**PUT** `/main/:mainId/child-category/media/:type/:index`

- **Path Params:**
  - `type`: `"images"` or `"videos"`
  - `index`: numeric index (0, 1, 2, ...)

**Request Body (Partial Update):**
```json
{
  "imageTitle": "Updated Image",
  "visibility": false
}
```

#### 1.4 Delete Media By Index
**DELETE** `/main/:mainId/child-category/media/:type/:index`

---

### 2. Child Category Media Under Sub Category

Same endpoints but with sub category ID in the path:

#### 2.1 Add Image/Video
**POST** `/main/:mainId/sub/:subId/child-category/media`

#### 2.2 Get All Media
**GET** `/main/:mainId/sub/:subId/child-category/media`

#### 2.3 Update Media
**PUT** `/main/:mainId/sub/:subId/child-category/media/:type/:index`

#### 2.4 Delete Media
**DELETE** `/main/:mainId/sub/:subId/child-category/media/:type/:index`

---

## Implementation Details

### Frontend Implementation

#### File: `app/context/CategoryContext.tsx`

**Fetch Media Function:**
```typescript
const fetchChildCategoryMedia = async (
  mainId: string,
  subId?: string
) => {
  const url = subId
    ? `/api/product-listing/main/${mainId}/sub/${subId}/child-category/media`
    : `/api/product-listing/main/${mainId}/child-category/media`;

  const res = await api.get(url);
  const data = res.data?.data || null;
  
  setChildCategoryMedia(data);
  return data;
};
```

**Add Media Function:**
```typescript
const addChildCategoryMedia = async (
  mainId: string,
  type: "images" | "videos",
  payload: {
    imageTitle?: string;
    videoTitle?: string;
    url: string;
    visibility?: boolean;
  },
  subId?: string
) => {
  const url = subId
    ? `/api/product-listing/main/${mainId}/sub/${subId}/child-category/media`
    : `/api/product-listing/main/${mainId}/child-category/media`;

  const body = {
    childCatMedia: {
      [type]: {
        ...payload,
        visibility: payload.visibility ?? true
      }
    }
  };

  await api.post(url, body);
  
  // Refresh data after adding
  await fetchChildCategoryMedia(mainId, subId);
};
```

**Update Media By Index Function:**
```typescript
const updateChildCategoryMediaByIndex = async (
  mainId: string,
  type: "images" | "videos",
  index: number,
  payload: {
    imageTitle?: string;
    videoTitle?: string;
    url?: string;
    visibility?: boolean;
  },
  subId?: string
) => {
  const url = subId
    ? `/api/product-listing/main/${mainId}/sub/${subId}/child-category/media/${type}/${index}`
    : `/api/product-listing/main/${mainId}/child-category/media/${type}/${index}`;

  await api.put(url, payload);
  
  // Refresh data after update
  await fetchChildCategoryMedia(mainId, subId);
};
```

**Delete Media By Index Function:**
```typescript
const deleteChildCategoryMediaByIndex = async (
  mainId: string,
  type: "images" | "videos",
  index: number,
  subId?: string
) => {
  const url = subId
    ? `/api/product-listing/main/${mainId}/sub/${subId}/child-category/media/${type}/${index}`
    : `/api/product-listing/main/${mainId}/child-category/media/${type}/${index}`;

  await api.delete(url);
  
  // Refresh data after delete
  await fetchChildCategoryMedia(mainId, subId);
};
```

#### File: `app/components/forms/ChildCategoryV2Form.tsx`

**Key Features:**
1. **Load Media**: Fetches existing media from backend
2. **Add Media Items**: Allows adding multiple images/videos
3. **Save**: Sends each media item individually to the backend
4. **Delete**: Removes all media for a category

**Important Notes:**
- ❌ **DO NOT send index** - Backend auto-generates indices (0, 1, 2, ...)
- ❌ **DO NOT use childCategoryKey** - Not required by this API
- ✅ **Multer is used** for file uploads on the backend
- ✅ **Links section removed** - API only supports images and videos

---

## Data Structure

### Backend Storage Format
```json
{
  "childCategory": {
    "childCatMedia": {
      "name": "childCat",
      "visibility": true,
      "images": {
        "name": "images",
        "visibility": true,
        "0": {
          "imageTitle": "Front View",
          "url": "https://example.com/image1.jpg",
          "visibility": true
        },
        "1": {
          "imageTitle": "Side View",
          "url": "https://example.com/image2.jpg",
          "visibility": true
        }
      },
      "videos": {
        "name": "videos",
        "visibility": true,
        "0": {
          "videoTitle": "Demo Video",
          "url": "https://example.com/video1.mp4",
          "visibility": true
        }
      }
    }
  }
}
```

---

## Common Rules

1. ✅ **Authentication Required**: `serviceAuth` middleware
2. ✅ **Content-Type**: `application/json` or `multipart/form-data`
3. ✅ **Auto-Generated Index**: Backend generates index on create
4. ✅ **Independent Media Types**: Images and Videos are separate
5. ✅ **No Overwrite on CREATE**: Existing data is preserved

---

## API Usage Examples

### Example 1: Add New Image
```typescript
await addChildCategoryMedia(
  "mainCategoryId123",
  "images",
  {
    imageTitle: "Product Front View",
    url: "https://example.com/product-front.jpg",
    visibility: true
  }
);
```

### Example 2: Add New Video
```typescript
await addChildCategoryMedia(
  "mainCategoryId123",
  "videos",
  {
    videoTitle: "Installation Tutorial",
    url: "https://example.com/tutorial.mp4",
    visibility: true
  }
);
```

### Example 3: Update Existing Image (Index 0)
```typescript
await updateChildCategoryMediaByIndex(
  "mainCategoryId123",
  "images",
  0,
  {
    imageTitle: "Updated Product View",
    visibility: false
  }
);
```

### Example 4: Update Video URL (Index 1)
```typescript
await updateChildCategoryMediaByIndex(
  "mainCategoryId123",
  "videos",
  1,
  {
    url: "https://example.com/new-video.mp4"
  }
);
```

### Example 5: Delete Image (Index 2)
```typescript
await deleteChildCategoryMediaByIndex(
  "mainCategoryId123",
  "images",
  2
);
```

### Example 6: With Sub Category
```typescript
// Add image under sub category
await addChildCategoryMedia(
  "mainCategoryId123",
  "images",
  {
    imageTitle: "Sub Category Image",
    url: "https://example.com/sub-image.jpg",
    visibility: true
  },
  "subCategoryId456" // Sub category ID
);

// Update under sub category
await updateChildCategoryMediaByIndex(
  "mainCategoryId123",
  "images",
  0,
  { visibility: false },
  "subCategoryId456"
);

// Delete under sub category
await deleteChildCategoryMediaByIndex(
  "mainCategoryId123",
  "videos",
  1,
  "subCategoryId456"
);
```

---

## Testing Guide

### 1. Add Images
1. Select Main Category
2. Click "Load" to fetch existing media
3. Click "Add Image" button
4. Enter image title and URL
5. Click "Save Changes"

### 2. Add Videos
1. Select Main Category
2. Click "Load" to fetch existing media
3. Click "Add Video" button
4. Enter video title and URL
5. Click "Save Changes"

### 3. Verify in Backend
- Images should be stored as `childCatMedia.images.0`, `childCatMedia.images.1`, etc.
- Videos should be stored as `childCatMedia.videos.0`, `childCatMedia.videos.1`, etc.
- Each item should have `imageTitle`/`videoTitle`, `url`, and `visibility` fields

---

## Troubleshooting

### Issue: Media not saving
**Solution**: 
- Check that mainId is selected
- Verify URL field is filled
- Check browser console for API errors

### Issue: Incorrect data structure
**Solution**:
- Ensure you're NOT sending index in payload
- Verify childCatMedia wrapper is used
- Check that type ("images" or "videos") matches payload

### Issue: File uploads not working
**Solution**:
- Backend uses Multer for file handling
- Ensure proper FormData for file uploads
- For URL-based media, use JSON payload as documented

---

## File Upload Support (Future Enhancement)

While the current implementation uses URL-based media storage, the backend supports file uploads via Multer. To add file upload support:

1. Modify the form to accept file inputs
2. Create FormData object
3. Append files to FormData
4. Send with Content-Type: multipart/form-data

**Example:**
```typescript
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('imageTitle', title);
formData.append('visibility', 'true');

await api.post(url, formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});
```

---

## Summary of Changes

### ✅ Fixed Issues
1. Removed unsupported "Links" section from UI
2. Added missing `handleDelete` function
3. Added missing `fetchChildCategoryMedia` export
4. Fixed BASE_URL circular reference
5. Updated CategoryContext interface
6. Proper payload structure following API docs
7. ✨ **NEW**: Added `updateChildCategoryMediaByIndex` for editing individual media
8. ✨ **NEW**: Added `deleteChildCategoryMediaByIndex` for removing individual media

### ✅ Complete API Integration
- ✅ **GET** - Fetch all media (`fetchChildCategoryMedia`)
- ✅ **POST** - Add new media (`addChildCategoryMedia`)
- ✅ **PUT** - Update media by index (`updateChildCategoryMediaByIndex`)
- ✅ **DELETE** - Delete media by index (`deleteChildCategoryMediaByIndex`)
- ✅ Correctly wraps payload in `childCatMedia` object
- ✅ Uses proper endpoint structure
- ✅ Implements auto-index handling
- ✅ Separates images and videos correctly
- ✅ Supports both root level and sub-category paths

### ✅ UI Improvements
- Clean interface for images and videos
- Preview functionality for images
- Video link testing
- Individual visibility toggles
- Section-level visibility toggles

---

## Contact & Support

For backend API questions, refer to the original API documentation.
For frontend implementation questions, check the implementation files:
- `app/context/CategoryContext.tsx` (Lines 1615-1665)
- `app/components/forms/ChildCategoryV2Form.tsx`
