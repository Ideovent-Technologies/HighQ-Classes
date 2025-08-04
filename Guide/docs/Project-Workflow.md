# HighQ Classes - User Workflow Documentation

This document explains the functional flow of the HighQ Classes application from the user's perspective, starting with login and covering the different user experiences based on roles.

## 🔑 Authentication Flow

### 1. Login Process

```mermaid
flowchart TD
    %% Authentication Flow
    A[User visits login page] --> B{Account exists?}
    B -- Yes --> C[Enter credentials]
    B -- No --> D[Register new account]
    C --> E{Valid credentials?}
    E -- Yes --> F[Generate JWT token]
    E -- No --> G[Show error message]
    F --> H[Store token in HTTP-only cookie]
    H --> I{Determine user role}
    I -- Admin --> J[Redirect to Admin Dashboard]
    I -- Teacher --> K[Redirect to Teacher Dashboard]
    I -- Student --> L[Redirect to Student Dashboard]
    D --> M[Fill registration form]
    M --> N[Submit for approval]
    N --> O[Admin approves]
    O --> C

    %% Admin User Flow
    J --> AD1[View Dashboard]
    AD1 --> AD2[Student Management]
    AD1 --> AD3[Teacher Management]
    AD1 --> AD4[Course/Batch Management]
    AD1 --> AD5[Fee Management]
    AD1 --> AD6[Notice Management]
    AD1 --> AD7[Study Materials]

    %% Admin - Student Management
    AD2 --> AD2_1[View Students]
    AD2 --> AD2_2[Add/Edit Students]
    AD2 --> AD2_3[Assign to Batch]
    AD2 --> AD2_4[View Attendance]
    AD2 --> AD2_5[View Fee Status]

    %% Admin - Course/Batch Management
    AD4 --> AD4_1[Create/Edit Courses]
    AD4 --> AD4_2[Create/Edit Batches]
    AD4 --> AD4_3[Assign Teachers]
    AD4 --> AD4_4[Set Schedule]
    AD4_2 --> AD4_5[Manage Students in Batch]

    %% Teacher User Flow
    K --> TD1[View Dashboard]
    TD1 --> TD2[View Assigned Batches]
    TD1 --> TD3[Manage Study Materials]
    TD1 --> TD4[Create Notices]
    TD1 --> TD5[Take Attendance]

    %% Teacher - Batch Management
    TD2 --> TD2_1[View Batch Details]
    TD2 --> TD2_2[View Student List]
    TD2 --> TD2_3[Record Attendance]
    TD2 --> TD2_4[Upload Class Materials]

    %% Student User Flow
    L --> SD1[View Dashboard]
    SD1 --> SD2[View Profile]
    SD1 --> SD3[Access Courses]
    SD1 --> SD4[View Fee Status]
    SD1 --> SD5[Access Study Materials]

    %% Student - Course Access
    SD3 --> SD3_1[View Enrolled Courses]
    SD3 --> SD3_2[Access Course Materials]
    SD3 --> SD3_3[Check Attendance]
    SD3 --> SD3_4[View Schedule]

    %% Fee Management Flow
    AD5 --> FM1[Set Fee Structure]
    FM1 --> FM2[Generate Fee Records]
    FM2 --> FM3[Send Reminders]
    FM3 --> FM4[Record Payments]
    FM4 --> FM5[Generate Receipts]
    SD4 --> FM6[View Payment History]
    FM4 --> FM6

    %% Study Materials Flow
    AD7 --> SM1[Upload Materials]
    TD3 --> SM1
    SM1 --> SM2[Organize by Course/Batch]
    SM2 --> SM3[Set Access Permissions]
    SM3 --> SD5

    %% Notifications Flow
    AD6 --> N1[Create Notice]
    TD4 --> N1
    N1 --> N2[Assign Recipients]
    N2 --> N3[Publish/Schedule]
    N3 --> N4[Notify Users]
    N4 --> AD1
    N4 --> TD1
    N4 --> SD1
```

1. User navigates to the login page (`/login`)
2. Enters email and password
3. System validates credentials against the database
4. Upon successful login:
    - JWT token is generated with user role and expiry time
    - Token is stored in HTTP-only cookie
    - User is redirected to appropriate dashboard based on role

### 2. Registration Process

1. New user clicks "Register" on the login page
2. Fills out registration form with:
    - Personal details (name, email, phone)
    - Password (securely hashed on submission)
    - Role selection (if applicable, or defaulted to Student)
3. For students:
    - Additional fields for course/batch interests
4. For teachers:
    - Qualifications, specializations, experience
5. Submission creates a "pending" account
6. Admin approves the registration
7. User receives confirmation email with login instructions

### 3. Password Reset

1. User clicks "Forgot Password" on login page
2. Enters registered email address
3. System sends password reset OTP to email
4. User enters OTP and creates new password
5. Password is securely updated in database

## 👑 Admin User Experience

### 1. Dashboard Overview

```mermaid
flowchart LR
    A[Admin Dashboard] --> B[Student Management]
    A --> C[Teacher Management]
    A --> D[Course/Batch Management]
    A --> E[Fee Management]
    A --> F[Notice Management]
    A --> G[Study Materials]
    A --> H[System Settings]
```

After login, admin sees:

-   Overview statistics (total students, teachers, courses, batches)
-   Recent activity feed
-   Important notices
-   Quick action buttons

### 2. Student Management

1. View complete student list with filters and search
2. Add new student:
    - Create user account
    - Assign to batch(es)
    - Set fee structure
3. Edit student details:
    - Personal information
    - Batch assignments
    - Fee adjustments
4. View student profiles:
    - Attendance records
    - Fee payment history
    - Academic performance
5. Remove student (deactivate account)

### 3. Teacher Management

1. View all teachers with filters
2. Add new teacher:
    - Create user account
    - Set qualifications and specializations
    - Assign to courses/batches
3. Edit teacher details:
    - Contact information
    - Course/batch assignments
4. View teacher performance:
    - Student feedback
    - Attendance records
    - Class completions
5. Remove teacher (deactivate account)

### 4. Course/Batch Management

1. Create new courses:
    - Course details (name, description, duration)
    - Set fee structure
    - Define syllabus
2. Create batches for courses:
    - Schedule (days, times)
    - Assign teacher
    - Set start/end dates
3. Manage existing courses/batches:
    - Update details
    - Add/remove students
    - Change teacher assignments

### 5. Fee Management

1. Set fee structures for courses
2. View fee collection status:
    - By student
    - By batch
    - By month/period
3. Generate fee reminders
4. Record fee payments
5. Generate receipts and reports

### 6. Notice Management

1. Create announcements for:
    - All users
    - Specific roles
    - Specific batches
2. Edit/delete notices
3. Schedule notices for future posting
4. View notice read statistics

### 7. Study Materials

1. Upload study materials:
    - Documents (PDF)
    - Images
    - Videos
    - Links to external resources
2. Assign materials to:
    - Specific courses
    - Specific batches
    - Specific students
3. Organize materials by category/subject
4. Monitor usage statistics

## 👨‍🏫 Teacher User Experience

### 1. Dashboard Overview

After login, teachers see:

-   Their assigned batches
-   Today's schedule
-   Recent notices
-   Student attendance overview

### 2. Batch Management

1. View assigned batches
2. Access batch details:
    - Student list
    - Schedule
    - Course content
3. Record student attendance
4. View attendance history

### 3. Study Materials

1. View existing study materials for assigned courses
2. Upload new study materials for their batches
3. Organize materials by topic/session
4. Monitor student engagement with materials

### 4. Notice Creation

1. Create notices for:
    - All their students
    - Specific batches
    - Individual students
2. Edit/delete their notices
3. Schedule notices for future posting

### 5. Class Recordings

1. Upload class recordings
2. Organize by date and topic
3. Make available to students for limited time (3 days)
4. Monitor viewing statistics

## 👨‍🎓 Student User Experience

### 1. Dashboard Overview

After login, students see:

-   Their batch details
-   Upcoming classes
-   Recent notices
-   Fee payment status
-   Recent study materials

### 2. Profile Management

1. View personal details
2. Update contact information
3. Change password
4. Upload profile picture

### 3. Course Access

1. View enrolled courses
2. Access course materials:
    - Class notes
    - Study resources
    - Assignments
3. View attendance record
4. Check upcoming classes

### 4. Fee Management

1. View fee structure
2. Check payment history
3. See payment due dates
4. Download fee receipts

### 5. Study Materials

1. Browse available study materials
2. Download/view resources
3. Access class recordings (last 3 days)
4. Search for specific topics

## 📱 Mobile Responsiveness

All interfaces adapt to different screen sizes:

1. **Desktop View**: Full functionality with expanded layouts
2. **Tablet View**: Optimized layouts with collapsible sections
3. **Mobile View**:
    - Simplified navigation with hamburger menu
    - Prioritized information
    - Touch-friendly buttons and inputs
    - Stackable content blocks

## 🔄 Data Flow Architecture

```mermaid
flowchart TD
    A[Client Browser/App] <-->|HTTP/HTTPS Requests| B[Express.js Server]
    B <-->|Authentication| C[JWT Auth Middleware]
    B <-->|Database Operations| D[MongoDB]
    B <-->|File Operations| E[Cloudinary]
    C --> F[Role-Based Access Control]
    F --> G{User Role}
    G --> H[Admin Routes]
    G --> I[Teacher Routes]
    G --> J[Student Routes]
```

1. Client makes authenticated requests to backend API
2. JWT middleware validates token and extracts user info
3. Role middleware checks permissions for the requested resource
4. Controllers process the request and interact with the database
5. Data is returned to client with appropriate formatting
6. File uploads are processed through Cloudinary

## 🔐 Security Implementation

1. **Authentication**: JWT-based with proper expiration
2. **Authorization**: Role-based access control
3. **Data Protection**:
    - Password hashing with bcrypt
    - Sensitive data encryption
    - HTTPS for all communications
4. **Input Validation**:
    - Server-side validation with express-validator
    - Client-side validation for user experience
5. **File Security**:
    - Type validation
    - Size limits
    - Secure storage with Cloudinary
6. **API Protection**:
    - Rate limiting
    - CORS configuration
    - Helmet.js security headers
