## 👤 Person 2: Admin & Batch Management (Sumit Sonar)

### 🔍 Focus Areas:
- Admin dashboard logic
- Batch & course handling
- Fee tracking and management

---

### 📁 Files & Responsibilities:

#### 🎯 Controllers:
- `controllers/admin.controller.js` – Handles admin dashboard data and audit log endpoints.
- `controllers/batch.controller.js` – Manages CRUD operations for batches and course assignments.
- `controllers/fee.controller.js` ✅ – Handles fee-related APIs: create, update, view, and track fee records.

#### 🧠 Models:
- `models/batch.model.js` – Defines the structure for batch data.
- `models/course.model.js` – Handles course-related schema used within batches.
- `models/fee.model.js` ✅ – Manages schema for fee collection, status, and history.

#### 🌐 Routes:
- `routes/admin.routes.js` – Exposes admin-specific endpoints such as dashboard overview and audit logs.
- `routes/batch.routes.js` – Contains endpoints for batch and course CRUD operations.
- `routes/fee.routes.js` ✅ – Defines APIs for fee management and fee history retrieval.

---

### 🧩 Functional Duties:

- ✅ **Implemented CRUD** for:
  - Teachers
  - Students
  - Batches

- ✅ **Admin Dashboard Overview**
  - Endpoint: `GET /admin/dashboard`
  - Provides summary stats like total batches, active students, pending fees, etc.

- ✅ **Audit Log Overview**
  - Setup to track and view actions performed by admin, such as user creation or fee updates.

- ✅ **Fee Management APIs**
  - Add and update fee records per student or batch
  - View fees by status (paid, unpaid, partial)
  - Integrated with batch and student modules

- ✅ **Fee History by Student or Batch**
  - Easily trace historical fee transactions by student ID or batch name
  - Filter and sort fee data for admin insight

---

### 📌 Note:
All APIs are secured via middleware to ensure role-based access (admin, teacher, student). Proper validation and error handling are implemented across all routes and models.

---

