# HighQ Classes - Project Structure

## Frontend Structure (React + Vite + TypeScript + Shadcn UI)

```
HighQ-Classes/
├── public/
│   ├── favicon.ico
│   ├── robots.txt
│   └── placeholder.svg
├── src/
│   ├── assets/                      # Images, icons, and other static assets
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/                      # Shadcn UI components (already exists)
│   │   ├── common/                  # Common components used across the app
│   │   │   ├── Loader.tsx           # Loading spinner component
│   │   │   ├── ErrorBoundary.tsx    # Error handling component
│   │   │   ├── NotificationBadge.tsx
│   │   │   └── PageHeader.tsx       # Reusable page header
│   │   ├── Layout.tsx               # Main layout component (already exists)
│   │   ├── Navbar.tsx               # Navigation bar (already exists)
│   │   ├── Footer.tsx               # Footer component (already exists)
│   │   ├── auth/                    # Authentication related components
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── ForgotPasswordForm.tsx
│   │   ├── dashboard/              # Dashboard components (already exists)
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx        # Stat cards for dashboard
│   │   │   └── widgets/            # Dashboard widgets
│   │   │       ├── UpcomingClasses.tsx
│   │   │       ├── NoticeBoard.tsx
│   │   │       └── QuickActions.tsx
│   │   ├── student/                # Student related components
│   │   │   ├── StudentCard.tsx     # For displaying student info
│   │   │   ├── StudentList.tsx
│   │   │   ├── StudentForm.tsx     # For adding/editing student
│   │   │   └── ProfileCard.tsx     # Student profile component
│   │   ├── teacher/                # Teacher related components
│   │   │   ├── TeacherCard.tsx
│   │   │   └── TeacherList.tsx
│   │   ├── course/                 # Course related components
│   │   │   ├── CourseCard.tsx
│   │   │   └── BatchList.tsx
│   │   ├── fee/                    # Fee related components
│   │   │   ├── FeeTable.tsx
│   │   │   └── PaymentHistory.tsx
│   │   ├── materials/              # Study materials components
│   │   │   ├── FileUploader.tsx
│   │   │   ├── MaterialCard.tsx
│   │   │   └── ResourceList.tsx
│   │   └── notices/                # Notice related components
│   │       ├── NoticeForm.tsx
│   │       └── NoticeList.tsx
│   ├── contexts/                   # React context providers
│   │   ├── AuthContext.tsx         # Authentication context
│   │   └── ThemeContext.tsx        # Theme context if needed
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.tsx             # Authentication hook (already exists)
│   │   ├── use-toast.ts            # Toast hook (already exists)
│   │   ├── use-mobile.tsx          # Mobile detection hook (already exists)
│   │   ├── useAxiosPrivate.ts      # Axios with auth token hook
│   │   └── useOutsideClick.ts      # Detect clicks outside an element
│   ├── lib/                        # Utility libraries
│   │   ├── utils.ts                # General utilities (already exists)
│   │   ├── api.ts                  # API client setup
│   │   ├── validators.ts           # Form validation schemas
│   │   └── constants.ts            # App constants
│   ├── pages/                      # Page components
│   │   ├── Home.tsx                # Home page (already exists)
│   │   ├── Login.tsx               # Login page (already exists)
│   │   ├── Register.tsx            # Register page (already exists)
│   │   ├── Contact.tsx             # Contact page (already exists)
│   │   ├── Services.tsx            # Services page (already exists)
│   │   ├── NotFound.tsx            # 404 page (already exists)
│   │   ├── Index.tsx               # Index page (already exists)
│   │   ├── dashboard/              # Dashboard pages
│   │   │   ├── Dashboard.tsx       # Main dashboard (already exists)
│   │   │   ├── AllStudents.tsx     # Students list page (already exists)
│   │   │   ├── FeeStatus.tsx       # Fee status page (already exists)
│   │   │   ├── StudyMaterials.tsx  # Study materials page (already exists)
│   │   │   ├── UploadMaterials.tsx # Upload materials page (already exists)
│   │   │   ├── Teachers.tsx        # Teachers management
│   │   │   ├── Courses.tsx         # Courses management
│   │   │   ├── Batches.tsx         # Batches management
│   │   │   ├── Notices.tsx         # Notices management
│   │   │   └── Settings.tsx        # Settings page
│   │   ├── student/                # Student related pages
│   │   │   ├── Profile.tsx         # Student profile page
│   │   │   ├── MyClasses.tsx       # Student's enrolled classes
│   │   │   ├── MyMaterials.tsx     # Student's study materials
│   │   │   └── MyFees.tsx          # Student's fee details
│   │   └── teacher/                # Teacher related pages
│   │       ├── Profile.tsx         # Teacher profile page
│   │       ├── MyBatches.tsx       # Teacher's assigned batches
│   │       ├── UploadResources.tsx # Teacher's resource upload
│   │       └── CreateNotice.tsx    # Create notice page for teachers
│   ├── services/                   # API service functions
│   │   ├── authService.ts          # Authentication API calls
│   │   ├── studentService.ts       # Student related API calls
│   │   ├── teacherService.ts       # Teacher related API calls
│   │   ├── courseService.ts        # Course related API calls
│   │   ├── feeService.ts           # Fee related API calls
│   │   ├── materialService.ts      # Study materials API calls
│   │   └── noticeService.ts        # Notice related API calls
│   ├── types/                      # TypeScript type definitions
│   │   ├── auth.types.ts           # Auth related types
│   │   ├── student.types.ts        # Student related types
│   │   ├── teacher.types.ts        # Teacher related types
│   │   ├── course.types.ts         # Course related types
│   │   ├── fee.types.ts            # Fee related types
│   │   ├── material.types.ts       # Study material related types
│   │   └── notice.types.ts         # Notice related types
│   ├── App.tsx                     # Main App component
│   ├── App.css                     # App styles
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Global styles
│   └── vite-env.d.ts              # Vite environment types
├── index.html                      # HTML entry point
├── package.json                    # Frontend dependencies
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
├── tailwind.config.ts              # Tailwind CSS config
└── README.md                       # Project documentation
```

## Backend Structure (Node.js + Express + MongoDB)

```
Server/
├── config/
│   ├── db.js                      # Database connection
│   ├── config.js                  # Environment variables and app configs
│   └── corsOptions.js             # CORS configuration
├── controllers/
│   ├── authController.js          # Authentication controllers
│   ├── studentController.js       # Student related controllers
│   ├── teacherController.js       # Teacher related controllers
│   ├── courseController.js        # Course related controllers
│   ├── batchController.js         # Batch related controllers
│   ├── feeController.js           # Fee related controllers
│   ├── materialController.js      # Study materials controllers
│   └── noticeController.js        # Notice related controllers
├── database/
│   └── connection.js              # MongoDB connection setup
├── middleware/
│   ├── authMiddleware.js          # JWT auth middleware
│   ├── roleMiddleware.js          # Role-based access control
│   ├── errorMiddleware.js         # Error handling middleware
│   ├── validateRequestBody.js     # Request body validation
│   ├── fileUpload.js              # File upload middleware
│   └── logger.js                  # Logging middleware
├── models/
│   ├── User.js                    # User model (base for student/teacher/admin)
│   ├── Student.js                 # Student model
│   ├── Teacher.js                 # Teacher model
│   ├── Admin.js                   # Admin model
│   ├── Course.js                  # Course model
│   ├── Batch.js                   # Batch model
│   ├── Fee.js                     # Fee model
│   ├── Payment.js                 # Payment model
│   ├── Material.js                # Study material model
│   ├── Notice.js                  # Notice model
│   ├── Attendance.js              # Attendance model
│   └── AuditLog.js                # Audit log model for tracking actions
├── routes/
│   ├── authRoutes.js              # Authentication routes
│   ├── studentRoutes.js           # Student related routes
│   ├── teacherRoutes.js           # Teacher related routes
│   ├── adminRoutes.js             # Admin related routes
│   ├── courseRoutes.js            # Course related routes
│   ├── batchRoutes.js             # Batch related routes
│   ├── feeRoutes.js               # Fee related routes
│   ├── materialRoutes.js          # Study materials routes
│   └── noticeRoutes.js            # Notice related routes
├── utils/
│   ├── generateToken.js           # JWT token generation
│   ├── passwordUtils.js           # Password hashing & comparison
│   ├── emailService.js            # Email sending service
│   ├── validators.js              # Input validation functions
│   ├── fileUtils.js               # File handling utilities
│   └── responseHandler.js         # Standardized API response
├── index.js                       # Entry point
├── server.js                      # Server configuration
└── package.json                   # Backend dependencies
```

## Database Schema Design (MongoDB)

### User Collection

```
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  mobile: String,
  role: String (enum: ["admin", "teacher", "student"]),
  profilePicture: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Student Collection

```
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  rollNumber: String,
  batchIds: [ObjectId] (ref: Batch),
  courseIds: [ObjectId] (ref: Course),
  feeStatus: [
    {
      month: String,
      year: Number,
      status: String (enum: ["paid", "pending", "overdue"]),
      amount: Number
    }
  ],
  attendance: [
    {
      date: Date,
      status: String (enum: ["present", "absent", "leave"])
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Teacher Collection

```
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  qualification: String,
  experience: Number,
  specialization: String,
  batchIds: [ObjectId] (ref: Batch),
  courseIds: [ObjectId] (ref: Course),
  createdAt: Date,
  updatedAt: Date
}
```

### Course Collection

```
{
  _id: ObjectId,
  name: String,
  description: String,
  duration: String,
  fee: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Batch Collection

```
{
  _id: ObjectId,
  name: String,
  courseId: ObjectId (ref: Course),
  teacherId: ObjectId (ref: Teacher),
  students: [ObjectId] (ref: Student),
  schedule: {
    days: [String],
    startTime: String,
    endTime: String
  },
  startDate: Date,
  endDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Material Collection

```
{
  _id: ObjectId,
  title: String,
  description: String,
  fileUrl: String,
  fileType: String,
  uploadedBy: ObjectId (ref: User),
  batchIds: [ObjectId] (ref: Batch),
  courseId: ObjectId (ref: Course),
  createdAt: Date,
  updatedAt: Date
}
```

### Notice Collection

```
{
  _id: ObjectId,
  title: String,
  content: String,
  postedBy: ObjectId (ref: User),
  targetAudience: String (enum: ["all", "teachers", "students", "batch"]),
  targetBatchIds: [ObjectId] (ref: Batch),
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Collection

```
{
  _id: ObjectId,
  studentId: ObjectId (ref: Student),
  amount: Number,
  paymentDate: Date,
  month: String,
  year: Number,
  paymentMethod: String,
  transactionId: String,
  status: String,
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLog Collection

```
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  action: String,
  details: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: Date
}
```

## Authentication and Security Implementation

1. **JWT Authentication**

    - Login generates JWT token with role and expiry
    - Token stored in HTTP-only cookies
    - Token validation middleware for protected routes

2. **Password Security**

    - bcrypt for password hashing
    - Password reset via email OTP

3. **Role-Based Access Control**

    - Middleware checks user role before allowing access
    - Routes protected based on user roles

4. **File Upload Security**

    - Validation for file types (PDF, JPEG, PNG, MP4)
    - File size limits
    - Secure storage using Cloudinary

5. **API Security**

    - Input validation using express-validator
    - CORS protection
    - Helmet.js for security headers
    - Rate limiting for API endpoints

6. **Audit Logging**
    - Track user logins
    - Log file uploads
    - Record data modifications
