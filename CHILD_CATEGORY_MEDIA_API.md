# Child Category Media API Implementation

## Overview
This document describes the implementation of the Child Category Media API according to the provided documentation. The API manages Images and Videos under `childCategory` at root level and under `subCategory`.

## Base Configuration
- **Base URL**: `https://api.bijliwalaaya.in`
- **Base Path**: `/api/product-listing`
- **Authentication**: `serviceAuth` (auth middleware)
- **Content-Type**: `application/json` or `multipart/form-data`

## Key Features
1. **Auto-Generated Indices**: Backend automatically generates indices (0, 1, 2, ...) - Client must NOT send index
2. **Dual Upload Support**: 
   - File uploads (multer) - for uploaded images/videos
   - Direct URLs - for YouTube links or external media
3. **Independent Media Types**: Images and Videos are handled independently
4. **Non-Destructive Create**: Existing data is never overwritten on CREATE

## API Endpoints

### 1. Direct Child Category Media APIs (Root Level)

#### Add Image or Video
```
POST /main/:mainId/child-category/media
```

**Request Body for Image (URL)**:
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

**Request Body for Video (URL)**:
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

**Request Body for Image (File Upload)**:
```
FormData:
- childCatMedia[images][imageUri]: <File>
- childCatMedia[images][imageTitle]: "Installation Image 1"
- childCatMedia[images][visibility]: "true"
```

**Request Body for Video (File Upload)**:
```
FormData:
- childCatMedia[videos][videoUri]: <File>
- childCatMedia[videos][videoTitle]: "Installation Video 1"
- childCatMedia[videos][visibility]: "true"
```

#### Get All Media
```
GET /main/:mainId/child-category/media
```

**Success Response (200)**:
```json
{
  "success": true,
  "data": {
    "name": "childCat",
    "visibility": true,
    "images": {
      "name": "images",
      "visibility": true,
      "0": {
        "imageTitle": "Installation Image 1",
        "url": "https://...",
        "visibility": true
      },
      "1": { "..." }
    },
    "videos": {
      "name": "videos",
      "visibility": true,
      "0": {
        "videoTitle": "Installation Video 1",
        "url": "https://...",
        "visibility": true
      }
    }
  }
}
```

#### Update Media By Index
```
PUT /main/:mainId/child-category/media/:type/:index
```
- **type**: `images` | `videos`
- **index**: number (0, 1, 2, ...)
- **Partial update allowed**

**Request Body**:
```json
{
  "imageTitle": "Updated Image",
  "visibility": false
}
```

#### Delete Media By Index
```
DELETE /main/:mainId/child-category/media/:type/:index
```

### 2. Child Category Media Under Sub Category

#### Add Image or Video Under Sub
```
POST /main/:mainId/sub/:subId/child-category/media
```
- Same body format as Direct Child API

#### Get All Media Under Sub
```
GET /main/:mainId/sub/:subId/child-category/media
```

#### Update Media Under Sub
```
PUT /main/:mainId/sub/:subId/child-category/media/:type/:index
```

#### Delete Media Under Sub
```
DELETE /main/:mainId/sub/:subId/child-category/media/:type/:index
```

## Final Stored Data Structure

```javascript
childCategory: {
  childCatMedia: {
    name: "childCat",
    visibility: true,
    images: {
      name: "images",
      visibility: true,
      0: {
        imageTitle: "Installation Front View",
        url: "https://cloudinary.com/...",  // Multer URL or Direct URL
        visibility: true
      },
      1: {
        imageTitle: "Installation Side View",
        url: "https://picsum.photos/200/300",  // Direct URL
        visibility: true
      }
    },
    videos: {
      name: "videos",
      visibility: true,
      0: {
        videoTitle: "Installation Demo",
        url: "https://youtube.com/watch?v=...",  // YouTube URL
        visibility: true
      },
      1: {
        videoTitle: "Product Overview",
        url: "https://cloudinary.com/...",  // Multer URL from file upload
        visibility: true
      }
    }
  }
}
```

## Implementation Details

### CategoryContext.tsx

The `addChildCategoryMedia` function handles both file uploads and direct URLs:

```typescript
const addChildCategoryMedia = async (
  mainId: string,
  type: "images" | "videos",
  item: {
    imageTitle?: string;
    videoTitle?: string;
    url?: string;
    file?: File;  // For file uploads
    visibility?: boolean;
  },
  subId?: string
) => {
  // Build URL
  const url = subId
    ? `/main/${mainId}/sub/${subId}/child-category/media`
    : `/main/${mainId}/child-category/media`;

  try {
    // CASE 1: FILE UPLOAD (multer)
    if (item.file instanceof File) {
      const formData = new FormData();
      
      if (type === "images") {
        formData.append(`childCatMedia[images][imageUri]`, item.file);
        formData.append(`childCatMedia[images][imageTitle]`, item.imageTitle || "");
        formData.append(`childCatMedia[images][visibility]`, String(item.visibility ?? true));
      } else {
        formData.append(`childCatMedia[videos][videoUri]`, item.file);
        formData.append(`childCatMedia[videos][videoTitle]`, item.videoTitle || "");
        formData.append(`childCatMedia[videos][visibility]`, String(item.visibility ?? true));
      }

      await axios.post(`${BASE_URL}${url}`, formData, {
        headers: getAuthHeaders(true)  // isFormData = true
      });
    } 
    // CASE 2: DIRECT URL
    else if (item.url) {
      const body = {
        childCatMedia: {
          [type]: type === "images" 
            ? {
                imageTitle: item.imageTitle || "",
                url: item.url,
                visibility: item.visibility ?? true
              }
            : {
                videoTitle: item.videoTitle || "",
                url: item.url,
                visibility: item.visibility ?? true
              }
        }
      };

      await api.post(url, body);
    }
  } catch (error) {
    console.error("❌ POST FAILED:", error);
    throw error;
  }

  // Refresh data
  await fetchChildCategoryMedia(mainId, subId);
};
```

### ChildCategoryV2Form.tsx

The form component allows users to:
1. Select Main Category
2. Optionally select Sub Category
3. Add/Edit/Delete Images with:
   - Image Title
   - Image URL (direct link)
   - Visibility toggle
4. Add/Edit/Delete Videos with:
   - Video Title
   - Video URL (YouTube or direct link)
   - Visibility toggle

**Usage Example**:
```typescript
// For URL
await addChildCategoryMedia(
  mainId,
  "images",
  {
    imageTitle: "Product Front View",
    url: "https://picsum.photos/200/300",
    visibility: true
  }
);

// For File Upload
await addChildCategoryMedia(
  mainId,
  "videos",
  {
    videoTitle: "Demo Video",
    file: videoFile,  // File object from input
    visibility: true
  }
);
```

## Important Notes

1. **Index Auto-Generation**: Never send an index when creating media. The backend automatically assigns indices starting from 0.

2. **URL Field**: The `url` field stores:
   - Multer URLs (from file uploads) - e.g., `https://cloudinary.com/...`
   - Direct URLs (YouTube, external links) - e.g., `https://youtube.com/watch?v=...`

3. **Content-Type Handling**:
   - File uploads: `multipart/form-data` (auto-set by browser)
   - Direct URLs: `application/json`

4. **Visibility**: All items have individual visibility toggles. Section-level visibility is also available.

5. **Non-Destructive**: Each API call creates a NEW indexed entry. To update existing entries, use the UPDATE endpoint with the specific index.

6. **Data Refresh**: After each successful POST, the client automatically refreshes the data to display the updated list with backend-generated indices.

## Testing

To test the implementation:

1. **Test Direct URL Upload**:
   ```javascript
   await addChildCategoryMedia(
     "mainCategoryId123",
     "images",
     {
       imageTitle: "Test Image",
       url: "https://picsum.photos/200/300",
       visibility: true
     }
   );
   ```

2. **Test File Upload** (in browser):
   ```javascript
   const fileInput = document.querySelector('input[type="file"]');
   const file = fileInput.files[0];
   
   await addChildCategoryMedia(
     "mainCategoryId123",
     "videos",
     {
       videoTitle: "Test Video",
       file: file,
       visibility: true
     }
   );
   ```

3. **Verify in MongoDB**: Check that data is stored with auto-generated indices (0, 1, 2, ...)
