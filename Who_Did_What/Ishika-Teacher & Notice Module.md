
# Teacher & Notice Module - Implemented by Ishika

## Overview

This document outlines the Teacher and Notice module for the HighQ Classes backend system. It includes teacher account handling, posting and managing notices, and assigning visibility for different audiences (all students, specific batches, or individual students).

## Features Implemented

### 1. Teacher Profile Management

* **View Profile**: Retrieve authenticated teacher’s profile
* **Update Profile**: Update name, mobile number, or profile image
* **Change Password**: Secure password change after verification

### 2. Notice Management

* **Create Notice**: Teachers can post notices for students, batches, or all
* **Update Notice**: Modify existing notices
* **Delete Notice**: Remove notices no longer needed
* **View All Notices**: Paginated retrieval of all posted notices
* **Filter Notices**: Query by audience type (e.g., all, batch, student)

## Files Created/Modified

### Teacher Feature Files

1. **Teacher Model** (`models/Teacher.js`)

   * Schema for teacher-specific fields
   * Includes subject, profile image, and personal info

2. **Teacher Controller** (`controllers/teacherController.js`)

   * Implements get/update profile logic
   * Provides secure password update route

3. **Teacher Routes** (`routes/teacherRoutes.js`)

   * Defines routes for teacher profile and password management
   * Includes `GET`, `PUT` for profile and `PUT` for changing password

### Notice Management Files

4. **Notice Model** (`models/Notice.js`)

   * Defines schema for notices
   * Supports title, description, postedBy, and audience options

5. **Notice Controller** (`controllers/noticeController.js`)

   * Logic to create, update, delete, and fetch notices
   * Includes pagination, filtering by batch or student ID

6. **Notice Routes** (`routes/noticeRoutes.js`)

   * RESTful routes for notice operations
   * Protected by teacher authentication middleware

## API Endpoints

### Teacher Routes (`/api/teachers`)

* **GET /me** – Get logged-in teacher profile
* **PUT /update-profile** – Update profile info (name, mobile, image)
* **PUT /change-password** – Change password securely

### Notice Routes (`/api/notices`)

* **POST /** – Create a new notice
* **PUT /\:id** – Update an existing notice
* **DELETE /\:id** – Delete a notice
* **GET /** – View all notices (with pagination, filters)

## Schema References

### Teacher Model

```js
{
  name: String,
  email: String,
  password: String,
  mobile: String,
  subject: String,
  profilePicture: String,
  role: { type: String, default: "teacher" },
  createdAt: Date,
  updatedAt: Date
}
```

### Notice Model

```js
{
  title: String,
  description: String,
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  audience: {
    type: String,
    enum: ["all", "batch", "student"],
    default: "all"
  },
  batch: { type: mongoose.Schema.Types.ObjectId, ref: "Batch" },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  createdAt: Date,
  updatedAt: Date
}
```

## Middleware Usage

* All routes use `protectTeacher` middleware to ensure only authenticated teachers can access them.
* Notice posting and updates also validate audience targeting (batch, student, or all).

## Error Handling Structure

```json
{
  "success": false,
  "message": "Invalid input or server error"
}
```

Common HTTP status codes:

* 400 – Validation error
* 401 – Unauthorized access
* 403 – Forbidden (wrong role)
* 404 – Resource not found
* 500 – Server error

## Future Enhancements

* Add file attachments to notices
* Notify students via email or dashboard alerts
* Implement audit logs for notice edits


