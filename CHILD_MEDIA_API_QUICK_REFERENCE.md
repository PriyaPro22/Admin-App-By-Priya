# Child Category Media API - Quick Reference

## Available Functions

### 1. 📥 Fetch All Media
```typescript
fetchChildCategoryMedia(mainId: string, subId?: string): Promise<any>
```
**Endpoints:**
- Root: `GET /main/:mainId/child-category/media`
- Sub: `GET /main/:mainId/sub/:subId/child-category/media`

---

### 2. ➕ Add New Media
```typescript
addChildCategoryMedia(
  mainId: string,
  type: "images" | "videos",
  payload: {
    imageTitle?: string;
    videoTitle?: string;
    url: string;
    visibility?: boolean;
  },
  subId?: string
): Promise<void>
```
**Endpoints:**
- Root: `POST /main/:mainId/child-category/media`
- Sub: `POST /main/:mainId/sub/:subId/child-category/media`

**Payload Format:**
```json
{
  "childCatMedia": {
    "images": {
      "imageTitle": "Title",
      "url": "https://...",
      "visibility": true
    }
  }
}
```

---

### 3. ✏️ Update Media By Index
```typescript
updateChildCategoryMediaByIndex(
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
): Promise<void>
```
**Endpoints:**
- Root: `PUT /main/:mainId/child-category/media/:type/:index`
- Sub: `PUT /main/:mainId/sub/:subId/child-category/media/:type/:index`

**Payload:** Partial update allowed (send only fields to update)

---

### 4. 🗑️ Delete Media By Index
```typescript
deleteChildCategoryMediaByIndex(
  mainId: string,
  type: "images" | "videos",
  index: number,
  subId?: string
): Promise<void>
```
**Endpoints:**
- Root: `DELETE /main/:mainId/child-category/media/:type/:index`
- Sub: `DELETE /main/:mainId/sub/:subId/child-category/media/:type/:index`

---

## Quick Examples

### Fetch Media
```typescript
const media = await fetchChildCategoryMedia("main123");
// Returns: { images: { 0: {...}, 1: {...} }, videos: { 0: {...} } }
```

### Add Image
```typescript
await addChildCategoryMedia("main123", "images", {
  imageTitle: "Product Photo",
  url: "https://example.com/photo.jpg",
  visibility: true
});
```

### Add Video
```typescript
await addChildCategoryMedia("main123", "videos", {
  videoTitle: "Demo Video",
  url: "https://example.com/video.mp4",
  visibility: true
});
```

### Update Image Title (Index 0)
```typescript
await updateChildCategoryMediaByIndex("main123", "images", 0, {
  imageTitle: "Updated Title"
});
```

### Hide Video (Index 1)
```typescript
await updateChildCategoryMediaByIndex("main123", "videos", 1, {
  visibility: false
});
```

### Delete Image (Index 2)
```typescript
await deleteChildCategoryMediaByIndex("main123", "images", 2);
```

### With Sub-Category
```typescript
// Add under sub-category
await addChildCategoryMedia("main123", "images", {
  imageTitle: "Sub Image",
  url: "https://example.com/sub.jpg",
  visibility: true
}, "sub456");

// Update under sub-category
await updateChildCategoryMediaByIndex("main123", "images", 0, {
  visibility: false
}, "sub456");

// Delete under sub-category
await deleteChildCategoryMediaByIndex("main123", "videos", 1, "sub456");
```

---

## Important Notes

✅ **DO:**
- Let backend auto-generate indices
- Use `childCatMedia` wrapper for POST requests
- Specify type as "images" or "videos"
- Refresh data after mutations

❌ **DON'T:**
- Send index in POST payload
- Use `childCategoryKey` parameter
- Mix up image/video field names

---

## Data Structure

Backend stores media in this format:
```json
{
  "childCatMedia": {
    "name": "childCat",
    "visibility": true,
    "images": {
      "name": "images",
      "visibility": true,
      "0": { "imageTitle": "...", "url": "...", "visibility": true },
      "1": { "imageTitle": "...", "url": "...", "visibility": true }
    },
    "videos": {
      "name": "videos",
      "visibility": true,
      "0": { "videoTitle": "...", "url": "...", "visibility": true }
    }
  }
}
```

---

## Implementation Files

- **Context:** `app/context/CategoryContext.tsx` (Lines 1615-1720)
- **Form:** `app/components/forms/ChildCategoryV2Form.tsx`
- **Full Docs:** `CHILD_CATEGORY_MEDIA_API_GUIDE.md`
