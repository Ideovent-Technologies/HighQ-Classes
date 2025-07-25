Features – Student User Experience

🔥 1. Dashboard Overview (After Login)
View batch information

See today’s or upcoming class schedule

View recent notices

Check fee status

See recent study materials & recordings



👤 2. Profile Management
View personal information

Update email / phone

Change password 🔐

Upload profile picture



📘 3. Course Access
View enrolled courses

See course topics/syllabus

Access:

Notes

Study resources

Assignments

View attendance history

Check upcoming classes



💸 4. Fee Management
View fee structure

Check payment history

See due dates



📁 5. Study Materials
Browse materials by batch/course

View / download files

Access class recordings (latest)




📁 Project Structure

HighQ-Classes/
└── server/
    ├── controllers/
    │   ├── studentController.js
    │   ├── studentDashboardController.js
    │   └── courseController.js
    ├── models/
    │   ├── Student.js
    │   ├── Course.js
    │   ├── User.js
    │   └── ...others (Material, Fee, etc.)
    ├── routes/
    │   ├── studentRoutes.js
    │   ├── studentDashboardRoutes.js
    │   ├── courseRoutes.js
    ├── middleware/
    │   ├── authMiddleware.js
    │   └── uploadMiddleware.js
    ├── config/
    ├── utils/
    ├── server.js


🚀 How to Run
1. Install Dependencies
bash
npm install
2. Start Server
bash
npm run dev
# or
node server.js
3. Add .env File
text
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/highq
JWT_SECRET=your_secret_key
🔐 Auth Middleware
Secure routes using JWT + role checking:

js
router.use(authenticate);          // Checks JWT
router.use(authorizeStudent);      // Ensures "student" role


⚙️ Core APIs

### 👤 **Student Profile APIs**

| Method | Route                             | Description               |
|--------|-----------------------------------|---------------------------|
| GET    | `/api/student/:id/profile`        | View profile              |
| PATCH  | `/api/student/:id/profile`        | Update phone/email        |
| PATCH  | `/api/student/:id/change-password`| Change password           |
| POST   | `/api/student/:id/profile-picture`| Upload profile picture    |

### 📊 **Student Dashboard API**

| Method | Route                     | Purpose                                        |
|--------|---------------------------|------------------------------------------------|
| GET    | `/api/student/dashboard`  | Dashboard cards (classes, fee, materials, topics, recordings) |

### 📘 **Course APIs**

| Method | Route               | Description                  |
|--------|---------------------|------------------------------|
| GET    | `/api/course/`      | List of all courses + topics |
| PATCH  | `/api/course/:id`   | Update a course (admin)      |

### 📚 **Study Materials + Recordings**

| Type       | Covered In Route                | Fields                      |
|------------|----------------------------------|------------------------------|
| Materials  | `Material.js`, `/api/student/dashboard`  | `title`, `fileUrl`, `downloads` |
| Recordings | `Recording.js`, `/api/student/dashboard` | `title`, `views`, `expires`     |

