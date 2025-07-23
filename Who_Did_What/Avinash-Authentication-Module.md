# Authentication Module - Implemented by Avinash

## Overview

This document outlines the authentication system implementation for the HighQ Classes project. The authentication module provides a secure foundation for user management, including registration, login, role-based access control, and password management.

## Features Implemented

### 1. User Authentication

-   **Registration**: Secure user registration with data validation
-   **Login**: JWT-based authentication with HTTP-only cookies
-   **Logout**: Secure session termination
-   **Role-Based Access Control**: Different access levels for admin, teacher, and student roles

### 2. Security Features

-   **Password Hashing**: Secure password storage using bcrypt
-   **Account Lockout**: Temporary lockout after multiple failed login attempts
-   **Rate Limiting**: Protection against brute force attacks
-   **JWT Authentication**: Secure token-based authentication
-   **HTTP-Only Cookies**: Prevents XSS attacks on authentication tokens
-   **Input Sanitization**: Prevention of NoSQL injection and XSS attacks

### 3. User Profile Management

-   **Profile Viewing**: Endpoint to retrieve user profile data
-   **Profile Updates**: Ability to update profile information
-   **Password Changes**: Secure password change functionality

### 4. Password Reset Flow

-   **Forgot Password**: Email-based password reset with OTP
-   **OTP Verification**: Time-limited OTP for password resets
-   **Password Reset**: Secure password reset functionality

## Files Created/Modified

### Core Authentication Files

1. **User Model** (`models/User.js`)

    - Defined schema for user data
    - Implemented password hashing
    - Added methods for authentication, token generation, and password management

2. **Authentication Controller** (`controllers/authController.js`)

    - Implemented register, login, and logout functionality
    - Added profile management endpoints
    - Created password reset flow with OTP

3. **Authentication Middleware** (`middleware/authMiddleware.js`)

    - Created route protection middleware
    - Implemented role-based authorization
    - Added token verification and validation

4. **Authentication Routes** (`routes/authRoutes.js`)
    - Defined API endpoints for authentication
    - Set up protected and public routes
    - Organized endpoints by functionality

### Configuration and Setup

1. **Environment Configuration** (`config/config.env`)

    - Set up environment variables for security settings
    - Configured MongoDB connection details
    - Added JWT secret and expiration settings

2. **Server Configuration** (`server.js`)

    - Implemented security middleware
    - Set up route mounting
    - Added error handling

3. **Package Dependencies** (`package.json`)
    - Added required security packages
    - Included authentication libraries
    - Updated development dependencies

## API Endpoints

### Public Routes

-   **POST /api/auth/register** - Register a new user
-   **POST /api/auth/login** - Authenticate a user
-   **POST /api/auth/forgot-password** - Request password reset (OTP)
-   **POST /api/auth/reset-password/:resetToken** - Reset password with OTP

### Protected Routes

-   **GET /api/auth/me** - Get current user profile
-   **POST /api/auth/logout** - Logout and clear authentication
-   **PUT /api/auth/update-profile** - Update user profile information
-   **PUT /api/auth/change-password** - Change user password

## Security Implementations

### Data Protection

-   **Input Validation**: Using express-validator to validate user inputs
-   **Data Sanitization**: Implemented MongoDB sanitization and XSS prevention
-   **Security Headers**: Added Helmet middleware for secure HTTP headers

### Authentication Security

-   **Token Management**: JWT generation and verification
-   **Password Security**: Bcrypt hashing with salt rounds
-   **Failed Login Handling**: Account lockout after multiple failed attempts
-   **Session Management**: Secure cookie configuration

## Next Steps and Integration

-   Connect frontend authentication forms to the API
-   Implement unit and integration tests for authentication endpoints
-   Add comprehensive logging for security events
-   Integrate with user management dashboard

## Technical Documentation for Team Members

### Authentication Flow

#### Registration Process

1. Client sends POST request to `/api/auth/register` with user data
2. Server validates input data (name, email, password, mobile)
3. Server checks if email already exists
4. If email is unique, password is hashed using bcrypt
5. New user is created with 'pending' status
6. JWT token is generated and returned to client
7. User is stored in MongoDB with hashed password

#### Login Process

1. Client sends POST request to `/api/auth/login` with credentials
2. Server validates input data
3. Server checks if user exists and account status
4. Server verifies password using bcrypt
5. If valid, JWT token is generated
6. Token is sent in HTTP-only cookie and response body
7. User's lastLogin timestamp is updated

#### Password Reset Flow

1. User requests password reset via `/api/auth/forgot-password`
2. System generates 6-digit OTP and stores hashed version
3. OTP is sent to user's email with 10-minute expiry
4. User submits OTP and new password to `/api/auth/reset-password/:resetToken`
5. System verifies OTP and updates password

### Integration Guide

#### Frontend Authentication Integration

```javascript
// Example: Registration API Call
const registerUser = async (userData) => {
    try {
        const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        return await response.json();
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, message: "Failed to register" };
    }
};

// Example: Login API Call
const loginUser = async (credentials) => {
    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important for cookies
            body: JSON.stringify(credentials),
        });
        return await response.json();
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Failed to login" };
    }
};

// Example: Making authenticated requests
const getProtectedData = async () => {
    try {
        const response = await fetch("/api/auth/me", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Important for cookies
        });
        return await response.json();
    } catch (error) {
        console.error("Error fetching profile:", error);
        return { success: false, message: "Failed to fetch profile" };
    }
};
```

#### User Model Reference

```javascript
// User schema fields reference
{
  name: String,       // User's full name
  email: String,      // Unique email address
  password: String,   // Hashed password (not returned in queries)
  mobile: String,     // 10-digit mobile number
  role: String,       // 'admin', 'teacher', or 'student'
  profilePicture: String, // URL to profile image
  status: String,     // 'pending', 'active', or 'suspended'
  failedLoginAttempts: Number, // Count of consecutive failed logins
  lockoutUntil: Date, // Timestamp until account is locked
  resetPasswordToken: String, // For password reset
  resetPasswordOTP: String,   // Hashed OTP
  resetPasswordExpiry: Date,  // OTP expiry time
  lastLogin: Date,    // Last successful login
  createdAt: Date,    // Account creation timestamp
  updatedAt: Date     // Last update timestamp
}
```

### Request Payloads

#### Register User

```json
POST /api/auth/register
{
  "name": "Student Name",
  "email": "student@example.com",
  "password": "SecurePassword123",
  "mobile": "1234567890",
  "role": "student"
}
```

#### Login User

```json
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "SecurePassword123"
}
```

#### Forgot Password

```json
POST /api/auth/forgot-password
{
  "email": "student@example.com"
}
```

#### Reset Password

```json
POST /api/auth/reset-password/:resetToken
{
  "email": "student@example.com",
  "otp": "123456",
  "newPassword": "NewSecurePassword123"
}
```

#### Update Profile

```json
PUT /api/auth/update-profile
{
  "name": "Updated Name",
  "mobile": "9876543210",
  "profilePicture": "/images/profile.jpg"
}
```

#### Change Password

```json
PUT /api/auth/change-password
{
  "currentPassword": "CurrentSecurePassword123",
  "newPassword": "NewSecurePassword123"
}
```

### Error Handling

Authentication errors follow this structure:

```json
{
    "success": false,
    "message": "Error message explaining the issue",
    "errors": [
        {
            "param": "email",
            "msg": "Please provide a valid email"
        }
    ]
}
```

Common error codes:

-   400: Bad Request (validation errors)
-   401: Unauthorized (invalid credentials)
-   403: Forbidden (insufficient permissions)
-   404: Not Found (resource doesn't exist)
-   409: Conflict (resource already exists)
-   429: Too Many Requests (rate limit exceeded)
-   500: Server Error (unexpected issues)

### Middleware Usage

To protect routes in your module, import and use the auth middleware:

```javascript
import { protect, authorize } from "../middleware/authMiddleware.js";

// Protect a route (requires authentication)
router.get("/your-route", protect, yourController);

// Restrict to specific roles
router.get("/admin-only", protect, authorize("admin"), adminController);
```

---

_This authentication module provides a secure foundation for the HighQ Classes application, ensuring that user data is protected and access is properly controlled across the system._
