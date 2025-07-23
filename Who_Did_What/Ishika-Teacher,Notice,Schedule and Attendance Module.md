
# 👩‍🏫 HighQ Backend – Teacher, Notice, Schedule & Attendance Modules

**Implemented by Ishika**

---

## 📌 Overview

This document outlines all modules implemented by Ishika for the **HighQ Classes Backend**, including:

* 👤 Teacher Profile Management
* 📣 Notice Management
* 📅 Schedule Management
* 📋 Attendance Tracking

All features are protected via authentication middleware and follow RESTful API conventions.

---

## ✅ Features Implemented

### 1. 👨‍🏫 Teacher Profile Management

* **View Profile**
* **Update Profile Info** (name, mobile, profile picture)
* **Change Password** (planned)

---

### 2. 📣 Notice Management

* **Create Notices**

  * Target: All, Batch, or Individual Student
  * Optional scheduling using `scheduledAt`
* **Edit & Delete Notices**
* **View All Notices** with filters (by audience, batch, student)
* **Pagination support**
* **Scheduled Posting** via `node-cron`

---

### 3. 📅 Schedule Management (NEW)

* **Create Class Schedules** for a batch:

  * Specify subject, topic, start & end time
* **View Today’s Schedule**
* **Update Schedule**
* **Delete Schedule**

✅ *Time filtering logic for today’s schedule is included in the dashboard view.*

---

### 4. 📋 Attendance Management (NEW)

* **Mark Attendance**

  * For specific batch + date
  * Mark students as present/absent
* **View Attendance Record** for a batch on a date
* **Update Attendance** (by re-submission for same date)

---

## 🧾 API Endpoints

### 👨‍🏫 Teacher Routes (`/api/teacher`)

| Method | Endpoint           | Function                   |
| ------ | ------------------ | -------------------------- |
| `GET`  | `/profile`         | Get profile                |
| `PUT`  | `/profile`         | Update name, mobile, image |
| `PUT`  | `/change-password` | *(Planned)*                |

---

### 📣 Notice Routes (`/api/teacher/notices`)

| Method   | Endpoint | Function                       |
| -------- | -------- | ------------------------------ |
| `POST`   | `/`      | Create notice                  |
| `GET`    | `/`      | Get all notices (with filters) |
| `GET`    | `/:id`   | Get one notice                 |
| `PUT`    | `/:id`   | Update notice                  |
| `DELETE` | `/:id`   | Delete notice                  |

---

### 📅 Schedule Routes (`/api/teacher/schedules`)

| Method   | Endpoint | Function              |
| -------- | -------- | --------------------- |
| `POST`   | `/`      | Create schedule       |
| `GET`    | `/today` | View today’s schedule |
| `PUT`    | `/:id`   | Update schedule       |
| `DELETE` | `/:id`   | Delete schedule       |

---

### 📋 Attendance Routes (`/api/teacher/attendance`)

| Method | Endpoint | Function                               |
| ------ | -------- | -------------------------------------- |
| `POST` | `/mark`  | Submit attendance for a batch          |
| `GET`  | `/`      | View attendance for batch/date         |
| `PUT`  | `/mark`  | Update attendance (same endpoint used) |

---

## 🗂️ Files Created/Modified

### 🧑‍🏫 Teacher

* `models/Teacher.js`
* `controllers/teacherController.js`
* `routes/teacherRoutes.js`

### 📣 Notices

* `models/Notice.js`
* `controllers/noticeController.js`
* `routes/noticeRoutes.js`

### 📅 Schedule

* `models/Schedule.js`
* `controllers/scheduleController.js`
* `routes/scheduleRoutes.js`

### 📋 Attendance

* `models/Attendance.js`
* `controllers/attendanceController.js`
* `routes/attendanceRoutes.js`

---

## 📄 Sample Schemas

### 🧑‍🏫 Teacher

```js
{
  name, email, password,
  mobile, subject,
  profilePicture,
  role: { type: String, default: "teacher" }
}
```

### 📣 Notice

```js
{
  title, description,
  postedBy: ObjectId,
  audience: "all" | "batch" | "student",
  batch: ObjectId,
  student: ObjectId,
  isScheduled: Boolean,
  scheduledAt: Date
}
```

### 📅 Schedule

```js
{
  batch: ObjectId,
  teacher: ObjectId,
  subject, topic,
  startTime, endTime
}
```

### 📋 Attendance

```js
{
  batch: ObjectId,
  date: Date,
  teacher: ObjectId,
  records: [
    {
      student: ObjectId,
      status: "present" | "absent"
    }
  ]
}
```

---

## 🛡️ Middleware

* All routes are protected with:
  `protectTeacher = [protect, authorize('teacher')]`

---

## ⚠️ Error Format

```json
{
  "success": false,
  "message": "Invalid input or unauthorized"
}
```

| Code | Description  |
| ---- | ------------ |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 403  | Forbidden    |
| 404  | Not Found    |
| 500  | Server Error |

---

## 🔮 Future Enhancements

* 🔁 Schedule recurrence (weekly classes)
* ⏰ Reminder system for scheduled classes
* 📎 Attachments in notices
* 📧 Notify students via mail/Dashboard
* 📊 Attendance analytics for teachers

---

