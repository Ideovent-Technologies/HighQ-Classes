# 🚀 Authentication Quick Reference - HighQ Classes

## Quick Setup Guide

### 1. Protect a Route

```javascript
import { protect, authorize } from "../middleware/authMiddleware.js";

// Any authenticated user
router.get("/protected", protect, controller);

// Admin only
router.get("/admin-only", protect, authorize("admin"), adminController);

// Multiple roles
router.get("/staff", protect, authorize(["admin", "teacher"]), staffController);
```

### 2. Create User (Admin)

```javascript
POST / api / admin / user;
Authorization: Bearer <
    admin_token >
    {
        name: "John Doe",
        email: "john@example.com",
        password: "SecurePass123",
        mobile: "1234567890",
        role: "teacher",
        qualification: "M.Sc Physics", // Required for teachers
        specialization: "Physics", // Required for teachers
    };
```

### 3. Frontend Auth Check

```javascript
// Check if user is authenticated
const checkAuth = async () => {
    try {
        const response = await fetch("/api/auth/me", {
            credentials: "include", // Important!
        });

        if (response.ok) {
            const user = await response.json();
            return user.data;
        }
    } catch (error) {
        return null;
    }
};
```

### 4. Role-Based Components

```javascript
const RoleBasedComponent = ({ allowedRoles, children }) => {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        return <AccessDenied />;
    }

    return children;
};

// Usage
<RoleBasedComponent allowedRoles={["admin"]}>
    <AdminPanel />
</RoleBasedComponent>;
```

## API Endpoints Cheat Sheet

### Public Routes

```bash
POST /api/auth/register     # Register new user
POST /api/auth/login        # Login user
POST /api/auth/forgot-password  # Request password reset
POST /api/auth/reset-password   # Reset password with OTP
```

### Protected Routes

```bash
GET  /api/auth/me           # Get current user
PUT  /api/auth/update-profile   # Update profile
PUT  /api/auth/change-password  # Change password
POST /api/auth/logout       # Logout user
```

### Admin Routes

```bash
GET  /api/admin/dashboard   # Admin dashboard
GET  /api/admin/students    # All students
GET  /api/admin/teachers    # All teachers
POST /api/admin/user        # Create user
PUT  /api/admin/user/:id    # Update user
DELETE /api/admin/user/:id  # Delete user
```

## Common Patterns

### 1. Check User Role in Controller

```javascript
export const someController = async (req, res) => {
    const { user } = req; // Added by protect middleware

    if (user.role === "admin") {
        // Admin logic
    } else if (user.role === "teacher") {
        // Teacher logic
    } else {
        // Student logic
    }
};
```

### 2. Get User's Profile Data

```javascript
// User data is directly available from req.user (loaded by protect middleware)
export const getProfile = async (req, res) => {
    const user = req.user; // Direct access to Student/Teacher/Admin document

    // All role-specific fields are available:
    if (user.role === "student") {
        console.log(user.parentName, user.grade, user.schoolName);
    } else if (user.role === "teacher") {
        console.log(user.qualification, user.experience, user.department);
    } else if (user.role === "admin") {
        console.log(user.employeeId, user.permissions, user.department);
    }

    res.json({ success: true, data: user });
};
```

### 3. Frontend Login Function

```javascript
const login = async (email, password) => {
    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (data.success) {
            // Redirect based on role
            switch (data.data.role) {
                case "admin":
                    navigate("/admin/dashboard");
                    break;
                case "teacher":
                    navigate("/teacher/dashboard");
                    break;
                case "student":
                    navigate("/student/dashboard");
                    break;
            }
        }

        return data;
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Login failed" };
    }
};
```

## Error Handling

### Backend Error Response

```javascript
// Validation error
return res.status(400).json({
    success: false,
    message: "Validation failed",
    errors: [{ param: "email", msg: "Invalid email" }],
});

// Authentication error
return res.status(401).json({
    success: false,
    message: "Invalid credentials",
});

// Authorization error
return res.status(403).json({
    success: false,
    message: "Access denied. Admin role required.",
});
```

### Frontend Error Handling

```javascript
const handleApiError = (error) => {
    if (error.status === 401) {
        // Redirect to login
        navigate("/login");
    } else if (error.status === 403) {
        // Show access denied
        toast.error("Access denied");
    } else {
        // Show generic error
        toast.error("Something went wrong");
    }
};
```

## Security Checklist

### For Routes

-   [ ] Use `protect` middleware for authenticated routes
-   [ ] Use `authorize` middleware for role-based routes
-   [ ] Add input validation with `validateRequestBody`
-   [ ] Handle errors properly

### For Frontend

-   [ ] Always use `credentials: 'include'` in fetch
-   [ ] Implement role-based route protection
-   [ ] Handle authentication errors
-   [ ] Clear user state on logout

### For Testing

-   [ ] Test with different user roles
-   [ ] Test authentication failure scenarios
-   [ ] Test authorization edge cases
-   [ ] Test input validation

## Debugging Tips

### 1. Check Token in Browser

```javascript
// In browser console
document.cookie.split(";").find((c) => c.includes("authToken"));
```

### 2. Debug User Object

```javascript
// In controller
console.log("Current user:", req.user);
console.log("User role:", req.user.role);
```

### 3. Test API with curl

```bash
# Login and get cookie
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}' \
  -c cookies.txt

# Use cookie for authenticated request
curl -X GET http://localhost:5000/api/auth/me \
  -b cookies.txt
```

## Environment Variables

```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
MONGO_URI=mongodb://localhost:27017/highq-classes
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

## User Roles & Permissions

| Role        | Can Access               | Can Manage                            |
| ----------- | ------------------------ | ------------------------------------- |
| **Admin**   | Everything               | Users, Courses, Batches, Fees, System |
| **Teacher** | Assigned batches/courses | Materials, Attendance, Grades         |
| **Student** | Own profile/courses      | Own profile only                      |

## Common User Status Values

-   `pending` - Waiting for admin approval
-   `active` - Can login and use system
-   `suspended` - Temporarily blocked

---

**Need help?** Check the full [Authentication Guide](./AUTHENTICATION_GUIDE.md) or contact the auth module maintainer.
