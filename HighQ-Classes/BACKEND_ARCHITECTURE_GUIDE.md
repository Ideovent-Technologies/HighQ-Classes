# 🏫 HighQ Classes Backend Architecture Guide

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture & Design](#architecture--design)
3. [User Role Ecosystem](#user-role-ecosystem)
4. [Authentication & Security](#authentication--security)
5. [Data Flow & Interactions](#data-flow--interactions)
6. [Module Breakdown](#module-breakdown)
7. [Role-Based Workflows](#role-based-workflows)
8. [API Integration Patterns](#api-integration-patterns)
9. [Security & Permissions](#security--permissions)
10. [Practical Use Cases](#practical-use-cases)

---

## 🎯 System Overview

### What is HighQ Classes?

HighQ Classes is a comprehensive **Learning Management System (LMS)** backend that manages educational institutions with three distinct user roles working together in a structured ecosystem.

### Core Philosophy

-   **Role-Based Access Control**: Each user type has specific permissions and capabilities
-   **Data Isolation**: Separate models for Students, Teachers, and Admins with secure cross-references
-   **Workflow Integration**: Seamless interactions between different user roles
-   **Educational Focus**: Designed specifically for educational institutions and tutoring centers

### Key Statistics

-   **68 API Endpoints** across 13 modules
-   **3 User Roles** with distinct capabilities
-   **JWT Authentication** with role-based authorization
-   **File Upload Support** for materials, recordings, and assignments
-   **Real-time Notifications** and scheduling

---

## 🏗️ Architecture & Design

### 🔧 Technical Stack

```
Backend Framework: Node.js + Express.js
Database: MongoDB with Mongoose ODM
Authentication: JWT (JSON Web Tokens)
File Storage: Cloudinary
Email Service: NodeMailer
Scheduling: Node-Cron
Security: Bcrypt, Helmet, CORS
```

### 📁 Database Models

```
┌─────────────────┬─────────────────┬─────────────────┐
│     STUDENTS    │     TEACHERS    │     ADMINS      │
├─────────────────┼─────────────────┼─────────────────┤
│ • Profile Data  │ • Profile Data  │ • Profile Data  │
│ • Parent Info   │ • Qualification │ • Department    │
│ • Batch Assign  │ • Specialization│ • Full Access   │
│ • Enrollment    │ • Experience    │ • User Mgmt     │
└─────────────────┴─────────────────┴─────────────────┘
           │                │                │
           └────────────────┼────────────────┘
                           │
┌─────────────────────────────────────────────────────┐
│              SHARED RESOURCES                       │
├─────────────────────────────────────────────────────┤
│ • Courses      • Batches       • Materials         │
│ • Schedules    • Attendance    • Notices           │
│ • Assignments  • Recordings    • Fees              │
└─────────────────────────────────────────────────────┘
```

### 🔗 Relationship Model

```
ADMIN creates/manages → COURSES → contain → BATCHES
   ↓                      ↓          ↓
TEACHERS assigned to → SUBJECTS → taught in → BATCHES
   ↓                      ↓          ↓
STUDENTS enrolled in → COURSES → grouped in → BATCHES
```

---

## 👥 User Role Ecosystem

### 🎓 **STUDENT** - The Learner

**Primary Goal**: Access educational content and track academic progress

**Core Capabilities**:

-   📚 **Learning Access**: View materials, recordings, assignments
-   📊 **Progress Tracking**: Monitor attendance, grades, performance
-   📝 **Assignment Submission**: Submit homework and projects
-   💬 **Communication**: Receive notices from teachers/admins
-   💰 **Fee Management**: Check fee status and payment history
-   👤 **Profile Management**: Update personal information

**API Access Pattern**:

```
Student Authentication → Dashboard → Batch-Specific Content
├── Materials (Read Only)
├── Recordings (View Only)
├── Assignments (Submit)
├── Attendance (View Only)
├── Notices (Receive)
└── Fee Status (View Only)
```

### 👨‍🏫 **TEACHER** - The Educator

**Primary Goal**: Deliver education and manage student learning

**Core Capabilities**:

-   📚 **Content Creation**: Upload materials, create assignments
-   🎥 **Recording Management**: Upload and manage video lectures
-   📋 **Batch Management**: Oversee assigned student groups
-   ✅ **Attendance Tracking**: Mark student attendance
-   📢 **Communication**: Send notices to students
-   📊 **Performance Monitoring**: Grade assignments, track progress
-   📅 **Schedule Management**: Create and manage class schedules

**API Access Pattern**:

```
Teacher Authentication → Dashboard → Batch-Specific Management
├── Materials (Create, Update, Delete)
├── Recordings (Upload, Manage)
├── Assignments (Create, Grade)
├── Attendance (Mark, View)
├── Notices (Create, Manage)
├── Students (View, Track)
└── Schedules (Create, Manage)
```

### 👑 **ADMIN** - The System Manager

**Primary Goal**: Oversee entire system and manage all users

**Core Capabilities**:

-   🏢 **System Management**: Full platform oversight
-   👥 **User Management**: Create, update, delete all user types
-   🎓 **Course Management**: Create courses and batch structures
-   💰 **Financial Management**: Handle fees and payments
-   📊 **Analytics & Reporting**: System-wide insights
-   🔧 **Configuration**: System settings and announcements
-   🔐 **Security**: User approvals and access control

**API Access Pattern**:

```
Admin Authentication → Full System Access
├── Users (All CRUD operations)
├── Courses (Create, Manage)
├── Batches (Create, Assign)
├── Fees (Create, Monitor)
├── Analytics (System-wide)
├── Announcements (Broadcast)
└── Security (Approvals, Access)
```

---

## 🔐 Authentication & Security

### 🛡️ Security Architecture

```
Registration → Admin Approval → Account Activation → JWT Login
     ↓              ↓               ↓              ↓
  Pending → Admin Reviews → Active Status → Role-based Access
```

### 🔑 Authentication Flow

1. **Registration**: User submits role-specific information
2. **Approval**: Admin reviews and approves new accounts
3. **Login**: Validated users receive JWT tokens
4. **Authorization**: Each request validates role permissions
5. **Session Management**: Secure token refresh and logout

### 🎭 Role-Based Authorization Matrix

```
┌─────────────────┬─────────┬─────────┬─────────┐
│     Resource    │ Student │ Teacher │  Admin  │
├─────────────────┼─────────┼─────────┼─────────┤
│ Own Profile     │   R/W   │   R/W   │   R/W   │
│ Other Profiles  │    -    │    R    │  R/W/D  │
│ Course Content  │    R    │   R/W   │  R/W/D  │
│ Assignments     │   R/S   │  R/W/G  │  R/W/D  │
│ Attendance      │    R    │   R/W   │  R/W/D  │
│ Fee Records     │    R    │    R    │  R/W/D  │
│ System Settings │    -    │    -    │  R/W/D  │
└─────────────────┴─────────┴─────────┴─────────┘
Legend: R=Read, W=Write, D=Delete, S=Submit, G=Grade
```

---

## 🔄 Data Flow & Interactions

### 📊 How Roles Interact

#### **1. Course Creation Flow**

```
ADMIN creates Course → ADMIN creates Batches → ADMIN assigns TEACHER
    ↓                      ↓                       ↓
ADMIN enrolls STUDENTS → TEACHER uploads Materials → STUDENTS access Content
```

#### **2. Learning Content Flow**

```
TEACHER uploads Material → SYSTEM processes → STUDENTS in same BATCH access
TEACHER creates Assignment → STUDENTS submit → TEACHER grades → STUDENTS see results
TEACHER records video → ADMIN/TEACHER uploads → STUDENTS watch with analytics
```

#### **3. Communication Flow**

```
TEACHER creates Notice → SYSTEM delivers to → STUDENTS in target BATCH/COURSE
ADMIN creates Announcement → SYSTEM broadcasts → ALL USERS receive notification
```

#### **4. Assessment Flow**

```
TEACHER creates Assignment → STUDENTS submit solutions → TEACHER evaluates and grades
TEACHER marks Attendance → SYSTEM calculates percentage → STUDENTS view records
```

### 🔗 Cross-Role Dependencies

#### **Student Dependencies**

-   **Depends on Admin**: Course enrollment, fee setup, account approval
-   **Depends on Teacher**: Content delivery, assignment grading, attendance marking
-   **Provides to System**: Engagement data, submission content, fee payments

#### **Teacher Dependencies**

-   **Depends on Admin**: Batch assignments, course access, resource allocation
-   **Depends on Students**: Assignment submissions, attendance participation
-   **Provides to System**: Educational content, assessments, progress tracking

#### **Admin Dependencies**

-   **Depends on Teachers**: Content creation, student engagement, progress reports
-   **Depends on Students**: Fee payments, course completion, system usage
-   **Provides to System**: Infrastructure, user management, system configuration

---

## 📚 Module Breakdown

### 🎓 **Course & Batch Management**

**Purpose**: Organize educational structure

**Admin Creates**:

```json
Course: {
  "name": "Advanced Physics",
  "description": "Complete physics curriculum",
  "duration": "6 months",
  "fee": 15000
}
```

**Admin Creates Batches**:

```json
Batch: {
  "name": "Physics Batch A",
  "course": "courseId",
  "teacher": "teacherId",
  "schedule": "Mon-Wed-Fri 10:00-12:00",
  "maxStudents": 30
}
```

**Students Get Assigned**: Admin enrolls students into specific batches

### 📚 **Material Management**

**Purpose**: Educational content distribution

**Teacher Workflow**:

1. Upload materials (PDFs, documents, presentations)
2. Categorize content (notes, assignments, references)
3. Assign to specific batches
4. Track download/view analytics

**Student Experience**:

1. Access materials for their assigned batch
2. Download or view content
3. System tracks engagement

**Technical Implementation**:

```javascript
// Teacher uploads material
POST /api/materials
{
  file: <document>,
  title: "Chapter 1 - Mechanics",
  batch: "batchId",
  category: "notes"
}

// Student accesses materials
GET /api/materials/student
// Returns materials for student's batch
```

### 🎥 **Recording Management**

**Purpose**: Video-based learning delivery

**Teacher Workflow**:

1. Upload video lectures to Cloudinary
2. Set access permissions and expiry dates
3. Track student viewing analytics
4. Manage video library

**Student Experience**:

1. Stream videos assigned to their batch
2. Track viewing progress
3. Access within permitted timeframe

**Analytics Provided**:

-   View counts per video
-   Student engagement metrics
-   Popular content identification
-   Subject-wise distribution

### 📝 **Assignment Management**

**Purpose**: Assessment and homework system

**Complete Assignment Lifecycle**:

```
TEACHER creates Assignment → STUDENTS submit solutions → TEACHER grades → STUDENTS view feedback
```

**Teacher Capabilities**:

-   Create assignments with due dates
-   Attach instruction files
-   Set maximum marks
-   Grade submissions
-   Provide feedback

**Student Capabilities**:

-   View assigned homework
-   Submit solutions (file uploads)
-   Track submission status
-   Receive grades and feedback

### ✅ **Attendance Management**

**Purpose**: Track student participation

**Teacher Workflow**:

1. Mark attendance for scheduled classes
2. Record present/absent/late status
3. Add optional notes
4. Generate attendance reports

**Student Benefits**:

1. View attendance history
2. Track attendance percentage
3. Receive alerts for low attendance

**Admin Oversight**:

-   Monitor attendance trends
-   Generate institutional reports
-   Track teacher compliance

### 📢 **Notice Management**

**Purpose**: Communication and announcements

**Communication Hierarchy**:

```
ADMIN Announcements → ALL USERS (system-wide)
TEACHER Notices → SPECIFIC BATCHES/COURSES
AUTOMATED Notifications → RELEVANT USERS (due dates, payments)
```

**Notice Types**:

-   **Batch-specific**: Class reschedules, assignment due dates
-   **Course-wide**: Exam schedules, curriculum updates
-   **Institution-wide**: Holiday announcements, policy changes
-   **Personal**: Fee dues, low attendance alerts

### 💰 **Fee Management**

**Purpose**: Financial tracking and payment processing

**Admin Workflow**:

1. Create fee structures for courses
2. Assign fees to enrolled students
3. Track payment status
4. Generate financial reports

**Student Experience**:

1. View fee breakdown
2. Check payment history
3. See pending amounts
4. Make online payments

**Payment Tracking**:

-   Partial payments supported
-   Payment method recording
-   Transaction ID tracking
-   Due date monitoring

---

## 🔄 Role-Based Workflows

### 👨‍🎓 **Student Daily Workflow**

#### **Morning Routine**:

```
1. Login to platform
2. Check dashboard for:
   - Today's schedule
   - New assignments
   - Pending notices
   - Fee reminders
3. Access study materials
4. Watch video lectures
```

#### **Assignment Submission**:

```
1. Navigate to assignments section
2. View assignment details and instructions
3. Download attached resources
4. Prepare solution
5. Upload submission file
6. Confirm submission before deadline
```

#### **Progress Monitoring**:

```
1. Check attendance percentage
2. Review graded assignments
3. Monitor overall performance
4. Track course completion status
```

### 👨‍🏫 **Teacher Daily Workflow**

#### **Class Preparation**:

```
1. Login and check dashboard
2. Review today's schedule
3. Upload class materials
4. Prepare assignment topics
5. Check student attendance from previous class
```

#### **Content Management**:

```
1. Upload new study materials
2. Create assignments with clear instructions
3. Record and upload video lectures
4. Send notices about class updates
```

#### **Student Assessment**:

```
1. Mark attendance for conducted classes
2. Grade submitted assignments
3. Provide detailed feedback
4. Monitor student progress
5. Identify struggling students
```

### 👑 **Admin Weekly Workflow**

#### **User Management**:

```
1. Review pending registrations
2. Approve new teacher/student accounts
3. Assign teachers to batches
4. Enroll students in appropriate courses
```

#### **System Oversight**:

```
1. Monitor platform usage analytics
2. Review fee payment status
3. Generate institutional reports
4. Handle user queries and issues
```

#### **Strategic Planning**:

```
1. Create new courses based on demand
2. Organize batches for optimal learning
3. Analyze teacher performance
4. Plan system improvements
```

---

## 🔌 API Integration Patterns

### 📡 **Authentication Pattern**

Every API request follows this pattern:

```javascript
// 1. Include JWT token in header
const headers = {
    Authorization: `Bearer ${jwtToken}`,
    "Content-Type": "application/json",
};

// 2. Backend validates token and extracts user info
middleware: (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    const user = jwt.verify(token, secret);
    req.user = user; // Contains role and ID
    next();
};

// 3. Role-based authorization check
authorize: (roles) => {
    return (req, res, next) => {
        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ error: "Access denied" });
        }
    };
};
```

### 📊 **Data Access Patterns**

#### **Student Data Access**:

```javascript
// Students can only access their own data
GET / api / student / dashboard;
// Backend automatically filters based on authenticated user ID

// Materials are filtered by student's batch
GET / api / materials / student;
// Returns only materials uploaded for student's assigned batch
```

#### **Teacher Data Access**:

```javascript
// Teachers access data for their assigned batches
GET /api/teacher/notices
// Returns notices created by this teacher

GET /api/assignments/batch/:batchId
// Only if teacher is assigned to this batch
```

#### **Admin Data Access**:

```javascript
// Admins have unrestricted access
GET / api / admin / students;
// Returns all students with filtering options

GET / api / admin / analytics;
// System-wide analytics and reports
```

### 🔄 **Real-time Updates**

```javascript
// Notice creation triggers notifications
POST /api/teacher/notices →
  Database Save →
  Notification Service →
  Target Students Notified

// Assignment grading updates student dashboard
PUT /api/assignments/:id/grade →
  Grade Saved →
  Student Dashboard Updated →
  Progress Recalculated
```

---

## 🛡️ Security & Permissions

### 🔐 **Multi-Layer Security**

#### **1. Authentication Layer**

```
User Registration → Admin Approval → Account Activation → JWT Token
```

#### **2. Authorization Layer**

```
JWT Validation → Role Extraction → Permission Check → Resource Access
```

#### **3. Data Protection Layer**

```
Input Validation → SQL Injection Prevention → XSS Protection → Rate Limiting
```

### 🎭 **Permission Matrix in Detail**

#### **Course & Batch Permissions**:

```
┌─────────────────┬─────────┬─────────┬─────────┐
│    Operation    │ Student │ Teacher │  Admin  │
├─────────────────┼─────────┼─────────┼─────────┤
│ View Courses    │ Enrolled│ Assigned│   All   │
│ Create Course   │    ❌   │    ❌   │   ✅    │
│ Modify Course   │    ❌   │    ❌   │   ✅    │
│ Delete Course   │    ❌   │    ❌   │   ✅    │
│ Join Batch      │ Admin   │ Admin   │   ✅    │
│ View Batch      │ Own Only│ Assigned│   All   │
└─────────────────┴─────────┴─────────┴─────────┘
```

#### **Content Permissions**:

```
┌─────────────────┬─────────┬─────────┬─────────┐
│    Content      │ Student │ Teacher │  Admin  │
├─────────────────┼─────────┼─────────┼─────────┤
│ Upload Material │    ❌   │ Batches │   All   │
│ View Material   │ Batch   │ Created │   All   │
│ Delete Material │    ❌   │ Own     │   All   │
│ Upload Video    │    ❌   │ Batches │   All   │
│ Watch Video     │ Allowed │ Created │   All   │
│ Create Notice   │    ❌   │ Batches │   All   │
│ View Notice     │ Target  │ Created │   All   │
└─────────────────┴─────────┴─────────┴─────────┘
```

### 🔒 **Data Isolation**

```javascript
// Student can only see their own profile
GET /api/student/:id/profile
// Backend checks: req.params.id === req.user.id

// Teacher can only grade assignments from their batches
PUT /api/assignments/:id/grade
// Backend checks: assignment.batch in teacher.assignedBatches

// Admin has unrestricted access with audit logging
DELETE /api/user/:id
// Backend logs: admin.id performed DELETE on user.id
```

---

## 🎯 Practical Use Cases

### 📚 **Use Case 1: New Course Launch**

#### **Step 1: Admin Creates Course Structure**

```javascript
// Admin creates the course
POST /api/course
{
  "name": "Advanced Chemistry",
  "description": "Complete chemistry for grade 12",
  "duration": "8 months",
  "fee": 18000
}

// Admin creates batches for the course
POST /api/batch
{
  "name": "Chemistry Batch A",
  "courseId": "courseId",
  "maxStudents": 25,
  "schedule": "Tue-Thu-Sat 9:00-11:00"
}
```

#### **Step 2: Admin Assigns Teacher**

```javascript
// Admin assigns qualified teacher to batch
PUT /api/batch/batchId
{
  "teacherId": "chemistryTeacherId"
}
```

#### **Step 3: Students Enroll**

```javascript
// Admin enrolls students into the batch
POST /api/batch/batchId/students
{
  "studentIds": ["student1", "student2", "student3"]
}
```

#### **Result**: Complete course ecosystem ready for learning

### 📝 **Use Case 2: Assignment Lifecycle**

#### **Step 1: Teacher Creates Assignment**

```javascript
POST /api/assignments
{
  "name": "Chemical Bonding Problems",
  "description": "Solve the attached 10 problems",
  "batchId": "chemistryBatchA",
  "dueDate": "2025-01-20",
  "maxMarks": 50,
  "attachments": ["problem_set.pdf"]
}
```

#### **Step 2: Students Submit Solutions**

```javascript
// Each student submits their work
POST /api/assignments/assignmentId/submit
{
  "submission": "solution.pdf",
  "comments": "Completed all problems as instructed"
}
```

#### **Step 3: Teacher Grades Submissions**

```javascript
// Teacher evaluates each submission
PUT /api/assignments/assignmentId/submissions/submissionId/grade
{
  "marks": 45,
  "feedback": "Excellent work! Minor error in problem 7.",
  "gradedAt": "2025-01-22T10:30:00Z"
}
```

#### **Step 4: Students View Results**

```javascript
// Students check their grades
GET / api / assignments / assignmentId;
// Response includes grades and feedback
```

### 🎥 **Use Case 3: Video Lecture Distribution**

#### **Step 1: Teacher Uploads Lecture**

```javascript
POST /api/recordings
{
  "file": "lecture_video.mp4",
  "name": "Chemical Bonding - Part 1",
  "description": "Introduction to ionic and covalent bonds",
  "batchId": "chemistryBatchA",
  "subject": "Chemistry",
  "duration": "45 minutes"
}
```

#### **Step 2: System Processes Video**

```javascript
// Backend handles:
// - Upload to Cloudinary
// - Generate thumbnail
// - Set access permissions
// - Notify students
```

#### **Step 3: Students Access Video**

```javascript
// Students view available recordings
GET / api / recordings / student;
// Returns videos accessible to their batch

// Students watch video
GET / api / recordings / recordingId;
// System tracks view analytics
```

#### **Step 4: Analytics Collection**

```javascript
// Teacher views engagement data
GET / api / recordings / recordingId / analytics;
// Response includes view counts, engagement metrics
```

### 💰 **Use Case 4: Fee Management Process**

#### **Step 1: Admin Sets Up Fee Structure**

```javascript
POST /api/fee
{
  "studentId": "student123",
  "courseId": "advancedChemistry",
  "amount": 18000,
  "dueDate": "2025-02-01",
  "description": "Course fee for Advanced Chemistry",
  "type": "course"
}
```

#### **Step 2: Student Views Fee Details**

```javascript
GET / api / fee / student / student123;
// Returns all fee records for the student
```

#### **Step 3: Student Makes Payment**

```javascript
POST /api/fee/feeId/pay
{
  "amount": 9000,
  "paymentMethod": "online",
  "transactionId": "TXN789012"
}
```

#### **Step 4: Admin Monitors Payments**

```javascript
GET /api/fee?status=partial
// Returns all partially paid fees for follow-up
```

---

## 🎉 Summary

### 🏗️ **System Strengths**

1. **Role-Based Architecture**: Clear separation of responsibilities
2. **Secure Authentication**: Multi-layer security with JWT
3. **Comprehensive Coverage**: Complete educational workflow support
4. **Scalable Design**: Modular structure for easy expansion
5. **Real-time Analytics**: Detailed tracking and reporting
6. **File Management**: Robust support for educational content

### 🔄 **How Roles Work Together**

-   **Admins** create the foundation (courses, batches, user management)
-   **Teachers** deliver education (content, assignments, assessment)
-   **Students** engage with learning (access content, submit work, track progress)

### 🚀 **Key Benefits**

-   **For Institutions**: Complete management solution
-   **For Teachers**: Streamlined content delivery and assessment
-   **For Students**: Centralized learning experience
-   **For Admins**: Comprehensive oversight and control

This backend system provides a robust foundation for educational institutions to digitize their operations while maintaining clear role boundaries and secure data access patterns.
