# Class Recordings & Media Module

This module provides functionality for uploading, managing, and accessing class recordings with a 3-day access limitation. It includes video storage, organization, and analytics features.

## Features

-   Upload and store class recordings
-   Automatic 3-day access limitation
-   Video organization by course, batch, and subject
-   Video engagement analytics
-   Access control based on user roles

## API Endpoints

### Recording Management

| Method | Endpoint                     | Description                       | Access                |
| ------ | ---------------------------- | --------------------------------- | --------------------- |
| POST   | `/api/recordings`            | Upload a new recording            | Teachers, Admins      |
| GET    | `/api/recordings`            | Get all recordings (filtered)     | Teachers, Admins      |
| GET    | `/api/recordings/student`    | Get student accessible recordings | Students              |
| GET    | `/api/recordings/:id`        | Get a specific recording          | All authenticated     |
| PUT    | `/api/recordings/:id`        | Update recording details          | Owner Teacher, Admins |
| DELETE | `/api/recordings/:id`        | Delete a recording                | Owner Teacher, Admins |
| PUT    | `/api/recordings/:id/extend` | Extend access duration            | Owner Teacher, Admins |
| GET    | `/api/recordings/analytics`  | Get recording analytics           | Teachers, Admins      |

## Implementation Details

### Database Schema

The `Recording` model includes:

-   Basic info (title, description)
-   File details (URL, file ID, thumbnail URL, duration)
-   Organization info (subject, batch, course, teacher)
-   Access control (expiration date, active status)
-   Analytics data (views, viewedBy)

### 3-Day Access System

Recordings are automatically set to expire 3 days after upload. A scheduled task runs daily to check and deactivate expired recordings. Teachers and admins can extend access as needed.

### Video Storage

Videos are stored in Cloudinary with proper access controls. The system generates thumbnails automatically and supports streaming playback.

### Analytics

The system tracks:

-   Total views per recording
-   Unique viewers
-   Individual student view counts
-   View timestamps
-   Subject-wise engagement

## Setup

1. Configure Cloudinary credentials in `.env` file:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. Ensure the temporary directory exists for file uploads:

```bash
mkdir -p temp
```

3. Install required dependencies:

```bash
npm install
```

## Usage Examples

### Upload a Recording

```javascript
// Example frontend code (React)
const handleUpload = async (formData) => {
    const response = await fetch("/api/recordings", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();
    if (data.success) {
        console.log("Recording uploaded successfully:", data.data);
    }
};
```

### Get Student Recordings

```javascript
// Example frontend code (React)
const fetchStudentRecordings = async () => {
    const response = await fetch("/api/recordings/student", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json();
    if (data.success) {
        setRecordings(data.data);
    }
};
```

### Extend Recording Access

```javascript
// Example frontend code (React)
const extendAccess = async (recordingId, days) => {
    const response = await fetch(`/api/recordings/${recordingId}/extend`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ days }),
    });

    const data = await response.json();
    if (data.success) {
        console.log("Access extended successfully:", data.data);
    }
};
```
