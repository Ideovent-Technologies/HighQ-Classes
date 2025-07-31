# 🚀 HighQ Classes Frontend Development Guide

## 👨‍💻 **For Team Members - Building on Avinash's Foundation**

Avinash ✅ **WORK COMPLETE**  
**Foundation Status**: Production-ready and excellent  
**Team Status**: Ready to build specific modules  
**Backend**: Fully built with 68 API endpoints

---

## 🎯 **Overview**

Avinash has delivered an **outstanding foundation** that includes:

-   ✅ Complete authentication system
-   ✅ Role-based user management
-   ✅ UI component library (Shadcn UI)
-   ✅ API service architecture
-   ✅ TypeScript type system
-   ✅ Profile management system
-   ✅ Protected routing system

**Your job**: Build specific feature modules using the established patterns.

---

## 📋 **Team Assignments & Guides**

### 🔗 **Quick Navigation**

-   [Sumit - Admin Dashboard & Course/Batch Management](#sumit---admin-dashboard--coursebatch-management)
-   [Gauri - Student Records Management](#gauri---student-records-management)
-   [Ishika - Teacher Dashboard & Notices Management](#ishika---teacher-dashboard--notices-management)
-   [Honey - Fee Management System](#honey---fee-management-system)
-   [Prince - Resource Sharing Platform](#prince---resource-sharing-platform)
-   [Sachin - Class Recordings & Media](#sachin---class-recordings--media)

---

## 👨‍💼 **Sumit - Admin Dashboard & Course/Batch Management**

### **🎯 Your Responsibilities**

-   Main Admin Dashboard with statistics
-   Teacher management interface
-   Course creation and management
-   Batch creation and student assignments
-   System settings and configuration

### **📁 Files You Need to Create**

#### **Pages** (`/src/pages/dashboard/`)

```typescript
// 1. Enhanced Dashboard (Update existing)
Dashboard.tsx; // Add admin-specific widgets and stats

// 2. Teacher Management
Teachers.tsx; // List, add, edit, delete teachers
TeacherDetails.tsx; // Individual teacher profile view

// 3. Course Management
Courses.tsx; // Course listing and management
CourseForm.tsx; // Create/edit course form
CourseDetails.tsx; // Individual course view

// 4. Batch Management
Batches.tsx; // Batch listing and management
BatchForm.tsx; // Create/edit batch form
BatchDetails.tsx; // Individual batch view with student list

// 5. System Settings
Settings.tsx; // System configuration interface
```

#### **Components** (`/src/components/admin/`)

```typescript
// Dashboard Widgets
AdminStatsCards.tsx; // Key metrics (students, revenue, etc.)
RecentActivity.tsx; // Latest system activities
QuickActions.tsx; // Admin quick action buttons

// Teacher Management
TeacherList.tsx; // Teacher data table
TeacherCard.tsx; // Teacher display card
TeacherForm.tsx; // Add/edit teacher form

// Course Management
CourseCard.tsx; // Course display card
CourseList.tsx; // Course data table
CourseForm.tsx; // Create/edit course form

// Batch Management
BatchCard.tsx; // Batch display card
BatchList.tsx; // Batch data table with filters
BatchForm.tsx; // Create/edit batch form
BatchStudentManager.tsx; // Assign/remove students from batch
```

#### **Services** (`/src/API/services/`)

```typescript
// Create these new services
batchService.ts; // Batch CRUD operations
adminService.ts; // Admin dashboard data
systemService.ts; // System settings and configuration
```

#### **Types** (`/src/types/`)

```typescript
// Create these new type files
batch.types.ts; // Batch-related interfaces
admin.types.ts; // Admin dashboard interfaces
system.types.ts; // System configuration interfaces
```

### **🔌 Backend Endpoints You'll Use**

```typescript
// Batch Management (6 endpoints)
GET    /api/batch                    // Get all batches
POST   /api/batch                    // Create new batch
GET    /api/batch/:id                // Get batch details
PUT    /api/batch/:id                // Update batch
DELETE /api/batch/:id                // Delete batch
POST   /api/batch/:id/students       // Add students to batch

// Course Management (6 endpoints)
GET    /api/course                   // Get all courses
POST   /api/course                   // Create new course
GET    /api/course/:id               // Get course details
PUT    /api/course/:id               // Update course
DELETE /api/course/:id               // Delete course
POST   /api/course/:id/enroll        // Enroll student in course

// Teacher Management (3 endpoints)
GET    /api/teacher                  // Get all teachers
PUT    /api/teacher/:id              // Update teacher
DELETE /api/teacher/:id              // Delete teacher

// Admin Dashboard (7 endpoints)
GET    /api/admin/dashboard          // Dashboard statistics
GET    /api/admin/students           // All students management
GET    /api/admin/teachers           // All teachers management
// ... and 4 more admin endpoints
```

### **📖 Example Code Patterns**

#### **Creating a Service** (Follow authService.ts pattern)

```typescript
// src/API/services/batchService.ts
import api from "../Axios";

interface Batch {
    _id: string;
    name: string;
    course: string;
    teacher: string;
    students: string[];
    // ... other fields from backend Batch.js model
}

const batchService = {
    getAllBatches: async () => {
        try {
            const response = await api.get("/batch");
            return { success: true, batches: response.data.batches };
        } catch (error) {
            return { success: false, message: error.response?.data?.message };
        }
    },

    createBatch: async (batchData: CreateBatchData) => {
        try {
            const response = await api.post("/batch", batchData);
            return { success: true, batch: response.data.batch };
        } catch (error) {
            return { success: false, message: error.response?.data?.message };
        }
    },
    // ... other CRUD methods
};

export default batchService;
```

#### **Creating a Component** (Follow existing UI patterns)

```typescript
// src/components/admin/BatchCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BatchCardProps {
    batch: Batch;
    onEdit: (batch: Batch) => void;
    onDelete: (batchId: string) => void;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch, onEdit, onDelete }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    {batch.name}
                    <Badge
                        variant={
                            batch.status === "active" ? "default" : "secondary"
                        }
                    >
                        {batch.status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600">Course: {batch.course}</p>
                <p className="text-sm text-gray-600">
                    Students: {batch.enrolled}/{batch.capacity}
                </p>
                <div className="flex space-x-2 mt-4">
                    <Button size="sm" onClick={() => onEdit(batch)}>
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(batch._id)}
                    >
                        Delete
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default BatchCard;
```

---

## 👩‍🎓 **Gauri - Student Records Management**

### **🎯 Your Responsibilities**

-   Student listing and management from admin/teacher perspective
-   Individual student profile views
-   Student academic history and performance tracking
-   Student attendance records display

### **📁 Files You Need to Create**

#### **Pages** (`/src/pages/dashboard/`)

```typescript
AllStudents.tsx; // Comprehensive student listing (Update existing)
StudentDetails.tsx; // Individual student detailed view
StudentPerformance.tsx; // Academic performance tracking
StudentAttendance.tsx; // Attendance history view
```

#### **Components** (`/src/components/student/`)

```typescript
// Student Management
StudentList.tsx; // Data table with search/filter
StudentCard.tsx; // Student display card
StudentForm.tsx; // Add/edit student form (admin use)
StudentDetailCard.tsx; // Detailed student information display

// Academic Components
AcademicHistory.tsx; // Academic performance display
AttendanceChart.tsx; // Visual attendance representation
PerformanceMetrics.tsx; // Student performance indicators
FamilyInformation.tsx; // Family details display
```

#### **Services** (Extend existing)

```typescript
// Extend src/API/services/studentService.ts
// Add methods for:
// - Advanced student search/filtering
// - Performance data fetching
// - Attendance record retrieval
// - Family information management
```

#### **Types** (Extend existing)

```typescript
// Extend src/types/student.types.ts
// Add interfaces for:
// - Student search filters
// - Performance metrics
// - Attendance records
// - Academic history
```

### **🔌 Backend Endpoints You'll Use**

```typescript
// Student Management (5 endpoints)
GET    /api/student                  // Get all students
POST   /api/student                  // Create new student
GET    /api/student/:id              // Get student details
PUT    /api/student/:id              // Update student
DELETE /api/student/:id              // Delete student

// Student Dashboard (Additional endpoints)
GET    /api/student-dashboard        // Student-specific data
GET    /api/attendance/student/:id   // Student attendance records
```

### **📖 Example Implementation**

#### **Student List Component**

```typescript
// src/components/student/StudentList.tsx
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import studentService from "@/API/services/studentService";

const StudentList: React.FC = () => {
    const [students, setStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudents();
    }, []);

    const loadStudents = async () => {
        setLoading(true);
        const result = await studentService.getAllStudents();
        if (result.success) {
            setStudents(result.students);
        }
        setLoading(false);
    };

    const filteredStudents = students.filter(
        (student) =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
                <Button>Add New Student</Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredStudents.map((student) => (
                        <TableRow key={student._id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{student.email}</TableCell>
                            <TableCell>
                                {student.currentCourse || "Not enrolled"}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        student.isActive
                                            ? "default"
                                            : "secondary"
                                    }
                                >
                                    {student.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button size="sm" variant="outline">
                                    View Details
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default StudentList;
```

---

## 👩‍🏫 **Ishika - Teacher Dashboard & Notices Management**

### **🎯 Your Responsibilities**

-   Teacher-specific dashboard interface
-   Notice creation and management system
-   Teacher's batch and class management
-   Attendance marking interface
-   Assignment creation and management

### **📁 Files You Need to Create**

#### **Pages** (`/src/pages/teacher/`)

```typescript
TeacherDashboard.tsx; // Teacher's main dashboard
MyBatches.tsx; // Teacher's assigned batches
CreateNotice.tsx; // Notice creation interface
MySchedule.tsx; // Teacher's class schedule
AttendanceMarker.tsx; // Mark attendance for classes
AssignmentCenter.tsx; // Create and manage assignments
```

#### **Pages** (`/src/pages/dashboard/`)

```typescript
Notices.tsx; // All notices management (admin/teacher view)
TeacherSchedule.tsx; // Schedule management
AttendanceTracker.tsx; // Attendance overview and management
```

#### **Components** (`/src/components/teacher/`)

```typescript
// Dashboard Components
TeacherStatsCards.tsx; // Teacher-specific statistics
UpcomingClasses.tsx; // Next classes widget
RecentNotices.tsx; // Latest notices display

// Notice Management
NoticeForm.tsx; // Create/edit notice form
NoticeList.tsx; // Notice listing with filters
NoticeCard.tsx; // Individual notice display

// Attendance Components
AttendanceForm.tsx; // Mark attendance interface
AttendanceChart.tsx; // Attendance visualization
StudentAttendanceRow.tsx; // Individual student attendance

// Assignment Components
AssignmentForm.tsx; // Create assignment form
AssignmentList.tsx; // Assignment listing
AssignmentCard.tsx; // Assignment display card
```

#### **Services** (`/src/API/services/`)

```typescript
// Create these new services
attendanceService.ts; // Attendance marking and tracking
assignmentService.ts; // Assignment management
scheduleService.ts; // Teacher schedule management

// Extend existing services
noticeService.ts; // Add teacher-specific methods
teacherService.ts; // Add dashboard and batch methods
```

#### **Types** (`/src/types/`)

```typescript
// Create new type files
attendance.types.ts; // Attendance-related interfaces
assignment.types.ts; // Assignment-related interfaces
schedule.types.ts; // Schedule-related interfaces

// Extend existing
notice.types.ts; // Add teacher-specific notice types
teacher.types.ts; // Add dashboard and batch types
```

### **🔌 Backend Endpoints You'll Use**

```typescript
// Notice Management (5 endpoints)
GET    /api/notice                  // Get all notices
POST   /api/notice                  // Create new notice
GET    /api/notice/:id              // Get notice details
PUT    /api/notice/:id              // Update notice
DELETE /api/notice/:id              // Delete notice

// Attendance Management (3 endpoints)
POST   /api/attendance              // Mark attendance
GET    /api/attendance/:batchId     // Get batch attendance
GET    /api/attendance/student/:id  // Get student attendance

// Assignment Management (8 endpoints)
GET    /api/assignment              // Get all assignments
POST   /api/assignment              // Create assignment
GET    /api/assignment/:id          // Get assignment details
PUT    /api/assignment/:id          // Update assignment
DELETE /api/assignment/:id          // Delete assignment
GET    /api/assignment/:id/submissions // Get submissions
POST   /api/assignment/:id/grade    // Grade submission
GET    /api/assignment/teacher/:id  // Get teacher's assignments

// Schedule Management (2 endpoints)
GET    /api/schedule/teacher/:id    // Get teacher schedule
PUT    /api/schedule/teacher/:id    // Update teacher schedule
```

### **📖 Example Implementation**

#### **Notice Creation Form**

```typescript
// src/components/teacher/NoticeForm.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import noticeService from "@/API/services/noticeService";

const NoticeForm: React.FC = () => {
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        priority: "medium",
        targetAudience: "all",
        expiryDate: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await noticeService.createNotice(formData);
        if (result.success) {
            // Handle success - show toast, reset form, redirect
            console.log("Notice created successfully");
        } else {
            // Handle error
            console.error("Failed to create notice:", result.message);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Notice</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Title</label>
                        <Input
                            value={formData.title}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    title: e.target.value,
                                })
                            }
                            placeholder="Enter notice title"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Content</label>
                        <Textarea
                            value={formData.content}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    content: e.target.value,
                                })
                            }
                            placeholder="Enter notice content"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium">
                                Priority
                            </label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        priority: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">
                                        Medium
                                    </SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">
                                        Urgent
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Target Audience
                            </label>
                            <Select
                                value={formData.targetAudience}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
                                        targetAudience: value,
                                    })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Users
                                    </SelectItem>
                                    <SelectItem value="students">
                                        Students Only
                                    </SelectItem>
                                    <SelectItem value="teachers">
                                        Teachers Only
                                    </SelectItem>
                                    <SelectItem value="parents">
                                        Parents Only
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Expiry Date (Optional)
                        </label>
                        <Input
                            type="date"
                            value={formData.expiryDate}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    expiryDate: e.target.value,
                                })
                            }
                        />
                    </div>

                    <Button type="submit" className="w-full">
                        Create Notice
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default NoticeForm;
```

---

## 💰 **Honey - Fee Management System**

### **🎯 Your Responsibilities**

-   Comprehensive fee tracking and management
-   Payment recording and history
-   Fee status overview for students
-   Financial reports and analytics
-   Payment receipts and documentation

### **📁 Files You Need to Create**

#### **Pages** (`/src/pages/dashboard/`)

```typescript
FeeManagement.tsx; // Complete fee management interface
PaymentHistory.tsx; // Payment records and history
FeeReports.tsx; // Financial reports and analytics
```

#### **Pages** (`/src/pages/student/`)

```typescript
MyFees.tsx; // Student's personal fee view
PaymentPortal.tsx; // Online payment interface
```

#### **Components** (`/src/components/fee/`)

```typescript
// Fee Management
FeeTable.tsx; // Fee data table with filters
FeeCard.tsx; // Individual fee display
FeeForm.tsx; // Create/edit fee structure
PaymentForm.tsx; // Record payment interface

// Payment Components
PaymentHistory.tsx; // Payment history display
PaymentCard.tsx; // Individual payment record
ReceiptGenerator.tsx; // Generate payment receipts
FeeStatusBadge.tsx; // Fee status indicator

// Analytics Components
FeeAnalytics.tsx; // Financial charts and metrics
PaymentChart.tsx; // Payment trend visualization
OverdueList.tsx; // Overdue payments list
FeeCollectionStats.tsx; // Collection statistics
```

#### **Services** (`/src/API/services/`)

```typescript
// Create new service
paymentService.ts; // Payment processing and history

// Extend existing
feeService.ts; // Add analytics and reporting methods
```

#### **Types** (`/src/types/`)

```typescript
// Create new type file
payment.types.ts; // Payment-related interfaces

// Extend existing
fee.types.ts; // Add analytics and report types
```

### **🔌 Backend Endpoints You'll Use**

```typescript
// Fee Management (7 endpoints)
GET    /api/fee                     // Get all fees
POST   /api/fee                     // Create fee structure
GET    /api/fee/student/:id         // Get student fees
POST   /api/fee/payment             // Record payment
GET    /api/fee/pending             // Get pending fees
GET    /api/fee/overdue             // Get overdue fees
GET    /api/fee/reports             // Fee analytics and reports
```

### **📖 Example Implementation**

#### **Fee Management Interface**

```typescript
// src/pages/dashboard/FeeManagement.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FeeTable from "@/components/fee/FeeTable";
import PaymentHistory from "@/components/fee/PaymentHistory";
import FeeAnalytics from "@/components/fee/FeeAnalytics";
import feeService from "@/API/services/feeService";

const FeeManagement: React.FC = () => {
    const [feeData, setFeeData] = useState({
        totalCollection: 0,
        pendingAmount: 0,
        overdueAmount: 0,
        recentPayments: [],
    });

    useEffect(() => {
        loadFeeData();
    }, []);

    const loadFeeData = async () => {
        // Load fee analytics data
        const analyticsResult = await feeService.getFeeAnalytics();
        if (analyticsResult.success) {
            setFeeData(analyticsResult.data);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Fee Management</h1>

            {/* Fee Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-600">
                            Total Collection
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            ₹{feeData.totalCollection.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-600">
                            Pending Amount
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            ₹{feeData.pendingAmount.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm text-gray-600">
                            Overdue Amount
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            ₹{feeData.overdueAmount.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Fee Management Tabs */}
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="fees">Fee Structure</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <Card>
                        <CardContent className="pt-6">
                            <FeeTable />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="fees">
                    <Card>
                        <CardContent className="pt-6">
                            {/* Fee structure management */}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments">
                    <Card>
                        <CardContent className="pt-6">
                            <PaymentHistory />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="analytics">
                    <Card>
                        <CardContent className="pt-6">
                            <FeeAnalytics />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FeeManagement;
```

---

## 📚 **Prince - Resource Sharing Platform**

### **🎯 Your Responsibilities**

-   Study material upload and organization system
-   Resource browsing and download interface
-   File management with categorization
-   Access control for different user roles
-   Search and filter functionality for materials

### **📁 Files You Need to Create**

#### **Pages** (`/src/pages/dashboard/`)

```typescript
StudyMaterials.tsx; // Browse materials (Update existing)
UploadMaterials.tsx; // Upload interface (Update existing)
MaterialCategories.tsx; // Organize materials by category
```

#### **Pages** (`/src/pages/student/`)

```typescript
MyMaterials.tsx; // Student's accessible materials
```

#### **Pages** (`/src/pages/teacher/`)

```typescript
UploadResources.tsx; // Teacher's upload interface
MyUploads.tsx; // Teacher's uploaded materials
```

#### **Components** (`/src/components/materials/`)

```typescript
// File Management
FileUploader.tsx; // Drag-and-drop file upload
MaterialCard.tsx; // Material display card
ResourceList.tsx; // Material listing with filters
MaterialViewer.tsx; // Preview materials (PDF, images)

// Organization Components
CategorySelector.tsx; // Material category selection
TagManager.tsx; // Material tagging system
SearchFilter.tsx; // Advanced search and filters
MaterialGrid.tsx; // Grid view for materials

// Access Control
AccessManager.tsx; // Manage material access permissions
DownloadTracker.tsx; // Track material downloads
MaterialStats.tsx; // Material usage statistics
```

#### **Services** (Extend existing)

```typescript
// Extend src/API/services/materialService.ts
// Add methods for:
// - File upload with progress
// - Advanced search and filtering
// - Category management
// - Access control
// - Download tracking
```

#### **Types** (Extend existing)

```typescript
// Extend src/types/material.types.ts
// Add interfaces for:
// - File upload progress
// - Search filters
// - Category structures
// - Access permissions
```

### **🔌 Backend Endpoints You'll Use**

```typescript
// Material Management (6 endpoints)
GET    /api/material                // Get all materials
POST   /api/material                // Upload new material
GET    /api/material/:id            // Get material details
PUT    /api/material/:id            // Update material
DELETE /api/material/:id            // Delete material
GET    /api/material/download/:id   // Download material
```

### **📖 Example Implementation**

#### **File Upload Component**

```typescript
// src/components/materials/FileUploader.tsx
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X } from "lucide-react";
import materialService from "@/API/services/materialService";

interface FileUploadProps {
    onUploadComplete: (material: any) => void;
}

const FileUploader: React.FC<FileUploadProps> = ({ onUploadComplete }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadProgress, setUploadProgress] = useState<{
        [key: string]: number;
    }>({});
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        setSelectedFiles((prev) => [...prev, ...files]);
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
    };

    const removeFile = (index: number) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const uploadFiles = async () => {
        if (selectedFiles.length === 0) return;

        setUploading(true);

        for (const file of selectedFiles) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("title", file.name);
                formData.append("category", "general"); // You can add category selection

                const result = await materialService.uploadMaterial(
                    formData,
                    (progressEvent) => {
                        const progress = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress((prev) => ({
                            ...prev,
                            [file.name]: progress,
                        }));
                    }
                );

                if (result.success) {
                    onUploadComplete(result.material);
                }
            } catch (error) {
                console.error("Upload failed for file:", file.name, error);
            }
        }

        setUploading(false);
        setSelectedFiles([]);
        setUploadProgress({});
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload Study Materials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Drag and Drop Area */}
                <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">
                        Click to upload or drag and drop files here
                    </p>
                    <p className="text-xs text-gray-500">
                        Supported formats: PDF, DOC, DOCX, PPT, PPTX, images
                    </p>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Selected Files */}
                {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="font-medium">Selected Files:</h4>
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <File className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-sm font-medium">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {(file.size / 1024 / 1024).toFixed(
                                                2
                                            )}{" "}
                                            MB
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {uploading &&
                                        uploadProgress[file.name] !==
                                            undefined && (
                                            <div className="flex items-center space-x-2">
                                                <Progress
                                                    value={
                                                        uploadProgress[
                                                            file.name
                                                        ]
                                                    }
                                                    className="w-20"
                                                />
                                                <span className="text-xs">
                                                    {uploadProgress[file.name]}%
                                                </span>
                                            </div>
                                        )}
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => removeFile(index)}
                                        disabled={uploading}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Upload Button */}
                <Button
                    onClick={uploadFiles}
                    disabled={selectedFiles.length === 0 || uploading}
                    className="w-full"
                >
                    {uploading
                        ? "Uploading..."
                        : `Upload ${selectedFiles.length} file(s)`}
                </Button>
            </CardContent>
        </Card>
    );
};

export default FileUploader;
```

---

## 🎥 **Sachin - Class Recordings & Media**

### **🎯 Your Responsibilities**

-   Video upload and management system
-   Media player for class recordings
-   Access control with 3-day limitation
-   Recording analytics and usage tracking
-   Video streaming and playback optimization

### **📁 Files You Need to Create**

#### **Pages** (`/src/pages/dashboard/`)

```typescript
ClassRecordings.tsx; // Admin/Teacher recording management
RecordingAnalytics.tsx; // Usage analytics and reports
```

#### **Pages** (`/src/pages/student/`)

```typescript
MyClasses.tsx; // Student's class recordings (Update existing)
RecordingPlayer.tsx; // Dedicated video player page
```

#### **Components** (`/src/components/recordings/`)

```typescript
// Media Components
MediaPlayer.tsx; // Custom video player with controls
RecordingUploader.tsx; // Video upload with progress
RecordingList.tsx; // Recording listing with filters
RecordingCard.tsx; // Individual recording display

// Access Control
AccessTimer.tsx; // 3-day access countdown
AccessManager.tsx; // Manage recording access
StudentAccessList.tsx; // Track student access

// Analytics Components
ViewingAnalytics.tsx; // Recording view statistics
UsageChart.tsx; // Usage trend visualization
PopularRecordings.tsx; // Most watched recordings
WatchTimeTracker.tsx; // Track student watch time
```

#### **Services** (`/src/API/services/`)

```typescript
// Create new service
recordingService.ts; // Recording management and streaming
```

#### **Types** (`/src/types/`)

```typescript
// Create new type file
recording.types.ts; // Recording-related interfaces
```

### **🔌 Backend Endpoints You'll Use**

```typescript
// Recording Management (9 endpoints)
GET    /api/recording                    // Get all recordings
POST   /api/recording                    // Upload new recording
GET    /api/recording/:id                // Get recording details
PUT    /api/recording/:id                // Update recording
DELETE /api/recording/:id                // Delete recording
GET    /api/recording/stream/:id         // Stream recording
POST   /api/recording/:id/access         // Grant student access
GET    /api/recording/student/:id        // Get student's recordings
GET    /api/recording/analytics          // Recording analytics
```

### **📖 Example Implementation**

#### **Custom Media Player**

```typescript
// src/components/recordings/MediaPlayer.tsx
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    SkipBack,
    SkipForward,
} from "lucide-react";

interface MediaPlayerProps {
    recordingId: string;
    title: string;
    streamUrl: string;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({
    recordingId,
    title,
    streamUrl,
    onTimeUpdate,
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
            onTimeUpdate?.(video.currentTime, video.duration);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
        };

        video.addEventListener("timeupdate", handleTimeUpdate);
        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("ended", handleEnded);

        return () => {
            video.removeEventListener("timeupdate", handleTimeUpdate);
            video.removeEventListener("loadedmetadata", handleLoadedMetadata);
            video.removeEventListener("ended", handleEnded);
        };
    }, [onTimeUpdate]);

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isPlaying) {
            video.pause();
        } else {
            video.play();
        }
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (newVolume: number) => {
        const video = videoRef.current;
        if (!video) return;

        video.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const handleSeek = (newTime: number) => {
        const video = videoRef.current;
        if (!video) return;

        video.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const skipTime = (seconds: number) => {
        const video = videoRef.current;
        if (!video) return;

        const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
        handleSeek(newTime);
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (!isFullscreen) {
            container.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <Card>
            <CardContent className="p-0">
                <div
                    ref={containerRef}
                    className="relative bg-black rounded-lg overflow-hidden"
                >
                    <video
                        ref={videoRef}
                        src={streamUrl}
                        className="w-full h-auto max-h-96"
                        onClick={togglePlay}
                    />

                    {/* Video Controls Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <div className="space-y-2">
                            {/* Progress Bar */}
                            <div className="flex items-center space-x-2 text-white text-sm">
                                <span>{formatTime(currentTime)}</span>
                                <div className="flex-1">
                                    <Progress
                                        value={(currentTime / duration) * 100}
                                        className="h-1 cursor-pointer"
                                        onClick={(e) => {
                                            const rect =
                                                e.currentTarget.getBoundingClientRect();
                                            const percentage =
                                                (e.clientX - rect.left) /
                                                rect.width;
                                            handleSeek(percentage * duration);
                                        }}
                                    />
                                </div>
                                <span>{formatTime(duration)}</span>
                            </div>

                            {/* Control Buttons */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => skipTime(-10)}
                                        className="text-white hover:bg-white/20"
                                    >
                                        <SkipBack className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={togglePlay}
                                        className="text-white hover:bg-white/20"
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-5 w-5" />
                                        ) : (
                                            <Play className="h-5 w-5" />
                                        )}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => skipTime(10)}
                                        className="text-white hover:bg-white/20"
                                    >
                                        <SkipForward className="h-4 w-4" />
                                    </Button>

                                    <div className="flex items-center space-x-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={toggleMute}
                                            className="text-white hover:bg-white/20"
                                        >
                                            {isMuted ? (
                                                <VolumeX className="h-4 w-4" />
                                            ) : (
                                                <Volume2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={isMuted ? 0 : volume}
                                            onChange={(e) =>
                                                handleVolumeChange(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-16"
                                        />
                                    </div>
                                </div>

                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={toggleFullscreen}
                                    className="text-white hover:bg-white/20"
                                >
                                    <Maximize className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video Title */}
                <div className="p-4">
                    <h3 className="font-semibold text-lg">{title}</h3>
                </div>
            </CardContent>
        </Card>
    );
};

export default MediaPlayer;
```

---

## 🛠️ **General Development Guidelines**

### **📂 File Organization**

```
src/
├── pages/           # Page components (routed)
│   ├── auth/        # Authentication pages
│   ├── dashboard/   # Dashboard pages
│   ├── student/     # Student-specific pages
│   ├── teacher/     # Teacher-specific pages
│   └── admin/       # Admin-specific pages
├── components/      # Reusable components
│   ├── ui/          # Shadcn UI components
│   ├── common/      # Shared components
│   └── [feature]/   # Feature-specific components
├── API/services/    # Backend API services
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
├── contexts/        # React contexts
└── lib/             # Utility libraries
```

### **🎨 UI Component Usage**

```typescript
// Always use existing Shadcn UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

// For consistent styling
className = "space-y-4"; // Vertical spacing
className = "flex items-center"; // Horizontal alignment
className = "grid grid-cols-3"; // Grid layouts
```

### **🔌 API Service Pattern**

```typescript
// Always follow this pattern for services
const serviceFunction = async (params) => {
    try {
        const response = await api.get("/endpoint", params);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Service error:", error);
        return {
            success: false,
            message: error.response?.data?.message || "Operation failed",
        };
    }
};
```

### **🎯 State Management**

```typescript
// Use React hooks for local state
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Use useAuth for authentication state
const { state, logout } = useAuth();
const { user, isAuthenticated } = state;
```

### **📱 Responsive Design**

```typescript
// Always include responsive classes
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
className = "flex flex-col sm:flex-row";
className = "text-sm sm:text-base";
className = "p-4 sm:p-6";
```

### **📝 TypeScript Type Structure**

Avinash has organized types by user role for better maintainability:

```typescript
// Import user types
import { AdminUser } from "@/types/user"; // Admin types
import { StudentUser } from "@/types/student.types"; // Student types
import { TeacherUser } from "@/types/teacher.types"; // Teacher types

// Or import all at once
import { AdminUser, StudentUser, TeacherUser, ExtendedUser } from "@/types";

// Common interfaces available in all files
import { BaseUser, Address, UserPreferences } from "@/types/user";
```

**Type Files Structure:**

-   `user.ts` - BaseUser, AdminUser, and common interfaces (Address, UserPreferences)
-   `student.types.ts` - StudentUser and all student-related interfaces
-   `teacher.types.ts` - TeacherUser and all teacher-related interfaces
-   `index.ts` - Exports all types for easy importing

**When Creating New Types:**

-   **Student-related**: Add to `student.types.ts`
-   **Teacher-related**: Add to `teacher.types.ts`
-   **Admin-related**: Add to `user.ts`
-   **Shared interfaces**: Add to `user.ts` and export from others

---

## 🚀 **Getting Started Checklist**

### **For Each Team Member:**

#### **1. Setup** ✅

-   [ ] Pull latest code from main branch
-   [ ] Install dependencies: `npm install`
-   [ ] Start development server: `npm run dev`
-   [ ] Verify authentication system works

#### **2. Create Your Files** 📁

-   [ ] Create required page components
-   [ ] Create feature-specific components
-   [ ] Create/extend API services
-   [ ] Create/extend TypeScript types

#### **3. Follow Patterns** 🎯

-   [ ] Use existing UI components (Shadcn)
-   [ ] Follow established file naming conventions
-   [ ] Use consistent error handling
-   [ ] Implement responsive design

#### **4. Test Your Work** 🧪

-   [ ] Test all CRUD operations
-   [ ] Verify responsive design
-   [ ] Check error scenarios
-   [ ] Test with different user roles

#### **5. Integration** 🔗

-   [ ] Connect to backend APIs
-   [ ] Test data flow
-   [ ] Verify authentication
-   [ ] Test user permissions

---

## 📞 **Support & Communication**

### **Questions & Help**

-   **Technical Issues**: Check existing components for patterns
-   **API Integration**: Refer to `authService.ts` for examples
-   **UI Components**: Browse `/src/components/ui/` for available components
-   **Type Definitions**: Check existing type files for patterns

### **Best Practices**

-   ✅ **Code Reuse**: Use existing components before creating new ones
-   ✅ **Consistency**: Follow established naming and structure patterns
-   ✅ **Documentation**: Add comments for complex logic
-   ✅ **Testing**: Test thoroughly before submitting
-   ✅ **Responsiveness**: Ensure mobile-friendly design
