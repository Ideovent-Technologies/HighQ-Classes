# Registration Endpoint - Universal Role Handling

## Overview

The registration system uses **ONE unified endpoint** that intelligently creates documents in different models based on the `role` field. The same endpoint handles Student, Teacher, and Admin registration with role-specific field processing.

## Endpoint Details

```
POST /api/auth/register
Content-Type: application/json
```

## How It Works

### 1. Single Endpoint, Multiple Models

The registration endpoint uses the `role` field to determine which model to create:

-   `role: "student"` → Creates document in Student model
-   `role: "teacher"` → Creates document in Teacher model
-   `role: "admin"` → Creates document in Admin model

### 2. Cross-Model Validation

Before creating any user, the system checks for duplicate email/mobile across ALL models:

```javascript
// Email uniqueness check across all models
const existingEmail = await Promise.all([
    Student.findOne({ email }),
    Teacher.findOne({ email }),
    Admin.findOne({ email }),
]);

// Mobile uniqueness check across all models
const existingMobile = await Promise.all([
    Student.findOne({ mobile }),
    Teacher.findOne({ mobile }),
    Admin.findOne({ mobile }),
]);
```

### 3. Role-Specific Field Processing

The system extracts common fields and applies role-specific fields:

```javascript
// Common fields for all roles
const commonData = {
    name,
    email,
    password,
    mobile,
    status: userRole === "admin" ? "active" : "pending",
};

// Role-specific model creation
switch (userRole) {
    case "student": /* Student-specific fields */
    case "teacher": /* Teacher-specific fields */
    case "admin": /* Admin-specific fields */
}
```

## Registration Examples

### Student Registration

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "mobile": "1234567890",
  "role": "student",
  "parentName": "Jane Doe",
  "parentContact": "9876543210",
  "grade": "10th",
  "schoolName": "ABC School"
}
```

**Result**: Creates document in `Student` model with all student-specific fields.

### Teacher Registration

```json
POST /api/auth/register
{
  "name": "Prof. Smith",
  "email": "smith@example.com",
  "password": "SecurePass123",
  "mobile": "1234567890",
  "role": "teacher",
  "qualification": "M.Sc Physics",
  "experience": 5,
  "specialization": "Physics",
  "department": "Science"
}
```

**Result**: Creates document in `Teacher` model with professional fields.

### Admin Registration

```json
POST /api/auth/register
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "SecurePass123",
  "mobile": "1234567890",
  "role": "admin",
  "department": "IT",
  "designation": "System Administrator"
}
```

**Result**: Creates document in `Admin` model with administrative fields.

## Field Processing Logic

### Common Fields (All Roles)

-   `name` - Required for all
-   `email` - Required, must be unique across all models
-   `password` - Required, auto-hashed before saving
-   `mobile` - Required, must be unique across all models
-   `status` - Auto-set: "active" for admin, "pending" for others

### Student-Specific Fields

```javascript
{
    ...commonData,
    parentName: additionalData.parentName || 'Parent Name',
    parentContact: additionalData.parentContact || '0000000000',
    grade: additionalData.grade || '10th',
    schoolName: additionalData.schoolName || 'School Name'
}
```

### Teacher-Specific Fields

```javascript
{
    ...commonData,
    employeeId: additionalData.employeeId || `T${Date.now()}`,
    qualification: additionalData.qualification || 'B.Ed',
    experience: additionalData.experience || 0,
    specialization: additionalData.specialization || 'General',
    department: additionalData.department || 'Other'
}
```

### Admin-Specific Fields

```javascript
{
    ...commonData,
    employeeId: additionalData.employeeId || `A${Date.now()}`,
    department: additionalData.department || 'Administrative',
    designation: additionalData.designation || 'System Administrator'
}
```

## Default Values

Each role has sensible defaults for optional fields:

-   Student: Parent name, grade defaults if not provided
-   Teacher: Auto-generated employee ID, default qualification
-   Admin: Auto-generated employee ID, default department

## Response Format

All successful registrations return the same format:

```json
{
    "success": true,
    "message": "Registration successful! Please wait for approval.",
    "data": {
        "id": "generated_mongodb_id",
        "name": "User Name",
        "email": "email@example.com",
        "role": "student|teacher|admin",
        "status": "pending|active"
    }
}
```

## Error Handling

### Duplicate Email/Mobile

```json
{
    "success": false,
    "message": "Email is already registered"
}
```

### Invalid Role

```json
{
    "success": false,
    "message": "Invalid role specified"
}
```

### Server Error

```json
{
    "success": false,
    "message": "Server error during registration"
}
```

## Key Benefits

1. **Single Endpoint**: One URL for all user types
2. **Cross-Model Validation**: No duplicate emails/mobiles across any model
3. **Role-Specific Processing**: Appropriate fields for each user type
4. **Flexible Fields**: Optional fields with sensible defaults
5. **Consistent Response**: Same response format for all roles

## Implementation Notes

-   The `role` field is extracted separately: `const { name, email, password, mobile, role, ...additionalData } = req.body;`
-   Additional fields are captured in `additionalData` and processed based on role
-   Email and mobile uniqueness is enforced across ALL models
-   Password is automatically hashed by the model's pre-save middleware
-   Admin users get "active" status immediately, others are "pending"

This design provides a clean, unified registration experience while maintaining the independence of each model.
