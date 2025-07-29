# Materials API Testing

This document provides evidence of successful testing for the Materials API endpoints.

---

## Base URL

```
http://localhost:5000/api/materials
```

---

## 1. Upload Material (Teacher only)

```http
POST /api/materials
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form Data:
- title: Testing111
- description: Demo111
- fileType: pdf
- batchIds: ["6883b777a827a99f568076ff"]
- courseId: 6883b71fa827a99f568076fa
- file: <uploaded file>
```

**Response:**

```json
{
  "message": "Material uploaded successfully",
  "material": {
    "title": "Testing111",
    "description": "Demo111",
    "fileUrl": "https://res.cloudinary.com/dbqz9nzv6/image/upload/v1753599818/srupccaahqvww3ahq7bn.pdf",
    "fileType": "pdf",
    "uploadedBy": "6882587700e60c163fc844d1",
    "batchIds": [
      "6883b777a827a99f568076ff"
    ],
    "courseId": "6883b71fa827a99f568076fa",
    "_id": "6885cf49b675af223f16cb27",
    "viewedBy": [],
    "createdAt": "2025-07-27T07:03:38.004Z",
    "updatedAt": "2025-07-27T07:03:38.004Z",
    "__v": 0
  }
}
```

---

## 2. Get All Materials (Teacher/Admin)

```http
GET /api/materials
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "_id": "6885cf49b675af223f16cb27",
    "title": "Testing111",
    "description": "Demo111",
    "fileUrl": "https://res.cloudinary.com/dbqz9nzv6/image/upload/v1753599818/srupccaahqvww3ahq7bn.pdf",
    "fileType": "pdf",
    "uploadedBy": {
      "_id": "6882587700e60c163fc844d1",
      "name": "teacher",
      "role": "teacher",
      "isLocked": false,
      "displayName": "teacher (undefined)",
      "id": "6882587700e60c163fc844d1"
    },
    "batchIds": [
      {
        "_id": "6883b777a827a99f568076ff",
        "name": "Batch C - Chemistry"
      }
    ],
    "courseId": {
      "_id": "6883b71fa827a99f568076fa",
      "name": "Chemistry 101"
    },
    "viewedBy": [],
    "createdAt": "2025-07-27T07:03:38.004Z",
    "updatedAt": "2025-07-27T07:03:38.004Z",
    "__v": 0
  },
  {
    "_id": "6885c6c6742943205e65b317",
    "title": "Testing",
    "description": "Demo",
    "fileUrl": "https://res.cloudinary.com/dbqz9nzv6/image/upload/v1753597639/iztpzutya7zwfjkmnxvm.pdf",
    "fileType": "pdf",
    "uploadedBy": {
      "_id": "6882587700e60c163fc844d1",
      "name": "teacher",
      "role": "teacher",
      "isLocked": false,
      "displayName": "teacher (undefined)",
      "id": "6882587700e60c163fc844d1"
    },
    "batchIds": [
      {
        "_id": "6882445cfdb9d5ce0bc92450",
        "name": "Batch A1"
      }
    ],
    "courseId": {
      "_id": "68820d581285aa50dec859f8",
      "name": "Computer Science Engineering"
    },
    "viewedBy": [
      {
        "user": "6882580200e60c163fc844c7",
        "viewedAt": "2025-07-27T06:56:10.075Z",
        "_id": "6885cd8ab675af223f16cb16"
      }
    ],
    "createdAt": "2025-07-27T06:27:18.977Z",
    "updatedAt": "2025-07-27T06:56:10.083Z",
    "__v": 1
  }
]
```

---

## 3. Get Materials for Student’s Batch

```http
GET /api/materials/student
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "_id": "6885cf49b675af223f16cb27",
    "title": "Testing111",
    "description": "Demo111",
    "fileUrl": "https://res.cloudinary.com/dbqz9nzv6/image/upload/v1753599818/srupccaahqvww3ahq7bn.pdf",
    "fileType": "pdf",
    "uploadedBy": {
      "_id": "6882587700e60c163fc844d1",
      "name": "teacher",
      "role": "teacher",
      "isLocked": false,
      "displayName": "teacher (undefined)",
      "id": "6882587700e60c163fc844d1"
    },
    "batchIds": [
      "6883b777a827a99f568076ff"
    ],
    "courseId": {
      "_id": "6883b71fa827a99f568076fa",
      "name": "Chemistry 101"
    },
    "viewedBy": [],
    "createdAt": "2025-07-27T07:03:38.004Z",
    "updatedAt": "2025-07-27T07:03:38.004Z",
    "__v": 0
  }
]
```

---

## 4. Search Materials by Title (All Roles)

```http
GET /api/materials/search?query=Testing
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "_id": "6885cf49b675af223f16cb27",
    "title": "Testing111",
    "description": "Demo111",
    "fileUrl": "https://res.cloudinary.com/dbqz9nzv6/image/upload/v1753599818/srupccaahqvww3ahq7bn.pdf",
    "fileType": "pdf",
    "uploadedBy": {
      "_id": "6882587700e60c163fc844d1",
      "name": "teacher",
      "isLocked": false,
      "displayName": "teacher (undefined)",
      "id": "6882587700e60c163fc844d1"
    },
    "batchIds": [
      "6883b777a827a99f568076ff"
    ],
    "courseId": {
      "_id": "6883b71fa827a99f568076fa",
      "name": "Chemistry 101"
    },
    "viewedBy": [],
    "createdAt": "2025-07-27T07:03:38.004Z",
    "updatedAt": "2025-07-27T07:03:38.004Z",
    "__v": 0
  }
]
```

---

## 5. Track Student Material View

```http
POST /api/materials/view/6885cf49b675af223f16cb27
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Material view recorded",
  "materialId": "6885cf49b675af223f16cb27"
}
```