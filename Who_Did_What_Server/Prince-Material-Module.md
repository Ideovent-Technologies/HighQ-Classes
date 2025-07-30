```md
# 📁 Module 7: Resource Sharing Platform

**Contributor**: Prince  
**Project**: HighQ School Manager  
---

## 📌 Overview

The Resource Sharing Platform allows students and teachers to **upload**, **browse**, **search**, and **download** study materials such as PDFs, links, images, and videos. The system also includes **access control based on course and batch**, ensuring that students only view materials relevant to their studies.

---

## 🧠 Responsibilities

### ✅ Frontend
- Designed and developed:
  - Study Materials display page (`StudyMaterials.tsx`)
  - Upload Materials form (`UploadMaterials.tsx`)
  - Resource browsing interface (`ResourceBrowser.tsx`)
- Implemented:
  - Dynamic form with file preview
  - Resource filtering by course and batch
  - Protected views (based on user type)

### ✅ Backend
- Created:
  - Mongoose model: `Material.js`
  - Controller: `resourceController.js`
  - File storage service using Cloudinary: `cloudinaryService.js`
- Developed:
  - Secure API routes for file upload, retrieval, and search
  - Batch- and course-based access control logic
  - Material search with regex and indexing

---

## 📁 Directory Structure

```

src/
├─ pages/dashboard/
│  ├─ StudyMaterials.tsx
│  └─ UploadMaterials.tsx
├─ components/dashboard/
│  └─ ResourceBrowser.tsx

server/
├─ models/
│  └─ Material.js
├─ controllers/
│  └─ resourceController.js
├─ services/
│  └─ cloudinaryService.js
├─ routes/
│  └─ resourceRoutes.js

````

---

## 🧾 Mongoose Schema: `Material.js`

```js
const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    batchIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Batch' }],
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Material', materialSchema);
````

---

## 🔧 Controller: `resourceController.js`

* **uploadMaterial:** Upload file to Cloudinary and save metadata in MongoDB
* **getAllMaterials:** Return all materials (for admin/teacher)
* **getMaterialsByBatch:** Fetch materials for student’s batch
* **searchMaterials:** Filter materials using keywords
* **deleteMaterial:** Allow admin to delete any material

> Full implementation is available in `server/controllers/resourceController.js`

---

## ☁️ File Storage: `cloudinaryService.js`

Handles file upload to Cloudinary. Supports all file types (`pdf`, `mp4`, `png`, etc.)

```js
cloudinary.uploader.upload(filePath, {
  resource_type: 'auto',
  folder: 'study-materials',
});
```

---

## 🔐 Access Control

* Students can only see materials assigned to their:

  * ✅ Batch
  * ✅ Course
* Teachers/Admin can:

  * Upload material for any batch/course
  * View all uploaded resources
  * Delete resources (Admin only)

---

## 🔎 Search Functionality

* Search is implemented using:

  * Title
  * Description
  * File type
* API: `/api/resources/search?query=pdf+math`

---

## 📈 Analytics (Planned Feature)

> ⚙️ Upcoming: Material view count, top resources, and most active contributors.

---

## ✅ API Endpoints (`resourceRoutes.js`)

| Method | Endpoint                | Description                       |
| ------ | ----------------------- | --------------------------------- |
| POST   | `/api/resources/upload` | Upload a new study material       |
| GET    | `/api/resources`        | Get all materials (admin/teacher) |
| GET    | `/api/resources/batch`  | Get materials by user’s batch     |
| GET    | `/api/resources/search` | Search materials by keyword       |
| DELETE | `/api/resources/:id`    | Delete material (admin only)      |

---

## 🧪 Testing & Validation

* ✅ Upload tested with PDF, DOCX, MP4, and images
* ✅ Download tested with direct Cloudinary links
* ✅ Student view validated for batch/course access
* ✅ Manual test cases documented in test\_logs.txt

---

## 🌐 Future Improvements

* [ ] Add pagination and lazy loading for large material lists
* [ ] Add tags/categories for better filtering
* [ ] Implement full analytics dashboard
* [ ] Drag-and-drop upload support
* [ ] Multi-file upload with progress bar

---

## 📌 Conclusion

This module empowers students and teachers with a secure, intuitive platform to share and access study materials. It balances **performance**, **security**, and **usability** to improve the overall learning experience.