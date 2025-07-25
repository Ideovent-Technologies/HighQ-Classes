# HighQ Classes Backend API Documentation

## Overview

The HighQ Classes backend is a Node.js/Express API that provides comprehensive school management functionality including authentication, user management, course management, fee tracking, and more.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected routes require a JWT token. The token can be sent via:

-   **Cookie**: `authToken` (recommended)
-   **Header**: `Authorization: Bearer <token>`

## User Roles

-   **Admin**: Full system access
-   **Teacher**: Access to assigned courses and students
-   **Student**: Access to own profile and enrolled courses

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "mobile": "1234567890",
  "role": "student" // optional, defaults to "student"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Get Current User Profile

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/auth/update-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "mobile": "0987654321",
  "profilePicture": "https://example.com/picture.jpg"
}
```

#### Change Password

```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "NewPassword123"
}
```

#### Forgot Password

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "NewPassword123"
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Admin Routes (`/api/admin`) - Admin Only

#### Get Admin Dashboard

```http
GET /api/admin/dashboard
Authorization: Bearer <token>
```

#### Get All Students

```http
GET /api/admin/students
Authorization: Bearer <token>
```

#### Get All Teachers

```http
GET /api/admin/teachers
Authorization: Bearer <token>
```

#### Create User

```http
POST /api/admin/user
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "Password123",
  "mobile": "1234567890",
  "role": "teacher"
}
```

#### Update User

```http
PUT /api/admin/user/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "active"
}
```

#### Delete User

```http
DELETE /api/admin/user/:id
Authorization: Bearer <token>
```

### Student Routes (`/api/student`)

#### Get Student Profile

```http
GET /api/student/:id/profile
Authorization: Bearer <token>
```

#### Update Student Profile

```http
PATCH /api/student/:id/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "mobile": "9876543210"
}
```

#### Upload Profile Picture

```http
POST /api/student/:id/profile-picture
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form data:
- profilePic: <file>
```

### Teacher Routes (`/api/teacher`)

#### Get Teacher Dashboard

```http
GET /api/teacher/dashboard
Authorization: Bearer <token>
```

#### Get Teacher Profile

```http
GET /api/teacher/profile
Authorization: Bearer <token>
```

#### Update Teacher Profile

```http
PUT /api/teacher/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "password": "newpassword"
}
```

### Course Routes (`/api/course`) - Admin Only

#### Create Course

```http
POST /api/course
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Physics Advanced",
  "description": "Advanced physics course",
  "fee": 5000
}
```

#### Get All Courses

```http
GET /api/course
Authorization: Bearer <token>
```

#### Update Course

```http
PATCH /api/course/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Course Name",
  "fee": 6000
}
```

### Batch Routes (`/api/batch`)

#### Create Batch

```http
POST /api/batch
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Morning Batch",
  "course": "courseId",
  "teacher": "teacherId",
  "schedule": {
    "days": ["Monday", "Wednesday", "Friday"],
    "time": "09:00"
  }
}
```

#### Get All Batches

```http
GET /api/batch
Authorization: Bearer <token>
```

### Material Routes (`/api/materials`)

#### Upload Material (Teachers Only)

```http
POST /api/materials
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form data:
- title: "Chapter 1 Notes"
- description: "Introduction to Physics"
- batchId: "batchId"
- files: <file>
```

#### Get Materials for Student

```http
GET /api/materials/student
Authorization: Bearer <token>
```

#### Get All Materials (Admin/Teachers)

```http
GET /api/materials
Authorization: Bearer <token>
```

### Fee Routes (`/api/fee`) - Admin Only

#### Create Fee

```http
POST /api/fee
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "studentId",
  "courseId": "courseId",
  "amount": 5000,
  "dueDate": "2024-01-31",
  "feeType": "tuition"
}
```

#### Process Payment

```http
POST /api/fee/:id/pay
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 5000,
  "paymentMethod": "upi",
  "transactionId": "TXN123456"
}
```

#### Get Student Fees

```http
GET /api/fee/student/:studentId
Authorization: Bearer <token>
```

### Recording Routes (`/api/recordings`)

#### Upload Recording (Teachers/Admins)

```http
POST /api/recordings
Authorization: Bearer <token>
Content-Type: multipart/form-data

Form data:
- title: "Lecture 1"
- description: "Introduction to the topic"
- batchId: "batchId"
- recording: <video-file>
```

#### Get Student Recordings

```http
GET /api/recordings/student
Authorization: Bearer <token>
```

## Error Responses

All API endpoints return errors in the following format:

```json
{
    "success": false,
    "message": "Error description",
    "errors": [] // Optional array of validation errors
}
```

## Success Responses

All successful API responses follow this format:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {} // Optional response data
}
```

## Status Codes

-   `200` - OK
-   `201` - Created
-   `400` - Bad Request
-   `401` - Unauthorized
-   `403` - Forbidden
-   `404` - Not Found
-   `409` - Conflict
-   `413` - Payload Too Large
-   `429` - Too Many Requests
-   `500` - Internal Server Error

## Security Features

1. **JWT Authentication** with HTTP-only cookies
2. **Role-based Access Control** (RBAC)
3. **Rate Limiting** on sensitive endpoints
4. **Input Validation** using express-validator
5. **Password Hashing** with bcrypt
6. **XSS Protection** and NoSQL injection prevention
7. **Account Lockout** after failed login attempts
8. **Secure File Upload** with type and size validation

## Environment Variables

Required environment variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/highq-classes
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=HighQ Classes <no-reply@highqclasses.com>
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
FRONTEND_URL=http://localhost:5173
```

## File Upload Guidelines

### Supported File Types

-   **Images**: JPEG, PNG, GIF, WebP
-   **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
-   **Videos**: MP4, WebM, QuickTime
-   **Audio**: MP3, WAV
-   **Archives**: ZIP

### File Size Limits

-   **General files**: 100MB
-   **Profile pictures**: 5MB
-   **Video recordings**: 500MB

### Security Measures

-   File type validation based on MIME type
-   Automatic filename sanitization
-   Secure storage using Cloudinary
-   Path traversal protection
