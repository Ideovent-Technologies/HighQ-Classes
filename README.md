# 📚 HighQ Classes - Complete Learning Management System

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green.svg)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-blue.svg)](https://tailwindcss.com/)

## 🎯 Overview

**HighQ Classes** is a comprehensive Learning Management System (LMS) designed to bridge the gap between traditional classroom teaching and modern digital education. Built for coaching institutes, schools, and educational organizations, it provides a seamless experience for students, teachers, and administrators.

### 🌟 Key Features

-   **🔐 Role-Based Access Control**: Secure authentication system with distinct roles (Admin, Teacher, Student)
-   **📊 Interactive Dashboards**: Personalized dashboards for each user type with analytics and insights
-   **💰 Fee Management**: Complete fee tracking, payment processing, and financial analytics
-   **📚 Course Management**: Comprehensive course creation, enrollment, and progress tracking
-   **🎥 Recording Management**: Video upload, streaming, and access control for recorded sessions
-   **📝 Assignment System**: Assignment creation, submission, grading, and feedback
-   **📅 Schedule Management**: Class scheduling, attendance tracking, and calendar integration
-   **📢 Notice Board**: Real-time announcements and communication system
-   **📖 Material Management**: Study material upload, categorization, and distribution
-   **📞 Contact System**: Integrated contact form and inquiry management

## 🏗️ Architecture

### Frontend Architecture

```
HighQ-Classes/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Route components
│   ├── contexts/           # React contexts for state management
│   ├── hooks/              # Custom React hooks
│   ├── API/                # API service layer
│   ├── types/              # TypeScript type definitions
│   ├── lib/                # Utility libraries
│   └── modules/            # Feature-specific modules
```

### Backend Architecture

```
Server/
├── controllers/            # Route controllers
├── models/                # MongoDB schema models
├── routes/                # API route definitions
├── middleware/            # Custom middleware functions
├── config/                # Configuration files
├── services/              # Business logic services
├── utils/                 # Utility functions
└── scripts/               # Database scripts
```

## 🚀 Tech Stack

### Frontend

-   **React 18.3.1** - Modern React with hooks and context
-   **TypeScript 5.5.3** - Type safety and enhanced developer experience
-   **Vite** - Fast build tool and development server
-   **Tailwind CSS** - Utility-first CSS framework
-   **Radix UI** - Accessible component primitives
-   **Framer Motion** - Animation library
-   **React Router DOM** - Client-side routing
-   **Axios** - HTTP client for API calls
-   **React Hook Form** - Form handling with validation
-   **Recharts** - Data visualization and charts

### Backend

-   **Node.js** - JavaScript runtime
-   **Express.js** - Web application framework
-   **MongoDB** - NoSQL database
-   **Mongoose** - MongoDB object modeling
-   **JWT** - JSON Web Token authentication
-   **Bcrypt** - Password hashing
-   **Multer** - File upload handling
-   **Cloudinary** - Media management and optimization
-   **Nodemailer** - Email service integration

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

-   **Node.js** (v16 or higher)
-   **MongoDB** (v5 or higher)
-   **Git**

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ideovent-Technologies/HighQ-Classes.git
cd HighQ-Classes
```

### 2. Backend Setup

```bash
cd Server
npm install

# Create environment file
cp .env.example .env
```

Configure your `.env` file with the following variables:

```env
# Database
MONGO_URI=mongodb://localhost:27017/highq-classes

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Frontend Setup

```bash
cd HighQ-Classes
npm install
```

### 4. Start the Application

#### Start Backend Server

```bash
cd Server
npm start
```

The backend server will run on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd HighQ-Classes
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔑 Default Admin Credentials

After setting up the database, you can create an admin account using the seeding script:

```bash
cd Server
npm run seed
```

Default credentials:

-   **Email**: admin@highqclasses.com
-   **Password**: Admin@123

## 📚 API Documentation

The complete API documentation is available in the `COMPLETE_API_DOCUMENTATION.md` file, which includes:

-   **80+ API Endpoints** across all modules
-   **Authentication & Security** implementation details
-   **Request/Response** examples for every endpoint
-   **Error Handling** patterns and status codes
-   **Rate Limiting** and security measures

### Quick API Overview

-   **Authentication**: 8 endpoints (login, register, password reset, etc.)
-   **Student Management**: 5 endpoints (profile, dashboard, enrollment)
-   **Teacher Management**: 3 endpoints (profile, dashboard, student management)
-   **Admin Management**: 14 endpoints (full system control)
-   **Course Management**: 7 endpoints (CRUD operations, enrollment)
-   **Fee Management**: 7 endpoints (payment processing, tracking)
-   **Material Management**: 6 endpoints (upload, access control)
-   **Recording Management**: 9 endpoints (video handling, analytics)
-   **Assignment Management**: 8 endpoints (creation, submission, grading)
-   **Attendance Management**: 4 endpoints (marking, tracking)
-   **Notice Management**: 5 endpoints (announcements, notifications)
-   **Contact Management**: 3 endpoints (inquiry handling)

## 🎭 User Roles & Permissions

### 👨‍💼 Admin

-   **Full System Access**: Complete control over all modules
-   **User Management**: Create, update, delete users
-   **Analytics Dashboard**: Comprehensive system analytics
-   **Fee Management**: Payment processing and financial reports
-   **Content Management**: Upload and manage all educational content

### 👨‍🏫 Teacher

-   **Course Management**: Create and manage assigned courses
-   **Student Interaction**: View enrolled students and track progress
-   **Content Upload**: Upload materials, recordings, and assignments
-   **Attendance Management**: Mark and track student attendance
-   **Grade Management**: Grade assignments and provide feedback

### 👨‍🎓 Student

-   **Course Access**: View enrolled courses and materials
-   **Assignment Submission**: Submit assignments and view grades
-   **Fee Tracking**: View fee status and payment history
-   **Progress Monitoring**: Track learning progress and performance
-   **Resource Access**: Download materials and watch recordings

## 📖 Educational Services

HighQ Classes supports various educational programs:

### 🎯 Core Programs

-   **Foundation Courses** (Class 6-10): Building strong conceptual foundations
-   **Competitive Exam Prep**: NTSE, Olympiad, and entrance exam preparation
-   **Board Exam Preparation**: Class 10 & 12 comprehensive programs
-   **Online Learning Programs**: Flexible digital-first education
-   **Offline Classroom Programs**: Traditional classroom experience

### 🛠️ Specialized Services

-   **Doubt Solving Support**: 24/7 doubt resolution via chat and video calls
-   **Test Preparation Series**: Weekly mock tests with detailed analytics
-   **Crash Courses**: Intensive revision programs before exams
-   **Career Counseling**: Personalized career guidance and roadmaps
-   **Skill Development Workshops**: Practical skills and personality development

## 🔒 Security Features

-   **JWT Authentication**: Secure token-based authentication with HTTP-only cookies
-   **Role-Based Authorization**: Granular permissions based on user roles
-   **Input Validation**: Comprehensive validation using express-validator
-   **SQL Injection Protection**: MongoDB sanitization and parameterized queries
-   **XSS Protection**: Cross-site scripting prevention
-   **Rate Limiting**: API rate limiting to prevent abuse
-   **Password Security**: Bcrypt hashing with salt rounds
-   **Account Lockout**: Protection against brute force attacks
-   **Email Verification**: Account verification via email
-   **Secure File Upload**: File type validation and virus scanning

## 📱 Responsive Design

The application is fully responsive and optimized for:

-   **Desktop** (1920px and above)
-   **Laptop** (1024px - 1919px)
-   **Tablet** (768px - 1023px)
-   **Mobile** (320px - 767px)

## 🧪 Testing

### Running Tests

```bash
# Frontend tests
cd HighQ-Classes
npm run test

# Backend tests
cd Server
npm run test
```

### Test Coverage

-   **Unit Tests**: Component and function testing
-   **Integration Tests**: API endpoint testing
-   **E2E Tests**: Complete user journey testing

## 📊 Performance Optimization

-   **Code Splitting**: Automatic route-based code splitting with Vite
-   **Lazy Loading**: Component and image lazy loading
-   **Caching**: Browser caching and API response caching
-   **CDN Integration**: Cloudinary for optimized media delivery
-   **Bundle Optimization**: Tree shaking and minification
-   **Database Indexing**: Optimized MongoDB queries

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Configure environment variables

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. Configure production environment variables
2. Set up MongoDB Atlas for database
3. Configure Cloudinary for media storage
4. Deploy using your preferred platform

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 📈 Monitoring & Analytics

-   **Application Performance**: Real-time performance monitoring
-   **User Analytics**: Student engagement and progress tracking
-   **Error Tracking**: Comprehensive error logging and reporting
-   **Database Monitoring**: Query performance and optimization

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### Code Style Guidelines

-   Use TypeScript for type safety
-   Follow ESLint configuration
-   Write meaningful commit messages
-   Add JSDoc comments for functions
-   Maintain test coverage above 80%

## 📞 Support & Contact

-   **Email**: support@highqclasses.com
-   **Documentation**: Check the `/docs` folder for detailed guides
-   **Issues**: Create GitHub issues for bug reports
-   **Discussions**: Use GitHub Discussions for questions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   **Development Team**: Ideovent Technologies
-   **UI/UX Design**: Modern educational interface design
-   **Testing**: Comprehensive quality assurance
-   **Documentation**: Detailed technical documentation

---

## 📚 Additional Resources

-   [Frontend Documentation](./HighQ-Classes/README.md)
-   [Backend Documentation](./Server/Auth-docs/README.md)
-   [API Documentation](./COMPLETE_API_DOCUMENTATION.md)
-   [Deployment Guide](./Guide/docs/README_UPDATED.md)
-   [Project Structure](./Guide/docs/project-structure.md)

**Built with ❤️ by Ideovent Technologies**
