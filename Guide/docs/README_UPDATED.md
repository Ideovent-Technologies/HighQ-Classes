# 🎓 HighQ Classes – School Management Web Platform

This is a full-stack school management web application for local teachers## 👥 Team Members

-   Avinash - Authentication System
-   Sumit - Admin Dashboard
-   Gauri - Student Records Management
-   Ishika - Teacher Dashboard
-   Honey - Fee Management System
-   Hardik - Notice & Announcements System
-   Prince - Resource Sharing Platform
-   Sachin - Class Recordings & Mediants under the banner of _Ideovent Technologies_.

The platform helps teachers manage students, fee records, online classes, and study resources — all in one place.

---

## 📌 Project Status

🚧 This project is currently in the development phase.  
👨‍💻 8 team members have been assigned specific modules.  
📆 Development started: July 2025  
🎯 Expected completion: August 2025 (One month timeline)

---

## 🚀 Tech Stack

### Frontend

-   _React.js_ with TypeScript
-   _Vite_ for build tooling
-   _Shadcn UI_ components
-   _React Hook Form_ + Zod for form validation
-   _React Router_ for navigation
-   _Recharts_ for analytics visualizations

### Backend

-   _Node.js_ with Express.js
-   _MongoDB_ for database
-   _JWT_ for authentication
-   _Cloudinary_ for file storage
-   _Stripe_ for payment processing
-   _Nodemailer_ for email notifications

---

## 📚 Project Modules & Team Assignment

| Module                         | Description                                         | Assigned To |
| ------------------------------ | --------------------------------------------------- | ----------- |
| 🔐 **Authentication System**   | Registration, Login, Password Reset                 | Avinash     |
| 👤 **Admin Dashboard**         | Dashboard UI, Statistics, System Settings           | Sumit       |
| 📅 **Student Records**         | Student Profiles, Batch Management, Attendance      | Gauri       |
| 🎓 **Teacher Dashboard**       | Teacher UI, Class Management, Schedule              | Ishika      |
| 💸 **Fee Management**          | Fee Structure, Payments, Month-wise Tracking        | Honey       |
| 📢 **Notices & Announcements** | Notice Creation, Distribution, Alerts               | Hardik      |
| 📁 **Resource Sharing**        | File Uploads, Resource Organization, Access Control | Prince      |
| 🧠 **Class Recordings**        | Video Storage, 3-Day Access System, Media Player    | Sachin      |

For detailed work division and responsibilities, see [Work-Division.md](./Work-Division.md)

---

## 🛠 Contribution Guidelines

Please follow these rules strictly:

1. **Do not push code to the main branch directly.**
2. Create a new branch using this format:  
   feature/<your-name>-<module-name>
3. After completing your task, create a _Pull Request_.
4. Mention what you added/changed in the PR description.
5. Only maintainers will review and merge your code to main.

---

## ✅ Example Workflow

```bash
git checkout -b feature/gauri-teacher-ui
# Make changes
git add .
git commit -m "feat(teacher): Added Teacher Dashboard UI"
git push origin feature/gauri-teacher-ui
```

---

## 🔄 Development Workflow

### Project Timeline

| Phase                | Duration | Key Deliverables                                 |
| -------------------- | -------- | ------------------------------------------------ |
| Setup & Planning     | 3 days   | Project structure, initial setup, detailed tasks |
| Core Development     | 2 weeks  | Core functionality of all modules                |
| Integration          | 5 days   | Connecting modules, resolving dependencies       |
| Testing & Refinement | 4 days   | Bug fixing, optimization, final adjustments      |
| Deployment           | 3 days   | Production deployment, documentation             |

### Getting Started

1. Clone the repository:

    ```bash
    git clone https://github.com/Ideovent-Technologies/HighQ-Classes.git
    cd HighQ-Classes
    ```

2. Install frontend dependencies:

    ```bash
    cd HighQ-Classes
    npm install
    ```

3. Install backend dependencies:

    ```bash
    cd ../Server
    npm install
    ```

4. Set up environment variables:

    - Create `.env` file in the root directory
    - Create `.env` file in the Server directory

5. Start development servers:

    ```bash
    # Frontend (from HighQ-Classes directory)
    npm run dev

    # Backend (from Server directory)
    npm run dev
    ```

---

## 📝 Documentation

-   [Project Structure](./project-structure.md)
-   [Project Workflow](./Project-Workflow.md)
-   [Work Division](./Work-Division.md)

---

## 👥 Team Members

-   [Member 1] - Authentication System
-   [Member 2] - Admin Dashboard
-   [Member 3] - Student Records Management
-   [Member 4] - Teacher Dashboard
-   [Member 5] - Fee Management System
-   [Member 6] - Notice & Announcements System
-   [Member 7] - Resource Sharing Platform
-   [Member 8] - Class Recordings & Media
