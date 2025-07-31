# 📚 HighQ Classes - Complete API Documentation

## 🎯 API Overview

**Total Endpoints**: 68  
**Base URL**: `http://localhost:5000/api`  
**Authentication**: JWT Bearer Token  
**Response Format**: JSON

### 📊 Endpoint Distribution

| Module                | Endpoints | Description                                |
| --------------------- | --------- | ------------------------------------------ |
| Authentication        | 8         | Login, register, profile, password mgmt    |
| Student Management    | 5         | Profile, dashboard, CRUD operations        |
| Teacher Management    | 3         | Profile, dashboard, management             |
| Admin Management      | 7         | Admin dashboard, user management           |
| Course Management     | 6         | Course creation, enrollment, topics        |
| Batch Management      | 6         | Batch operations, student assignments      |
| Material Management   | 6         | Study material upload, access control      |
| Attendance Management | 3         | Mark attendance, view records              |
| Notice Management     | 5         | Create, update, view notices               |
| Schedule Management   | 2         | Teacher schedule management                |
| Fee Management        | 7         | Fee creation, payment processing           |
| Recording Management  | 9         | Video uploads, analytics, access control   |
| Assignment Management | 8         | Assignment lifecycle, submissions, grading |

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Authentication Endpoints](#authentication-endpoints)
4. [Student Management](#student-management)
5. [Teacher Management](#teacher-management)
6. [Admin Management](#admin-management)
7. [Course Management](#course-management)
8. [Batch Management](#batch-management)
9. [Material Management](#material-management)
10. [Attendance Management](#attendance-management)
11. [Notice Management](#notice-management)
12. [Schedule Management](#schedule-management)
13. [Fee Management](#fee-management)
14. [Recording Management](#recording-management)
15. [Assignment Management](#assignment-management)
16. [Error Handling](#error-handling)
17. [Response Format](#response-format)

---

## Overview

### Base URL

```
http://localhost:5000/api
```

### Authentication Method

-   **Type**: JWT (JSON Web Token)
-   **Storage**: HTTP-only cookies + Authorization header
-   **Header Format**: `Authorization: Bearer <token>`

### Common Headers

```json
{
    "Content-Type": "application/json",
    "Authorization": "Bearer <jwt_token>"
}
```

### User Roles

-   **Student**: Access to own profile, courses, materials, attendance
-   **Teacher**: Manage notices, schedules, attendance, materials
-   **Admin**: Full system access, user management

---

## Authentication

### Security Features

-   ✅ Independent model architecture (Student/Teacher/Admin)
-   ✅ JWT with HTTP-only cookies
-   ✅ Role-based authorization (RBAC)
-   ✅ Account lockout protection
-   ✅ Password reset with OTP
-   ✅ Cross-model uniqueness validation
-   ✅ XSS and NoSQL injection protection
-   ✅ Rate limiting

### Authentication Flow

1. User registers with role-specific data
2. Admin approves account (except admin accounts)
3. User logs in with email/password
4. System returns JWT token
5. Token used for subsequent requests

---

## Authentication Endpoints

### 1. Register User (Universal)

**POST** `/api/auth/register`

**Access**: Public

**Description**: Universal registration endpoint that creates users in different models based on role.

**Request Body**:

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "mobile": "1234567890",
    "role": "student|teacher|admin",

    // Student-specific fields (when role=student)
    "parentName": "Jane Doe",
    "parentContact": "9876543210",
    "grade": "10th",
    "schoolName": "ABC School",

    // Teacher-specific fields (when role=teacher)
    "qualification": "M.Sc Physics",
    "experience": 5,
    "specialization": "Physics",
    "department": "Science",

    // Admin-specific fields (when role=admin)
    "department": "IT",
    "designation": "System Administrator"
}
```

**Response**:

```json
{
    "success": true,
    "message": "Registration successful! Please wait for approval.",
    "data": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student",
        "status": "pending|active"
    }
}
```

### 2. Login

**POST** `/api/auth/login`

**Access**: Public

**Description**: Login with email/password. Searches across all models.

**Request Body**:

```json
{
    "email": "john@example.com",
    "password": "SecurePass123"
}
```

**Response**:

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "user": {
            "id": "user_id",
            "name": "John Doe",
            "email": "john@example.com",
            "role": "student",
            "status": "active"
        },
        "token": "jwt_token_here"
    }
}
```

### 3. Get Current User

**GET** `/api/auth/me`

**Access**: Private (All roles)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student",
        "status": "active"
        // ... other role-specific fields
    }
}
```

### 4. Logout

**POST** `/api/auth/logout`

**Access**: Private (All roles)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "Logged out successfully"
}
```

### 5. Update Profile

**PUT** `/api/auth/update-profile`

**Access**: Private (All roles)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "name": "Updated Name",
    "email": "newemail@example.com",
    "mobile": "9876543210"
}
```

### 6. Change Password

**PUT** `/api/auth/change-password`

**Access**: Private (All roles)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "oldPassword": "oldPassword123",
    "newPassword": "newPassword123"
}
```

### 7. Forgot Password

**POST** `/api/auth/forgot-password`

**Access**: Public

**Request Body**:

```json
{
    "email": "john@example.com"
}
```

**Response**:

```json
{
    "success": true,
    "message": "Password reset OTP sent to your email"
}
```

### 8. Reset Password

**POST** `/api/auth/reset-password`

**Access**: Public

**Request Body**:

```json
{
    "email": "john@example.com",
    "otp": "123456",
    "newPassword": "newPassword123"
}
```

---

## Student Management

### 1. Get Student Profile

**GET** `/api/student/:id/profile`

**Access**: Private (Student only - own profile)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "Profile retrieved successfully",
    "data": {
        "id": "student_id",
        "name": "John Doe",
        "email": "john@example.com",
        "mobile": "1234567890",
        "profilePicture": "url_to_image",
        "gender": "male",
        "dateOfBirth": "2000-01-01",
        "address": {
            "street": "123 Main St",
            "city": "City",
            "state": "State",
            "zipCode": "12345",
            "country": "Country"
        },
        "parentName": "Jane Doe",
        "parentContact": "9876543210",
        "grade": "10th",
        "schoolName": "ABC School",
        "batch": {
            "name": "Batch A",
            "startDate": "2025-01-01",
            "endDate": "2025-06-01"
        },
        "courses": [],
        "enrolledCourses": [],
        "totalCourses": 3,
        "activeCourses": 2,
        "attendance": {
            "percentage": 85,
            "totalClasses": 100,
            "attendedClasses": 85,
            "records": []
        },
        "examHistory": [],
        "status": "active",
        "role": "student",
        "lastLogin": "2025-01-01T10:00:00Z",
        "emailVerified": true,
        "preferences": {
            "notifications": {
                "email": true,
                "sms": false,
                "push": true
            },
            "theme": "light",
            "language": "en"
        },
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z"
    }
}
```

### 2. Update Student Profile

**PATCH** `/api/student/:id/profile`

**Access**: Private (Student only - own profile)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "name": "Updated Name",
    "email": "newemail@example.com",
    "mobile": "9876543210",
    "gender": "male",
    "dateOfBirth": "2000-01-01",
    "parentName": "Updated Parent",
    "parentContact": "5555555555",
    "address": {
        "street": "456 New St",
        "city": "New City",
        "state": "New State",
        "zipCode": "54321",
        "country": "Country"
    },
    "grade": "11th",
    "schoolName": "New School",
    "preferences": {
        "notifications": {
            "email": false,
            "sms": true,
            "push": true
        },
        "theme": "dark",
        "language": "en"
    }
}
```

**Response**:

```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        // Updated student object
    }
}
```

### 3. Upload Profile Picture

**POST** `/api/student/:id/profile-picture`

**Access**: Private (Student only - own profile)

**Headers**:

-   `Authorization: Bearer <token>`
-   `Content-Type: multipart/form-data`

**Request Body** (Form Data):

```
profilePic: <image_file>
```

**Response**:

```json
{
    "success": true,
    "message": "Profile picture updated successfully",
    "data": {
        "profilePicture": "https://cloudinary.com/image_url",
        "cloudinaryId": "cloudinary_public_id"
    }
}
```

### 4. Change Password

**PATCH** `/api/student/:id/change-password`

**Access**: Private (Student only - own profile)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "oldPassword": "oldPassword123",
    "newPassword": "newPassword123"
}
```

**Response**:

```json
{
    "success": true,
    "message": "Password updated successfully"
}
```

### 5. Get Student Dashboard

**GET** `/api/student/dashboard`

**Access**: Private (Student only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "profile": {
            "name": "John Doe",
            "profilePicture": "url",
            "status": "active"
        },
        "attendance": {
            "percentage": 85,
            "totalClasses": 100,
            "attendedClasses": 85
        },
        "courses": {
            "total": 3,
            "active": 2,
            "completed": 1
        },
        "upcomingClasses": [],
        "recentNotices": [],
        "assignments": {
            "pending": 2,
            "submitted": 5
        }
    }
}
```

---

## Teacher Management

### 1. Get Teacher Profile

**GET** `/api/teacher/profile`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "id": "teacher_id",
        "name": "Prof. Smith",
        "email": "smith@example.com",
        "mobile": "1234567890",
        "employeeId": "T123456",
        "qualification": "M.Sc Physics",
        "experience": 5,
        "specialization": "Physics",
        "department": "Science",
        "profilePicture": "url",
        "status": "active",
        "role": "teacher"
    }
}
```

### 2. Update Teacher Profile

**PUT** `/api/teacher/profile`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "name": "Updated Name",
    "email": "newemail@example.com",
    "mobile": "9876543210",
    "qualification": "Ph.D Physics",
    "experience": 6,
    "specialization": "Quantum Physics"
}
```

### 3. Get Teacher Dashboard

**GET** `/api/teacher/dashboard`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "profile": {
            "name": "Prof. Smith",
            "department": "Science",
            "employeeId": "T123456"
        },
        "todaySchedule": [],
        "upcomingClasses": [],
        "recentNotices": [],
        "studentsCount": 50,
        "batchesCount": 3,
        "pendingAssignments": 5
    }
}
```

---

## Admin Management

### 1. Get Admin Dashboard

**GET** `/api/admin/dashboard`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "stats": {
            "totalStudents": 150,
            "totalTeachers": 25,
            "totalCourses": 10,
            "totalBatches": 15,
            "activeUsers": 120,
            "pendingApprovals": 5
        },
        "recentActivities": [],
        "systemHealth": {
            "status": "healthy",
            "uptime": "99.9%",
            "lastBackup": "2025-01-01T00:00:00Z"
        }
    }
}
```

### 2. Get All Students

**GET** `/api/admin/students`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `page`: Page number (default: 1)
-   `limit`: Items per page (default: 10)
-   `status`: Filter by status (active, pending, suspended)
-   `search`: Search by name or email

**Response**:

```json
{
    "success": true,
    "data": {
        "students": [
            {
                "id": "student_id",
                "name": "John Doe",
                "email": "john@example.com",
                "mobile": "1234567890",
                "grade": "10th",
                "status": "active",
                "joinDate": "2025-01-01",
                "batch": "Batch A"
            }
        ],
        "pagination": {
            "total": 150,
            "page": 1,
            "limit": 10,
            "pages": 15
        }
    }
}
```

### 3. Get All Teachers

**GET** `/api/admin/teachers`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**: Same as students

**Response**:

```json
{
    "success": true,
    "data": {
        "teachers": [
            {
                "id": "teacher_id",
                "name": "Prof. Smith",
                "email": "smith@example.com",
                "employeeId": "T123456",
                "department": "Science",
                "specialization": "Physics",
                "status": "active"
            }
        ],
        "pagination": {
            "total": 25,
            "page": 1,
            "limit": 10,
            "pages": 3
        }
    }
}
```

### 4. Create User

**POST** `/api/admin/user`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "name": "New User",
    "email": "newuser@example.com",
    "password": "tempPassword123",
    "mobile": "1234567890",
    "role": "student|teacher|admin"
    // Role-specific fields as per registration
}
```

### 5. Update User

**PUT** `/api/admin/user/:id`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "name": "Updated Name",
    "status": "active|pending|suspended",
    "email": "updated@example.com"
}
```

### 6. Delete User

**DELETE** `/api/admin/user/:id`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "User deleted successfully"
}
```

### 7. Create Announcement

**POST** `/api/admin/announcement`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "title": "System Maintenance",
    "content": "System will be down for maintenance on...",
    "priority": "high|medium|low",
    "targetAudience": "all|students|teachers",
    "expiryDate": "2025-01-31"
}
```

---

## Course Management

### 1. Create Course

**POST** `/api/courses`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "name": "Advanced Physics",
    "description": "Comprehensive physics course covering advanced topics",
    "duration": "6 months",
    "fee": 15000,
    "topics": [
        {
            "title": "Quantum Mechanics",
            "description": "Introduction to quantum mechanics",
            "order": 1
        },
        {
            "title": "Thermodynamics",
            "description": "Laws of thermodynamics",
            "order": 2
        }
    ]
}
```

**Response**:

```json
{
    "success": true,
    "data": {
        "id": "course_id",
        "name": "Advanced Physics",
        "description": "Comprehensive physics course covering advanced topics",
        "duration": "6 months",
        "fee": 15000,
        "topics": [
            {
                "title": "Quantum Mechanics",
                "description": "Introduction to quantum mechanics",
                "order": 1
            }
        ],
        "createdAt": "2025-01-01T00:00:00Z"
    }
}
```

### 2. Get All Courses

**GET** `/api/courses`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": [
        {
            "id": "course_id",
            "name": "Advanced Physics",
            "description": "Course description",
            "duration": "6 months",
            "fee": 15000,
            "topics": [],
            "batches": [
                {
                    "batchName": "Batch A",
                    "teacher": {
                        "name": "Prof. Smith",
                        "email": "smith@example.com"
                    },
                    "startDate": "2025-01-01",
                    "endDate": "2025-06-01",
                    "students": []
                }
            ]
        }
    ]
}
```

### 3. Update Course

**PATCH** `/api/courses/:id`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "name": "Updated Course Name",
    "description": "Updated description",
    "fee": 18000,
    "topics": [
        {
            "title": "New Topic",
            "description": "New topic description",
            "order": 3
        }
    ]
}
```

### 4. Add Batch to Course

**POST** `/api/courses/:courseId/batches`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "batchName": "Batch B",
    "schedule": "Mon-Wed-Fri 10:00-12:00",
    "teacher": "teacher_id",
    "startDate": "2025-02-01",
    "endDate": "2025-07-01",
    "students": []
}
```

### 5. Update Batch

**PATCH** `/api/courses/:courseId/batches/:batchId`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "batchName": "Updated Batch Name",
    "schedule": "Tue-Thu-Sat 14:00-16:00",
    "teacher": "new_teacher_id"
}
```

### 6. Update Students in Batch

**PATCH** `/api/courses/:courseId/batches/:batchId/students`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "addStudents": ["student_id_1", "student_id_2"],
    "removeStudents": ["student_id_3"]
}
```

---

## Batch Management

### 1. Create Batch

**POST** `/api/batch`

**Access**: Private (Admin/Teacher)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "name": "Advanced Physics Batch A",
    "course": "course_id",
    "teacher": "teacher_id",
    "startDate": "2025-01-01",
    "endDate": "2025-06-01",
    "schedule": "Mon-Wed-Fri 10:00-12:00",
    "maxStudents": 30,
    "description": "Morning batch for advanced physics"
}
```

### 2. Get All Batches

**GET** `/api/batch`

**Access**: Private (All roles)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `course`: Filter by course ID
-   `teacher`: Filter by teacher ID
-   `status`: Filter by status (active, completed, upcoming)

**Response**:

```json
{
    "success": true,
    "data": [
        {
            "id": "batch_id",
            "name": "Advanced Physics Batch A",
            "course": {
                "id": "course_id",
                "name": "Advanced Physics"
            },
            "teacher": {
                "id": "teacher_id",
                "name": "Prof. Smith"
            },
            "startDate": "2025-01-01",
            "endDate": "2025-06-01",
            "schedule": "Mon-Wed-Fri 10:00-12:00",
            "maxStudents": 30,
            "currentStudents": 25,
            "status": "active"
        }
    ]
}
```

### 3. Update Batch

**PUT** `/api/batch/:batchId`

**Access**: Private (Admin/Teacher)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "name": "Updated Batch Name",
    "schedule": "Tue-Thu-Sat 14:00-16:00",
    "maxStudents": 35
}
```

### 4. Delete Batch

**DELETE** `/api/batch/:batchId`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "Batch deleted successfully"
}
```

### 5. Assign Student to Batch

**POST** `/api/batch/:batchId/students`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "studentId": "student_id"
}
```

### 6. Get Batches by Course

**GET** `/api/batch/course/:courseId`

**Access**: Private (All roles)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": [
        {
            "id": "batch_id",
            "name": "Batch A",
            "teacher": "Prof. Smith",
            "schedule": "Mon-Wed-Fri 10:00-12:00",
            "currentStudents": 25,
            "maxStudents": 30
        }
    ]
}
```

---

## Material Management

### 1. Upload Material

**POST** `/api/materials`

**Access**: Private (Teacher only)

**Headers**:

-   `Authorization: Bearer <token>`
-   `Content-Type: multipart/form-data`

**Request Body** (Form Data):

```
file: <document_file>
title: "Physics Chapter 1"
description: "Introduction to mechanics"
batchId: "batch_id"
category: "notes|assignment|reference"
```

**Response**:

```json
{
    "success": true,
    "message": "Material uploaded successfully",
    "data": {
        "id": "material_id",
        "title": "Physics Chapter 1",
        "description": "Introduction to mechanics",
        "fileName": "physics_ch1.pdf",
        "fileUrl": "https://cloudinary.com/file_url",
        "fileSize": 1024000,
        "category": "notes",
        "uploadedBy": "teacher_id",
        "batch": "batch_id",
        "uploadDate": "2025-01-01T00:00:00Z"
    }
}
```

### 2. Get Materials by Batch (Student)

**GET** `/api/materials/student`

**Access**: Private (Student only)

**Headers**: `Authorization: Bearer <token>`

**Description**: Returns materials for the student's assigned batch

**Response**:

```json
{
    "success": true,
    "data": [
        {
            "id": "material_id",
            "title": "Physics Chapter 1",
            "description": "Introduction to mechanics",
            "fileName": "physics_ch1.pdf",
            "fileUrl": "https://cloudinary.com/file_url",
            "fileSize": 1024000,
            "category": "notes",
            "uploadedBy": {
                "name": "Prof. Smith",
                "id": "teacher_id"
            },
            "uploadDate": "2025-01-01T00:00:00Z",
            "viewCount": 25,
            "downloadCount": 20
        }
    ]
}
```

### 3. Get All Materials (Admin/Teacher)

**GET** `/api/materials`

**Access**: Private (Admin, Teacher)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `batch`: Filter by batch ID
-   `category`: Filter by category
-   `teacher`: Filter by teacher ID
-   `page`: Page number
-   `limit`: Items per page

**Response**:

```json
{
    "success": true,
    "data": {
        "materials": [
            {
                "id": "material_id",
                "title": "Physics Chapter 1",
                "description": "Introduction to mechanics",
                "fileName": "physics_ch1.pdf",
                "category": "notes",
                "batch": {
                    "name": "Batch A",
                    "course": "Advanced Physics"
                },
                "uploadedBy": {
                    "name": "Prof. Smith"
                },
                "uploadDate": "2025-01-01T00:00:00Z",
                "stats": {
                    "views": 25,
                    "downloads": 20
                }
            }
        ],
        "pagination": {
            "total": 50,
            "page": 1,
            "limit": 10,
            "pages": 5
        }
    }
}
```

### 4. Search Materials

**GET** `/api/materials/search`

**Access**: Private (All roles)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `q`: Search query (title, description)
-   `category`: Filter by category
-   `batch`: Filter by batch (if user has access)

**Response**:

```json
{
    "success": true,
    "data": [
        {
            "id": "material_id",
            "title": "Physics Chapter 1",
            "description": "Introduction to mechanics",
            "category": "notes",
            "uploadDate": "2025-01-01T00:00:00Z",
            "relevanceScore": 0.95
        }
    ]
}
```

### 5. Delete Material

**DELETE** `/api/materials/:materialId`

**Access**: Private (Teacher, Admin)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "Material deleted successfully"
}
```

### 6. Track Material View

**POST** `/api/materials/view/:materialId`

**Access**: Private (Student only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "View tracked successfully"
}
```

---

## Attendance Management

### 1. Mark Attendance

**POST** `/api/attendance`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "batchId": "batch_id",
    "date": "2025-01-01",
    "attendanceRecords": [
        {
            "studentId": "student_id_1",
            "status": "present|absent|leave"
        },
        {
            "studentId": "student_id_2",
            "status": "present"
        }
    ]
}
```

**Response**:

```json
{
    "success": true,
    "message": "Attendance marked successfully",
    "data": {
        "date": "2025-01-01",
        "batchId": "batch_id",
        "totalStudents": 30,
        "presentCount": 28,
        "absentCount": 2,
        "attendanceRecords": []
    }
}
```

### 2. Get Attendance by Batch and Date

**GET** `/api/attendance`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `batchId`: Batch ID (required)
-   `date`: Date in YYYY-MM-DD format (required)

**Response**:

```json
{
    "success": true,
    "data": {
        "date": "2025-01-01",
        "batch": {
            "id": "batch_id",
            "name": "Batch A",
            "course": "Advanced Physics"
        },
        "attendanceRecords": [
            {
                "student": {
                    "id": "student_id",
                    "name": "John Doe",
                    "rollNumber": "001"
                },
                "status": "present",
                "markedAt": "2025-01-01T10:00:00Z"
            }
        ],
        "summary": {
            "totalStudents": 30,
            "presentCount": 28,
            "absentCount": 2,
            "attendancePercentage": 93.33
        }
    }
}
```

### 3. Get Attendance Summary

**GET** `/api/attendance/summary`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `batchId`: Batch ID (optional)
-   `studentId`: Student ID (optional)
-   `startDate`: Start date (optional)
-   `endDate`: End date (optional)

**Response**:

```json
{
    "success": true,
    "data": {
        "overallSummary": {
            "totalClasses": 100,
            "averageAttendance": 87.5,
            "bestAttendanceDay": "Monday",
            "worstAttendanceDay": "Friday"
        },
        "batchWise": [
            {
                "batchId": "batch_id",
                "batchName": "Batch A",
                "totalClasses": 50,
                "averageAttendance": 90.2,
                "studentsCount": 30
            }
        ],
        "studentWise": [
            {
                "studentId": "student_id",
                "studentName": "John Doe",
                "totalClasses": 50,
                "attendedClasses": 45,
                "attendancePercentage": 90.0
            }
        ]
    }
}
```

---

## Notice Management

### 1. Create Notice

**POST** `/api/teacher/notices`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "title": "Important Announcement",
    "content": "Class will be rescheduled to 2 PM tomorrow.",
    "priority": "high|medium|low",
    "targetAudience": "batch_id|all",
    "expiryDate": "2025-01-31",
    "attachments": ["url1", "url2"]
}
```

**Response**:

```json
{
    "success": true,
    "message": "Notice created successfully",
    "data": {
        "id": "notice_id",
        "title": "Important Announcement",
        "content": "Class will be rescheduled to 2 PM tomorrow.",
        "priority": "high",
        "targetAudience": "batch_id",
        "createdBy": "teacher_id",
        "createdAt": "2025-01-01T00:00:00Z",
        "expiryDate": "2025-01-31T00:00:00Z",
        "status": "active"
    }
}
```

### 2. Get All Notices

**GET** `/api/teacher/notices`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `page`: Page number (default: 1)
-   `limit`: Items per page (default: 10)
-   `priority`: Filter by priority
-   `status`: Filter by status (active, expired, draft)
-   `targetAudience`: Filter by target audience

**Response**:

```json
{
    "success": true,
    "data": {
        "notices": [
            {
                "id": "notice_id",
                "title": "Important Announcement",
                "content": "Class will be rescheduled...",
                "priority": "high",
                "targetAudience": "batch_id",
                "createdAt": "2025-01-01T00:00:00Z",
                "expiryDate": "2025-01-31T00:00:00Z",
                "status": "active",
                "viewCount": 25,
                "readCount": 20
            }
        ],
        "pagination": {
            "total": 50,
            "page": 1,
            "limit": 10,
            "pages": 5
        }
    }
}
```

### 3. Get Notice by ID

**GET** `/api/teacher/notices/:id`

**Access**: Private (Teacher only - own notices)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "id": "notice_id",
        "title": "Important Announcement",
        "content": "Class will be rescheduled to 2 PM tomorrow.",
        "priority": "high",
        "targetAudience": "batch_id",
        "createdBy": {
            "id": "teacher_id",
            "name": "Prof. Smith"
        },
        "createdAt": "2025-01-01T00:00:00Z",
        "updatedAt": "2025-01-01T00:00:00Z",
        "expiryDate": "2025-01-31T00:00:00Z",
        "status": "active",
        "attachments": [],
        "readBy": [
            {
                "studentId": "student_id",
                "readAt": "2025-01-01T10:00:00Z"
            }
        ],
        "stats": {
            "totalViews": 25,
            "totalReads": 20,
            "readPercentage": 80.0
        }
    }
}
```

### 4. Update Notice

**PUT** `/api/teacher/notices/:id`

**Access**: Private (Teacher only - own notices)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "title": "Updated Announcement",
    "content": "Updated content",
    "priority": "medium",
    "expiryDate": "2025-02-28"
}
```

### 5. Delete Notice

**DELETE** `/api/teacher/notices/:id`

**Access**: Private (Teacher only - own notices)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "Notice deleted successfully"
}
```

---

## Schedule Management

### 1. Create Schedule

**POST** `/api/teacher/schedule`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "batchId": "batch_id",
    "subject": "Physics",
    "topic": "Quantum Mechanics",
    "date": "2025-01-01",
    "startTime": "10:00",
    "endTime": "12:00",
    "location": "Room 101",
    "type": "regular|makeup|extra",
    "description": "Introduction to quantum mechanics"
}
```

**Response**:

```json
{
    "success": true,
    "message": "Schedule created successfully",
    "data": {
        "id": "schedule_id",
        "batch": {
            "id": "batch_id",
            "name": "Batch A"
        },
        "subject": "Physics",
        "topic": "Quantum Mechanics",
        "date": "2025-01-01",
        "startTime": "10:00",
        "endTime": "12:00",
        "location": "Room 101",
        "type": "regular",
        "teacher": "teacher_id",
        "status": "scheduled"
    }
}
```

### 2. Get Teacher Schedule

**GET** `/api/teacher/schedule`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `date`: Specific date (YYYY-MM-DD)
-   `startDate`: Start date for range
-   `endDate`: End date for range
-   `batch`: Filter by batch ID
-   `type`: Filter by schedule type

**Response**:

```json
{
    "success": true,
    "data": [
        {
            "id": "schedule_id",
            "batch": {
                "id": "batch_id",
                "name": "Batch A",
                "course": "Advanced Physics"
            },
            "subject": "Physics",
            "topic": "Quantum Mechanics",
            "date": "2025-01-01",
            "startTime": "10:00",
            "endTime": "12:00",
            "location": "Room 101",
            "type": "regular",
            "status": "scheduled",
            "attendance": {
                "marked": false,
                "count": 0
            }
        }
    ]
}
```

### 3. Update Schedule

**PUT** `/api/teacher/schedule/:id`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "topic": "Updated Topic",
    "startTime": "11:00",
    "endTime": "13:00",
    "location": "Room 102"
}
```

### 4. Delete Schedule

**DELETE** `/api/teacher/schedule/:id`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "Schedule deleted successfully"
}
```

---

## Fee Management

### 1. Create Fee Record

**POST** `/api/fee`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "studentId": "student_id",
    "courseId": "course_id",
    "amount": 15000,
    "dueDate": "2025-01-31",
    "description": "Course fee for Advanced Physics",
    "type": "course|exam|library|other"
}
```

### 2. Get Student Fees

**GET** `/api/fee/student/:studentId`

**Access**: Private (Admin, Student - own fees)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "student": {
            "id": "student_id",
            "name": "John Doe"
        },
        "fees": [
            {
                "id": "fee_id",
                "course": {
                    "name": "Advanced Physics"
                },
                "amount": 15000,
                "paidAmount": 10000,
                "pendingAmount": 5000,
                "dueDate": "2025-01-31",
                "status": "partial|paid|overdue",
                "type": "course"
            }
        ],
        "summary": {
            "totalAmount": 15000,
            "paidAmount": 10000,
            "pendingAmount": 5000
        }
    }
}
```

### 3. Process Payment

**POST** `/api/fee/:id/pay`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "amount": 5000,
    "paymentMethod": "cash|card|online|cheque",
    "transactionId": "TXN123456",
    "paymentDate": "2025-01-01",
    "remarks": "Partial payment"
}
```

**Response**:

```json
{
    "success": true,
    "message": "Payment processed successfully",
    "data": {
        "paymentId": "payment_id",
        "feeId": "fee_id",
        "amount": 5000,
        "remainingAmount": 0,
        "status": "paid",
        "transactionId": "TXN123456"
    }
}
```

### 4. Get Fee by ID

**GET** `/api/fee/:id`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "id": "fee_id",
        "student": {
            "id": "student_id",
            "name": "John Doe",
            "email": "john@example.com"
        },
        "course": {
            "id": "course_id",
            "title": "Advanced Physics"
        },
        "amount": 15000,
        "paidAmount": 10000,
        "pendingAmount": 5000,
        "dueDate": "2025-01-31T00:00:00Z",
        "status": "partial",
        "type": "course",
        "payments": [
            {
                "amount": 10000,
                "paymentDate": "2025-01-01T00:00:00Z",
                "paymentMethod": "online",
                "transactionId": "TXN123456"
            }
        ]
    }
}
```

### 5. Update Fee

**PUT** `/api/fee/:id`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "amount": 16000,
    "dueDate": "2025-02-15",
    "description": "Updated course fee",
    "type": "course"
}
```

### 6. Delete Fee

**DELETE** `/api/fee/:id`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "Fee record deleted successfully"
}
```

### 7. Get All Fees

**GET** `/api/fee`

**Access**: Private (Admin only)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `page` (number, optional): Page number (default: 1)
-   `limit` (number, optional): Results per page (default: 10)
-   `status` (string, optional): Filter by payment status
-   `student` (string, optional): Filter by student name or ID

**Response**:

```json
{
    "success": true,
    "data": {
        "fees": [
            {
                "id": "fee_id",
                "student": {
                    "name": "John Doe",
                    "email": "john@example.com"
                },
                "course": {
                    "title": "Advanced Physics"
                },
                "amount": 15000,
                "paidAmount": 10000,
                "pendingAmount": 5000,
                "status": "partial",
                "dueDate": "2025-01-31T00:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 25,
            "pages": 3
        }
    }
}
```

---

## Recording Management

### 1. Upload Recording

**POST** `/api/recordings`

**Access**: Private (Teacher, Admin)

**Headers**:

-   `Authorization: Bearer <token>`
-   `Content-Type: multipart/form-data`

**Request Body** (Form Data):

```
video: <video_file>
title: "Physics Lecture 1"
description: "Introduction to mechanics"
subject: "Physics"
batchId: "batch_id"
courseId: "course_id"
```

**Response**:

```json
{
    "success": true,
    "data": {
        "_id": "recording_id",
        "title": "Physics Lecture 1",
        "description": "Introduction to mechanics",
        "subject": "Physics",
        "fileUrl": "https://cloudinary.com/video_url",
        "thumbnailUrl": "https://cloudinary.com/thumbnail_url",
        "duration": 3600,
        "batch": "batch_id",
        "course": "course_id",
        "teacher": "teacher_id",
        "accessExpires": "2025-01-29T00:00:00Z",
        "isActive": true,
        "views": 0
    },
    "message": "Recording uploaded successfully"
}
```

### 2. Get All Recordings

**GET** `/api/recordings`

**Access**: Private (Teacher, Admin, Student)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `batchId` (string, optional): Filter by batch
-   `courseId` (string, optional): Filter by course
-   `subject` (string, optional): Filter by subject
-   `active` (boolean, optional): Filter by active status

**Response**:

```json
{
    "success": true,
    "count": 5,
    "data": [
        {
            "_id": "recording_id",
            "title": "Physics Lecture 1",
            "description": "Introduction to mechanics",
            "subject": "Physics",
            "fileUrl": "https://cloudinary.com/video_url",
            "duration": 3600,
            "views": 25,
            "accessExpires": "2025-01-29T00:00:00Z",
            "batch": {
                "name": "Physics Batch A"
            },
            "course": {
                "name": "Advanced Physics"
            },
            "teacher": {
                "name": "Prof. Smith"
            }
        }
    ]
}
```

### 3. Get Student Recordings

**GET** `/api/recordings/student`

**Access**: Private (Student)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `batchId` (string, optional): Filter by batch ID

**Response**:

```json
{
    "success": true,
    "count": 3,
    "data": [
        {
            "_id": "recording_id",
            "title": "Physics Lecture 1",
            "subject": "Physics",
            "fileUrl": "https://cloudinary.com/video_url",
            "duration": 3600,
            "views": 15,
            "accessExpires": "2025-01-29T00:00:00Z",
            "course": {
                "name": "Advanced Physics"
            },
            "teacher": {
                "name": "Prof. Smith"
            }
        }
    ]
}
```

### 4. Get Single Recording

**GET** `/api/recordings/:id`

**Access**: Private (Teacher, Admin, Student)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "_id": "recording_id",
        "title": "Physics Lecture 1",
        "description": "Introduction to mechanics",
        "subject": "Physics",
        "fileUrl": "https://cloudinary.com/video_url",
        "thumbnailUrl": "https://cloudinary.com/thumbnail_url",
        "duration": 3600,
        "views": 25,
        "accessExpires": "2025-01-29T00:00:00Z",
        "isActive": true,
        "batch": {
            "_id": "batch_id",
            "name": "Physics Batch A"
        },
        "course": {
            "_id": "course_id",
            "name": "Advanced Physics"
        },
        "teacher": {
            "_id": "teacher_id",
            "name": "Prof. Smith"
        },
        "viewedBy": [
            {
                "student": "student_id",
                "viewCount": 3,
                "lastViewed": "2025-01-26T10:30:00Z"
            }
        ]
    }
}
```

### 5. Update Recording

**PUT** `/api/recordings/:id`

**Access**: Private (Teacher - own recordings, Admin)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "title": "Updated Physics Lecture 1",
    "description": "Updated description",
    "subject": "Advanced Physics",
    "accessExpires": "2025-02-15T00:00:00Z",
    "isActive": true
}
```

**Response**:

```json
{
    "success": true,
    "data": {
        "_id": "recording_id",
        "title": "Updated Physics Lecture 1",
        "description": "Updated description",
        "subject": "Advanced Physics",
        "accessExpires": "2025-02-15T00:00:00Z",
        "isActive": true
    },
    "message": "Recording updated successfully"
}
```

### 6. Delete Recording

**DELETE** `/api/recordings/:id`

**Access**: Private (Teacher - own recordings, Admin)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "Recording deleted successfully"
}
```

### 7. Search Recordings

**GET** `/api/recordings/search`

**Access**: Private (Teacher, Admin, Student)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `query` (string, required): Search term for title

**Response**:

```json
{
    "success": true,
    "count": 2,
    "data": [
        {
            "_id": "recording_id",
            "title": "Physics Lecture 1",
            "subject": "Physics",
            "fileUrl": "https://cloudinary.com/video_url",
            "batch": {
                "name": "Physics Batch A"
            },
            "course": {
                "name": "Advanced Physics"
            },
            "teacher": {
                "name": "Prof. Smith"
            }
        }
    ]
}
```

### 8. Get Recording Analytics

**GET** `/api/recordings/analytics`

**Access**: Private (Teacher, Admin)

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:

-   `batchId` (string, optional): Filter by batch
-   `courseId` (string, optional): Filter by course
-   `period` (string, optional): Time period (week, month, quarter)

**Response**:

```json
{
    "success": true,
    "data": {
        "summary": {
            "totalRecordings": 15,
            "totalViews": 450,
            "averageViews": 30.5,
            "uniqueViewers": 85,
            "subjectDistribution": {
                "Physics": 8,
                "Chemistry": 5,
                "Math": 2
            }
        },
        "topRecordings": [
            {
                "_id": "recording_id",
                "title": "Physics Lecture 1",
                "views": 75,
                "subject": "Physics"
            }
        ]
    }
}
```

### 9. Extend Recording Access

**PUT** `/api/recordings/:id/extend`

**Access**: Private (Teacher - own recordings, Admin)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "days": 7
}
```

**Response**:

```json
{
    "success": true,
    "data": {
        "id": "recording_id",
        "title": "Physics Lecture 1",
        "previousExpiry": "2025-01-29T00:00:00Z",
        "newExpiry": "2025-02-05T00:00:00Z"
    },
    "message": "Recording access extended by 7 days"
}
```

---

## Assignment Management

### 1. Create Assignment

**POST** `/api/assignments`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "title": "Physics Assignment 1",
    "description": "Solve the given problems on mechanics",
    "batchId": "batch_id",
    "dueDate": "2025-01-15",
    "maxMarks": 100,
    "instructions": "Submit in PDF format",
    "attachments": ["url1", "url2"]
}
```

### 2. Get Assignments by Batch

**GET** `/api/assignments/batch/:batchId`

**Access**: Private (Teacher, Student - own batch)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": [
        {
            "id": "assignment_id",
            "title": "Physics Assignment 1",
            "description": "Solve the given problems on mechanics",
            "dueDate": "2025-01-15",
            "maxMarks": 100,
            "status": "active|expired",
            "submissionCount": 20,
            "totalStudents": 30,
            "createdAt": "2025-01-01T00:00:00Z"
        }
    ]
}
```

### 3. Submit Assignment

**POST** `/api/assignments/:assignmentId/submit`

**Access**: Private (Student only)

**Headers**:

-   `Authorization: Bearer <token>`
-   `Content-Type: multipart/form-data`

**Request Body** (Form Data):

```
file: <submission_file>
remarks: "Completed all problems"
```

### 4. Get Single Assignment

**GET** `/api/assignments/:assignmentId`

**Access**: Private (Teacher, Student - own batch)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": {
        "id": "assignment_id",
        "title": "Physics Assignment 1",
        "description": "Solve the given problems on mechanics",
        "instructions": "Submit in PDF format",
        "maxMarks": 100,
        "dueDate": "2025-01-15T23:59:59Z",
        "createdDate": "2025-01-01T00:00:00Z",
        "attachments": ["url1", "url2"],
        "batch": {
            "id": "batch_id",
            "name": "Physics Batch A"
        },
        "submissionCount": 25,
        "gradedCount": 15
    }
}
```

### 5. Update Assignment

**PUT** `/api/assignments/:assignmentId`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "title": "Updated Physics Assignment 1",
    "description": "Updated description",
    "dueDate": "2025-01-20",
    "maxMarks": 120
}
```

### 6. Delete Assignment

**DELETE** `/api/assignments/:assignmentId`

**Access**: Private (Teacher, Admin)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "message": "Assignment deleted successfully"
}
```

### 7. Get Assignment Submissions

**GET** `/api/assignments/:assignmentId/submissions`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Response**:

```json
{
    "success": true,
    "data": [
        {
            "id": "submission_id",
            "student": {
                "id": "student_id",
                "name": "John Doe",
                "email": "john@example.com"
            },
            "submissionDate": "2025-01-10T14:30:00Z",
            "fileUrl": "https://cloudinary.com/submission_file",
            "remarks": "Completed all problems",
            "marks": 85,
            "feedback": "Good work",
            "status": "graded"
        }
    ]
}
```

### 8. Grade Assignment

**PUT** `/api/assignments/:assignmentId/submissions/:submissionId/grade`

**Access**: Private (Teacher only)

**Headers**: `Authorization: Bearer <token>`

**Request Body**:

```json
{
    "marks": 85,
    "feedback": "Good work, but could improve on problem 3",
    "status": "graded"
}
```

---

## Error Handling

### Common Error Codes

| Status Code | Description                               |
| ----------- | ----------------------------------------- |
| 400         | Bad Request - Invalid input data          |
| 401         | Unauthorized - Invalid or missing token   |
| 403         | Forbidden - Insufficient permissions      |
| 404         | Not Found - Resource not found            |
| 409         | Conflict - Duplicate data (email, mobile) |
| 422         | Unprocessable Entity - Validation errors  |
| 429         | Too Many Requests - Rate limit exceeded   |
| 500         | Internal Server Error - Server error      |

### Error Response Format

```json
{
    "success": false,
    "message": "Error description",
    "errors": ["Specific error 1", "Specific error 2"], // Optional
    "stack": "Error stack trace" // Only in development
}
```

### Validation Errors

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": [
        "Email is required",
        "Password must be at least 6 characters",
        "Mobile number must be 10 digits"
    ]
}
```

### Authentication Errors

```json
{
    "success": false,
    "message": "Invalid token. Please log in again."
}
```

### Authorization Errors

```json
{
    "success": false,
    "message": "Access denied. Insufficient permissions."
}
```

---

## Response Format

### Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully", // Optional
    "data": {
        // Response data
    }
}
```

### Paginated Response

```json
{
    "success": true,
    "data": {
        "items": [],
        "pagination": {
            "total": 100,
            "page": 1,
            "limit": 10,
            "pages": 10,
            "hasNext": true,
            "hasPrev": false
        }
    }
}
```

### File Upload Response

```json
{
    "success": true,
    "message": "File uploaded successfully",
    "data": {
        "fileName": "document.pdf",
        "fileUrl": "https://cloudinary.com/file_url",
        "fileSize": 1024000,
        "mimeType": "application/pdf",
        "cloudinaryId": "public_id"
    }
}
```

---

## Rate Limiting

-   **Global Limit**: 100 requests per 10 minutes per IP
-   **Auth Endpoints**: 5 requests per minute per IP
-   **File Upload**: 10 requests per hour per user

### Rate Limit Headers

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Security Features

### Authentication Security

-   ✅ JWT tokens with expiration
-   ✅ HTTP-only cookies
-   ✅ Account lockout after failed attempts
-   ✅ Password strength validation
-   ✅ Email verification

### Data Security

-   ✅ Input validation and sanitization
-   ✅ NoSQL injection prevention
-   ✅ XSS protection
-   ✅ CORS configuration
-   ✅ Helmet security headers

### File Security

-   ✅ File type validation
-   ✅ File size limits
-   ✅ Cloudinary secure URLs
-   ✅ Virus scanning (recommended)

---

## Development Notes

### Environment Variables Required

```env
# Database
MONGO_URI=mongodb://localhost:27017/highq-classes

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Server
PORT=5000
NODE_ENV=development
```

### Postman Collection

Import the provided Postman collection for easy API testing.

### API Versioning

Current version: v1 (no versioning in URLs yet)
Future versions will use: `/api/v2/...`

---

## 🚀 Quick Reference for All API Endpoints

### 🔐 Authentication Flow

```
POST /api/auth/register        - Register new user
POST /api/auth/login          - Login and get token
GET  /api/auth/me             - Get current user info
POST /api/auth/logout         - Logout user
PUT  /api/auth/update-profile - Update user profile
PUT  /api/auth/change-password - Change password
POST /api/auth/forgot-password - Request password reset
POST /api/auth/reset-password  - Reset password with token

Include: Authorization: Bearer <token> in headers for protected routes
```

### 👨‍🎓 Student Endpoints

```
GET   /api/student/:id/profile           - Get student profile
PATCH /api/student/:id/profile           - Update student profile
POST  /api/student/:id/profile-picture   - Upload profile picture
PATCH /api/student/:id/change-password   - Change student password
GET   /api/student/dashboard             - Student dashboard overview
```

### 👨‍🏫 Teacher Endpoints

```
GET /api/teacher/profile    - Get teacher profile
PUT /api/teacher/profile    - Update teacher profile
GET /api/teacher/dashboard  - Teacher dashboard overview
```

### 👨‍💼 Admin Endpoints

```
GET    /api/admin/dashboard      - Admin dashboard overview
GET    /api/admin/students       - Get all students
GET    /api/admin/teachers       - Get all teachers
POST   /api/admin/user           - Create new user
PUT    /api/admin/user/:id       - Update user
DELETE /api/admin/user/:id       - Delete user
POST   /api/admin/announcement   - Create announcement
```

### 📚 Course Management

```
POST  /api/courses                                    - Create course
GET   /api/courses                                    - Get all courses
PATCH /api/courses/:id                                - Update course
POST  /api/courses/:courseId/batches                  - Add batch to course
PATCH /api/courses/:courseId/batches/:batchId         - Update batch
PATCH /api/courses/:courseId/batches/:batchId/students - Update students in batch
```

### 👥 Batch Management

```
POST   /api/batch                 - Create batch
GET    /api/batch                 - Get all batches
PUT    /api/batch/:batchId        - Update batch
DELETE /api/batch/:batchId        - Delete batch
POST   /api/batch/:batchId/students - Add students to batch
GET    /api/batch/course/:courseId  - Get batches by course
```

### 📖 Material Management

```
POST   /api/materials               - Upload material (teachers)
GET    /api/materials/student       - Get materials for student
GET    /api/materials               - Get all materials (admin/teacher)
GET    /api/materials/search        - Search materials
DELETE /api/materials/:materialId   - Delete material
POST   /api/materials/view/:materialId - Track material view (students)
```

### ✅ Attendance Management

```
POST /api/attendance         - Mark attendance
GET  /api/attendance         - Get attendance records
GET  /api/attendance/summary - Get attendance summary
```

### 📢 Notice Management

```
POST   /api/teacher/notices     - Create notice
GET    /api/teacher/notices     - Get all notices
GET    /api/teacher/notices/:id - Get notice by ID
PUT    /api/teacher/notices/:id - Update notice
DELETE /api/teacher/notices/:id - Delete notice
```

### 📅 Schedule Management

```
POST /api/teacher/schedule     - Create schedule
GET  /api/teacher/schedule     - Get schedules
```

### 💰 Fee Management

```
POST   /api/fee                    - Create fee record
GET    /api/fee                    - Get all fees
GET    /api/fee/:id                - Get fee by ID
PUT    /api/fee/:id                - Update fee
DELETE /api/fee/:id                - Delete fee
GET    /api/fee/student/:studentId - Get student fees
POST   /api/fee/:id/pay            - Process payment
```

### 🎥 Recording Management

```
POST   /api/recordings                    - Upload recording (teachers/admins)
GET    /api/recordings                    - Get all recordings (with filters)
GET    /api/recordings/student            - Get student accessible recordings
GET    /api/recordings/:id                - Get single recording
PUT    /api/recordings/:id                - Update recording
DELETE /api/recordings/:id                - Delete recording
GET    /api/recordings/search             - Search recordings by title
GET    /api/recordings/analytics          - Get recording analytics
PUT    /api/recordings/:id/extend         - Extend recording access
```

### 📝 Assignment Management

```
POST   /api/assignments                                    - Create assignment
GET    /api/assignments/batch/:batchId                     - Get assignments by batch
GET    /api/assignments/:assignmentId                      - Get single assignment
PUT    /api/assignments/:assignmentId                      - Update assignment
DELETE /api/assignments/:assignmentId                      - Delete assignment
POST   /api/assignments/:assignmentId/submit               - Submit assignment
GET    /api/assignments/:assignmentId/submissions          - Get assignment submissions
PUT    /api/assignments/:assignmentId/submissions/:submissionId/grade - Grade assignment
```

### 🔍 Search & Analytics Endpoints

```
GET /api/recordings/search                    - Search recordings
GET /api/recordings/:recordingId/analytics    - Recording analytics
GET /api/materials/search                     - Search materials
GET /api/attendance/summary                   - Attendance analytics
```

### 📤 File Upload Endpoints

```
POST /api/recordings                          - Video upload (teachers)
POST /api/materials                           - Study material upload (teachers)
POST /api/student/:id/profile-picture         - Profile picture upload
POST /api/assignments/:assignmentId/submit    - Assignment submission
```

---

This documentation covers all available endpoints in the HighQ Classes API. For additional support or questions, please contact the development team.
