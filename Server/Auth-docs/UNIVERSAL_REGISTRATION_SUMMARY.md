# 🚀 Universal Registration Summary - HighQ Classes

## The Magic of One Endpoint

**Same URL + Different Role = Different Model Creation**

```
POST /api/auth/register  ← SAME ENDPOINT FOR ALL
├── role: "student"  → Creates Student document
├── role: "teacher"  → Creates Teacher document
└── role: "admin"    → Creates Admin document
```

## Live Examples with Same Credentials Base

### Base Credentials (Common for All)

```json
{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "mobile": "1234567890"
}
```

### Add Role + Specific Fields = Different Models

#### 1. Student Registration

```json
{
  ...baseCredentials,
  "role": "student",
  "parentName": "Jane Doe",
  "parentContact": "9876543210",
  "grade": "10th",
  "schoolName": "ABC School"
}
```

✅ **Creates**: Student document with academic fields

#### 2. Teacher Registration

```json
{
  ...baseCredentials,
  "role": "teacher",
  "qualification": "M.Sc Physics",
  "experience": 5,
  "specialization": "Physics",
  "department": "Science"
}
```

✅ **Creates**: Teacher document with professional fields

#### 3. Admin Registration

```json
{
  ...baseCredentials,
  "role": "admin",
  "department": "IT",
  "designation": "System Administrator"
}
```

✅ **Creates**: Admin document with administrative fields

## Smart Processing Logic

### 1. Cross-Model Validation

-   Email must be unique across ALL models (Student + Teacher + Admin)
-   Mobile must be unique across ALL models
-   No duplicate credentials anywhere in the system

### 2. Intelligent Field Handling

```javascript
// System automatically:
✅ Extracts common fields (name, email, password, mobile)
✅ Processes role-specific fields based on 'role' parameter
✅ Applies sensible defaults for missing optional fields
✅ Creates document in appropriate model
```

### 3. Automatic Defaults

-   **Student**: Default grade "10th", default parent info if missing
-   **Teacher**: Auto-generated employee ID, default qualification "B.Ed"
-   **Admin**: Auto-generated employee ID, default department

## Response Format (Same for All Roles)

```json
{
    "success": true,
    "message": "Registration successful! Please wait for approval.",
    "data": {
        "id": "generated_mongodb_id",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "student|teacher|admin",
        "status": "pending|active"
    }
}
```

## Key Benefits

🎯 **Developer Experience**: One endpoint to remember, not three  
🔒 **Data Integrity**: Cross-model uniqueness validation  
⚡ **Performance**: Independent models, no complex joins  
🛠️ **Maintenance**: Clean separation of concerns  
📱 **Frontend**: Simple API integration with role-based forms

## Quick Integration Guide

### Frontend Form Strategy

```javascript
// Single form handler for all roles
const handleRegistration = async (formData) => {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...commonFields, // name, email, password, mobile
            role: selectedRole, // student|teacher|admin
            ...roleSpecificFields, // based on selected role
        }),
    });
};
```

### Role-Specific Form Fields

```javascript
const getFieldsForRole = (role) => {
    switch (role) {
        case "student":
            return ["parentName", "parentContact", "grade", "schoolName"];
        case "teacher":
            return [
                "qualification",
                "experience",
                "specialization",
                "department",
            ];
        case "admin":
            return ["department", "designation"];
    }
};
```

## Error Handling

-   `409`: Email/mobile already exists (any model)
-   `400`: Invalid role specified
-   `500`: Server error during registration

**Bottom Line**: Same endpoint, intelligent processing, role-based model creation! 🎉
