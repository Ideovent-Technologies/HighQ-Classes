# Middleware Components

This directory contains middleware functions for the HighQ Classes API.

## Authentication Middleware

Located in `authMiddleware.js`, these functions handle JWT authentication and authorization:

-   `protect` - Verifies JWT token and adds user data to request
-   `authenticate` - (Alias for protect, for backward compatibility)
-   `authorize` - Role-based authorization (admin, teacher, student)
-   `authorizeStudent` - Student-specific authorization to ensure they can only access their own resources
-   `authorizeTeacher` - Teacher-specific authorization for course and batch access

## Email Middleware

Located in `emailMiddleware.js`, these functions handle email operations:

-   `initializeEmailService` - Initializes the email service at application startup
-   `sendPasswordResetOTP` - Sends password reset OTP emails
-   `sendWelcomeEmail` - Sends welcome emails to newly registered users

## File Upload Middleware

### Express File Upload (Legacy)

Located in `fileUpload.js`, this middleware configures express-fileupload for handling file uploads:

-   `fileUpload` - Middleware function to enable file uploads

### Multer Upload (Recommended)

Located in `multerUpload.js`, these middleware functions handle file uploads using multer:

-   `uploadProfilePicture` - Handles profile picture uploads
-   `uploadMaterials` - Handles multiple file uploads for course materials
-   `uploadAssignment` - Handles assignment file uploads
-   `uploadRecording` - Handles video recording uploads
-   `handleMulterError` - Error handler for multer errors

## Error Middleware

Located in `errorMiddleware.js`, these functions handle error management:

-   `errorHandler` - Global error handler middleware
-   `notFound` - 404 not found middleware

## Validation Middleware

Located in `validateRequestBody.js`, these functions validate request bodies:

-   `validateUserRegistration` - Validates user registration data
-   `validateLogin` - Validates login data
-   `validateForgotPassword` - Validates forgot password requests
-   `validateResetPassword` - Validates reset password requests

## Security Middleware

Located in `securityMiddleware.js`, these functions handle security:

-   `sanitizeRequest` - Sanitizes request data to prevent NoSQL injection
-   `xssClean` - Cleans request data to prevent XSS attacks

## Role Middleware

Located in `roleMiddleware.js`, these functions handle role-specific middleware:

-   `checkAdminRole` - Checks if user has admin role
-   `checkTeacherRole` - Checks if user has teacher role
-   `checkStudentRole` - Checks if user has student role
