# 📚 HighQ Classes - Server Documentation

This directory contains comprehensive documentation for the HighQ Classes backend API.

## 📖 Documentation Index

### Core Documentation

-   **[🚨 MIGRATION NOTICE](./MIGRATION_NOTICE.md)** - ⚠️ **BREAKING CHANGES - Read First!**
-   **[Authentication Guide (NEW)](./AUTHENTICATION_GUIDE_NEW.md)** - ✅ **Updated for Independent Models**
-   **[Authentication Guide (OLD)](./AUTHENTICATION_GUIDE.md)** - ⚠️ **Deprecated - User-based system**
-   **[Auth Quick Reference](./AUTH_QUICK_REFERENCE.md)** - Quick reference for developers
-   **[API Documentation](../API_DOCUMENTATION.md)** - Complete API endpoint reference
-   **[Backend Summary](../BACKEND_SUMMARY.md)** - Implementation overview

### Module-Specific Guides

-   **[Authentication System (NEW)](./AUTHENTICATION_GUIDE_NEW.md)** - ✅ **Independent model authentication**
-   **[Authentication System (OLD)](./AUTHENTICATION_GUIDE.md)** - ⚠️ **Deprecated User-based system**
-   **[Middleware Guide](../middleware/README.md)** - All middleware components
-   **[Models Reference](./MODELS_REFERENCE.md)** - Database models documentation _(Coming Soon)_
-   **[Error Handling](./ERROR_HANDLING_GUIDE.md)** - Error management _(Coming Soon)_

## 🚀 Quick Start for New Developers

### 1. First, Read These (In Order):

1. [Backend Summary](../BACKEND_SUMMARY.md) - Understand the overall system
2. **[Authentication Guide (NEW)](./AUTHENTICATION_GUIDE_NEW.md)** - ✅ **Learn the NEW independent model system**
3. [Auth Quick Reference](./AUTH_QUICK_REFERENCE.md) - Quick implementation guide

### 2. For Frontend Developers:

-   Read the "Frontend Integration" section in **[Authentication Guide (NEW)](./AUTHENTICATION_GUIDE_NEW.md)**
-   Use [Auth Quick Reference](./AUTH_QUICK_REFERENCE.md) for common patterns
-   Check [API Documentation](../API_DOCUMENTATION.md) for endpoint details

### 3. For Backend Developers:

-   Review [Middleware Guide](../middleware/README.md) for available middleware
-   Use **[Authentication Guide (NEW)](./AUTHENTICATION_GUIDE_NEW.md)** for security implementation
-   Reference [API Documentation](../API_DOCUMENTATION.md) for endpoint structure

## 🚨 IMPORTANT: Architecture Update

**The authentication system has been completely refactored!**

### 🆕 NEW Independent Model Architecture (Current):

-   ✅ `Student.js` - Complete independent model with authentication + academic data
-   ✅ `Teacher.js` - Complete independent model with authentication + professional data
-   ✅ `Admin.js` - Complete independent model with authentication + administrative data
-   ✅ No complex relationships, direct model access, better performance

### ⚠️ OLD User-Based Architecture (Deprecated):

-   ❌ `User.js` + `Student.js` + `Teacher.js` + `Admin.js` with foreign key relationships
-   ❌ Complex joins, slower queries, "User profile not found" errors

**👉 All new development should use the [NEW Authentication Guide](./AUTHENTICATION_GUIDE_NEW.md)**

## 🔐 Authentication System Overview

The HighQ Classes authentication system provides:

### User Roles

-   **Admin**: Full system access and user management
-   **Teacher**: Course and batch management, student interaction
-   **Student**: Access to enrolled courses and personal data

### Security Features

-   JWT-based authentication with HTTP-only cookies
-   Role-based authorization (RBAC)
-   Account lockout after failed attempts
-   Password reset with OTP
-   Input validation and sanitization
-   XSS and NoSQL injection protection
-   Rate limiting on sensitive endpoints

### Key Components

```
Authentication System
├── Models (Student, Teacher, Admin - Independent)
├── Controllers (Auth operations)
├── Middleware (Security, validation, authorization)
├── Routes (Public and protected endpoints)
└── Utils (Email service, security helpers)
```

## 📋 Development Workflow

### Adding New Routes

1. Create controller function
2. Add appropriate middleware (protect, authorize, validate)
3. Define route in router file
4. Update API documentation
5. Write tests

### Example Route Implementation

```javascript
// 1. Controller
export const getTeacherCourses = async (req, res) => {
    try {
        // Direct access to Teacher model - no User reference needed
        const teacher = await Teacher.findById(req.user._id).populate(
            "courseIds"
        );
        res.json({ success: true, data: teacher.courseIds });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Route with middleware
router.get(
    "/courses",
    protect, // Authentication required
    authorize("teacher"), // Teacher role required
    validateTeacherAccess, // Custom validation
    getTeacherCourses // Controller
);
```

## 🛡️ Security Guidelines

### Authentication

-   Always use `protect` middleware for authenticated routes
-   Use `authorize` for role-based access control
-   Validate all input data with middleware
-   Handle errors consistently

### Data Protection

-   Never return passwords in API responses
-   Sanitize all user inputs
-   Use parameterized queries
-   Validate file uploads

### Frontend Integration

-   Always use `credentials: 'include'` in fetch requests
-   Implement proper error handling
-   Store user state securely
-   Handle token expiration gracefully

## 🧪 Testing Guidelines

### Unit Tests

-   Test individual functions and methods
-   Mock dependencies appropriately
-   Test error conditions
-   Verify security features

### Integration Tests

-   Test complete authentication flow
-   Test role-based access control
-   Test API endpoints end-to-end
-   Test middleware interactions

### Example Test Structure

```javascript
describe("Authentication", () => {
    describe("User Registration", () => {
        it("should register valid user");
        it("should reject invalid data");
        it("should prevent duplicate registration");
    });

    describe("User Login", () => {
        it("should login with valid credentials");
        it("should reject invalid credentials");
        it("should handle account lockout");
    });
});
```

## 📝 Documentation Standards

### Code Comments

```javascript
/**
 * Controller description
 * @desc    What this function does
 * @route   HTTP_METHOD /api/route/path
 * @access  Public/Private/Admin
 */
export const controllerFunction = async (req, res) => {
    // Implementation
};
```

### API Documentation Format

```markdown
#### Endpoint Name

\`\`\`http
METHOD /api/endpoint
Authorization: Bearer <token>
Content-Type: application/json

{
"field": "value"
}
\`\`\`

Response:
\`\`\`json
{
"success": true,
"data": {}
}
\`\`\`
```

## 🔄 Common Patterns

### Error Handling

```javascript
try {
    // Operation
    res.status(200).json({ success: true, data: result });
} catch (error) {
    console.error("Operation error:", error);
    res.status(500).json({
        success: false,
        message: "Operation failed",
    });
}
```

### Validation Pattern

```javascript
// Middleware validation
export const validateInput = [
    body("field").notEmpty().withMessage("Field is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        next();
    },
];
```

### Authorization Pattern

```javascript
// Route protection
router.get(
    "/protected-route",
    protect, // Authentication
    authorize(["admin"]), // Authorization
    validateInput, // Validation
    controller // Business logic
);
```

## 📞 Support and Maintenance

### Getting Help

1. Check this documentation first
2. Review existing code patterns
3. Ask team lead for clarification
4. Update documentation when adding features

### Reporting Issues

-   Describe the problem clearly
-   Include steps to reproduce
-   Provide error messages and logs
-   Suggest potential solutions

### Contributing

-   Follow existing code patterns
-   Add appropriate tests
-   Update documentation
-   Review security implications

---

## 📁 File Structure

```
Server/
├── docs/                          # Documentation
│   ├── AUTHENTICATION_GUIDE.md    # Complete auth guide
│   ├── AUTH_QUICK_REFERENCE.md    # Quick reference
│   └── README.md                  # This file
├── controllers/                   # Business logic
├── middleware/                    # Request processing
├── models/                        # Database schemas
├── routes/                        # API endpoints
├── utils/                         # Helper functions
├── config/                        # Configuration files
├── API_DOCUMENTATION.md           # API reference
└── BACKEND_SUMMARY.md             # Implementation summary
```

---

**Last Updated**: July 2025  
**Maintained By**: HighQ Classes Development Team  
**Contact**: Authentication Module Lead - Avinash

## 🏗️ Current Architecture (Independent Models)

```
Independent Model Structure:
├── Student.js (Complete authentication + academic data)
├── Teacher.js (Complete authentication + professional data)
└── Admin.js (Complete authentication + administrative data)

Each model contains:
- Authentication fields (email, password, mobile, etc.)
- Role-specific data (parentName for students, qualification for teachers, etc.)
- Security methods (password hashing, JWT generation, login tracking)
```
