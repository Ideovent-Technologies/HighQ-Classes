**Ideovent Technology Assignment**
**Project Title:** _Enhancing and Securing the HighQ School Manager Web Application_

---

### **PROJECT OBJECTIVE**

You are assigned to **analyze, upgrade, and secure** the existing **HighQ School Manager** web application. This system helps educational institutions manage:

-   Courses
-   Batches
-   Live Classes
-   Exams
-   Student Data

#### **Your goals:**

1. Improve the frontend experience for users
2. Build an Admin Panel for user and content management
3. Add a Student Profile Page
4. Implement security best practices throughout the system
5. Polish and finalize UI for a smoother, mobile-responsive experience

---

### **WHAT TO STUDY BEFORE YOU START**

-   Review the provided **\[HighQ Documentation PDF]**
-   Explore the live site: [http://highqclasses.ideovent.com/](http://highqclasses.ideovent.com/)
-   Audit the existing **role-based login system** and **route accessibility**

    **Sample Admin Credentials:**

    -   **Email:** [admin@example.com](mailto:admin@example.com)
    -   **Password:** admin

---

## **PART 1: FUNCTIONAL IMPROVEMENTS & EXTENSIONS**

### **1. Admin Dashboard Page**

Build a full-featured Admin Dashboard with:

#### Overview Cards/Widgets:

-   Total Students
-   Total Teachers
-   Total Courses & Batches
-   Upcoming Classes or Exams

#### Navigation Links:

-   Student Management
-   Teacher Management
-   Batch/Course Management
-   File Upload/Resources
-   Exam Reports

#### Admin-Only Features:

-   Add/edit/delete student or teacher records
-   Upload study materials to specific batches
-   Create announcements or broadcast messages

> **Note:** Secure all Admin routes using **middleware (JWT + roles).**

---

### **2. Student Profile Page**

Allow students to view their:

-   Name, Email, Mobile, Class, Batch
-   Enrolled Courses
-   Attendance and Exam History
-   Homework, Notes, Study Resources
-   Upload Profile Picture
-   Edit contact details (email, mobile) only

> **Access Control:** Students can only access their own profile using their token.

---

### **3. Responsive UI and UX Polishing**

-   Ensure compatibility with all screen sizes (mobile, tablet, laptop)
-   Fix font sizes, input padding, button tap zones
-   Add loading spinners for slow routes
-   Make sidebar/navigation collapsible on small screens

---

## **PART 2: SECURITY IMPLEMENTATION TASKS**

### **1. Role-Based Access Control (RBAC)**

Implement middleware that checks `req.user.role`:

-   **Admin**: Full access
-   **Teachers**: Only assigned batches
-   **Students**: Only their own profile and data

---

### **2. JWT Security Audit**

-   Sign JWTs with a secret key and expiry (e.g., 2h)
-   Store tokens using HTTP-only cookies or localStorage
-   Implement logout to clear token
-   Validate token on every protected route

---

### **3. Password Security**

-   Hash all passwords with **bcrypt**
-   Never return passwords in API responses

---

### **4. Input & Upload Validation**

Use `express-validator` to check:

-   Registration/Login fields (email format, password strength)
-   Uploaded files (type and size < 5MB)

**Allowed file types:** PDF, JPEG, PNG, MP4

---

### **5. Route Protection & Error Handling**

-   Protect all routes with JWT verification
-   Use try-catch blocks and return user-friendly error messages
-   Hide sensitive info (e.g., stack traces) in production

---

### **6. Secure File Handling**

-   Sanitize filenames to avoid path traversal
-   Use **Cloudinary** or other secure services for file storage
-   Prevent duplicate uploads

---

### **Additional Features**

-   Password reset via email (OTP or link)
-   Add audit logs for:

    -   Logins
    -   Record updates
    -   File uploads

-   Use:

    -   `helmet.js` for security headers
    -   `cors` to control API access
    -   `rate-limit` to prevent brute-force attacks

---

## **DELIVERABLES**

-   GitHub repo with meaningful commits and README
-   Frontend deployed (e.g., Vercel/Netlify)
-   Backend deployed (e.g., Render/Railway)
-   Sample credentials (Admin, Teacher, Student)
-   **Optional:** Video walkthrough/demo

---

## **Frequently Asked Questions (FAQs)**

**1. Do we need to build the system from scratch?**
No. The base code exists. You need to extend and secure it.

**2. Where is the base code?**
You’ll receive it or access the deployed version.

**3. Is React required?**
Yes, continue using **React.js** as the frontend is built with React + Node.js + MongoDB.

**4. What are the user roles?**

-   **Admin**: Full access
-   **Teacher**: Assigned batches only
-   **Student**: Only their profile/data

**5. Do we need to build login again?**
Not if it's already implemented. Just ensure:

-   bcrypt password hashing
-   JWT issuing and expiry
-   Token storage and validation

**6. Use real DB or dummy data?**
Use **MongoDB** (local or Atlas). You can start with dummy data, but final version must use MongoDB.

**7. How to validate forms?**

-   Backend: `express-validator`
-   Frontend: Client-side validation (for UX only)

**8. Must-have security features?**

-   bcrypt password hashing
-   JWT-based auth with role checks
-   File upload restrictions
-   Sanitized inputs and responses
-   Route protection

**9. What should Admin Dashboard include?**

-   Student/Teacher/Course stats
-   Management links
-   Announcements and logs
-   Secure and responsive UI

**10. Student profile capabilities?**

-   View and edit contact info
-   View courses, homework, exams
-   Upload profile picture

**11. How to secure uploaded files?**

-   Restrict to .pdf, .jpeg, .png, .mp4
-   Use **Cloudinary**
-   File size limit
-   Sanitize filenames

**12. Can we use 3rd-party packages?**
Yes! Use:

-   Cloudinary
-   Helmet
-   CORS
-   Rate-limit

**13. Evaluation Criteria**

-   Feature completeness
-   Code quality and security
-   Responsive design
-   Clean GitHub history
-   Functional deployment

**14. What if we need help?**

-   Ask your mentor/team lead
-   Share GitHub repo + issue
-   Use intern support group for troubleshooting

---

### ✅ **Important Completion Checklist**

-   [ ] Functional Admin Dashboard
-   [ ] Secure Student Profile Page
-   [ ] JWT-based role authentication
-   [ ] Input/File validation
-   [ ] Password hashing
-   [ ] Mobile responsiveness
