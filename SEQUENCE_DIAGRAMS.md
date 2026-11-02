# Certus Diagnostics - Sequence Diagrams

This document contains sequence diagrams for the major workflows in the Certus Diagnostics system.

---

## 1. Patient Google OAuth Sign-In Flow

```mermaid
sequenceDiagram
    actor Patient
    participant Client as React Client<br/>(Certus-Client)
    participant Google as Google OAuth
    participant API as PHP API<br/>(google-auth.php)
    participant DB as MySQL Database

    Patient->>Client: Click "Sign In with Google"
    Client->>Google: Initiate OAuth Flow<br/>(@react-oauth/google)
    Google->>Patient: Show Google Login Screen
    Patient->>Google: Enter credentials & approve
    Google->>Client: Return credential token
    
    Client->>API: POST /api/google-auth.php<br/>{credential: token}
    API->>API: Decode JWT token
    API->>DB: Check if user exists<br/>SELECT * FROM patients WHERE google_id=?
    
    alt User exists
        DB->>API: Return user data
        API->>DB: UPDATE last_login timestamp
    else New user
        DB->>API: User not found
        API->>DB: INSERT new patient record<br/>(name, email, google_id, profile_picture)
        DB->>API: Return new user ID
    end
    
    API->>Client: Return JSON<br/>{success: true, user: {...}}
    Client->>Client: Store user in AuthContext
    Client->>Client: Check if phone number exists
    
    alt Phone number missing
        Client->>Patient: Show PhoneNumberCollection modal
        Patient->>Client: Enter phone number
        Client->>API: POST /api/update-user-phone.php<br/>{patient_id, phone}
        API->>DB: UPDATE patients SET phone=?
        DB->>API: Confirm update
        API->>Client: {success: true}
    end
    
    Client->>Patient: Redirect to Dashboard
```

---

## 2. Admin Google OAuth Sign-In Flow

```mermaid
sequenceDiagram
    actor Admin
    participant AdminClient as React Admin<br/>(Certus-Admin)
    participant Google as Google OAuth
    participant API as PHP API<br/>(admin-google-auth.php)
    participant DB as MySQL Database

    Admin->>AdminClient: Click "Sign In with Google"
    AdminClient->>Google: Initiate OAuth Flow
    Google->>Admin: Show Google Login Screen
    Admin->>Google: Enter credentials & approve
    Google->>AdminClient: Return credential token
    
    AdminClient->>API: POST /api/admin-google-auth.php<br/>{credential: token}
    API->>API: Decode JWT token
    API->>DB: SELECT * FROM admins WHERE google_id=?
    
    alt Admin exists
        DB->>API: Return admin data
        API->>DB: UPDATE last_login
        API->>AdminClient: {success: true, admin: {...}}
        AdminClient->>Admin: Redirect to Admin Dashboard
    else Admin not found
        DB->>API: No admin found
        API->>DB: Check admin_approval_requests table
        
        alt Already requested
            API->>AdminClient: {success: false, message: "Approval pending"}
            AdminClient->>Admin: Show "Awaiting approval" message
        else New request
            API->>API: Generate approval token
            API->>DB: INSERT INTO admin_approval_requests<br/>(name, email, google_id, token)
            API->>API: Send approval email to super admin
            API->>AdminClient: {success: false, message: "Request sent"}
            AdminClient->>Admin: Show "Request submitted" message
        end
    end
```

---

## 3. Patient Report Viewing Flow

```mermaid
sequenceDiagram
    actor Patient
    participant Client as React Client
    participant API as PHP API<br/>(reports.php)
    participant DB as MySQL Database
    participant Storage as File System

    Patient->>Client: Navigate to "Your Reports"
    Client->>Client: Get patient_id from AuthContext
    
    Client->>API: GET /api/reports.php?patient_id={id}
    API->>API: Validate patient_id
    API->>DB: SELECT * FROM reports<br/>WHERE patient_id=? ORDER BY date DESC
    DB->>API: Return report records
    API->>Client: {success: true, data: [reports]}
    
    Client->>Patient: Display reports list<br/>(test name, date, status)
    
    alt View Report
        Patient->>Client: Click "View Report"
        Client->>API: GET /api/download-report.php?report_id={id}
        API->>DB: SELECT file_path FROM reports WHERE report_id=?
        DB->>API: Return file path
        API->>Storage: Check if file exists
        Storage->>API: File found
        API->>API: Set headers (Content-Type: application/pdf)
        API->>Client: Stream file content
        Client->>Patient: Open PDF in browser/download
    end
    
    alt Download Report
        Patient->>Client: Click "Download"
        Client->>API: GET /api/download-report.php?report_id={id}&download=1
        API->>Storage: Read file
        API->>Client: Force download with headers
        Client->>Patient: Save file to computer
    end
```

---

## 4. Admin - Upload Report for Patient

```mermaid
sequenceDiagram
    actor Admin
    participant AdminClient as React Admin
    participant API as PHP API<br/>(upload-report.php)
    participant DB as MySQL Database
    participant Storage as File System
    participant Email as Email Service

    Admin->>AdminClient: Navigate to Patient Details
    AdminClient->>API: GET /api/patients.php?id={patient_id}
    API->>DB: SELECT * FROM patients WHERE patient_id=?
    DB->>API: Return patient data
    API->>AdminClient: {success: true, patient: {...}}
    
    Admin->>AdminClient: Click "Upload Report"
    Admin->>AdminClient: Select PDF file + test details
    Admin->>AdminClient: Click Submit
    
    AdminClient->>API: POST /api/upload-report.php<br/>FormData: {patient_id, test_id, file}
    API->>API: Validate file (PDF, size limit)
    
    alt Valid file
        API->>Storage: Save file to /uploads/reports/
        Storage->>API: Return file path
        API->>DB: INSERT INTO reports<br/>(patient_id, test_id, file_path, status)
        DB->>API: Return report_id
        
        API->>DB: SELECT email FROM patients WHERE patient_id=?
        DB->>API: Return patient email
        
        API->>Email: Send notification email<br/>"Your report is ready"
        Email->>API: Email sent confirmation
        
        API->>AdminClient: {success: true, message: "Report uploaded"}
        AdminClient->>Admin: Show success notification
    else Invalid file
        API->>AdminClient: {success: false, error: "Invalid file"}
        AdminClient->>Admin: Show error message
    end
```

---

## 5. Patient - Book a Test/Package

```mermaid
sequenceDiagram
    actor Patient
    participant Client as React Client
    participant TestAPI as PHP API<br/>(tests.php)
    participant PackageAPI as PHP API<br/>(packages.php)
    participant DB as MySQL Database

    Patient->>Client: Navigate to "Book A Test"
    
    par Fetch Tests
        Client->>TestAPI: GET /api/tests.php
        TestAPI->>DB: SELECT * FROM tests WHERE active=1
        DB->>TestAPI: Return tests
        TestAPI->>Client: {success: true, data: [tests]}
    and Fetch Packages
        Client->>PackageAPI: GET /api/packages.php
        PackageAPI->>DB: SELECT * FROM packages WHERE active=1
        DB->>PackageAPI: Return packages
        PackageAPI->>Client: {success: true, data: [packages]}
    end
    
    Client->>Patient: Display tests & packages with images
    
    alt Search Tests
        Patient->>Client: Enter search term
        Client->>TestAPI: GET /api/tests.php?search={term}
        TestAPI->>DB: SELECT * FROM tests<br/>WHERE name LIKE ? OR category LIKE ?
        DB->>TestAPI: Return filtered tests
        TestAPI->>Client: {success: true, data: [filtered]}
        Client->>Patient: Update display
    end
    
    Patient->>Client: Select test/package
    Client->>Patient: Show booking modal<br/>(date, time, location selection)
    Patient->>Client: Fill booking details
    Patient->>Client: Confirm booking
    
    Note over Client,DB: Booking confirmation flow<br/>(would connect to bookings API)
```

---

## 6. Admin - Manage Patients

```mermaid
sequenceDiagram
    actor Admin
    participant AdminClient as React Admin
    participant API as PHP API<br/>(patients.php)
    participant DB as MySQL Database

    Admin->>AdminClient: Navigate to "Patients" page
    AdminClient->>API: GET /api/patients.php
    API->>DB: SELECT * FROM patients<br/>ORDER BY created_at DESC
    DB->>API: Return all patients
    API->>AdminClient: {success: true, data: [patients]}
    AdminClient->>Admin: Display patients table
    
    alt Search Patient
        Admin->>AdminClient: Enter search term (name/email/phone)
        AdminClient->>API: GET /api/patients.php?search={term}
        API->>DB: SELECT * FROM patients<br/>WHERE name LIKE ? OR email LIKE ? OR phone LIKE ?
        DB->>API: Return filtered results
        API->>AdminClient: {success: true, data: [filtered]}
        AdminClient->>Admin: Update table
    end
    
    alt View Patient Details
        Admin->>AdminClient: Click patient row
        AdminClient->>API: GET /api/patients.php?id={patient_id}
        API->>DB: SELECT * FROM patients WHERE patient_id=?
        DB->>API: Return patient data
        API->>AdminClient: {success: true, patient: {...}}
        
        par Fetch Patient Reports
            AdminClient->>API: GET /api/reports.php?patient_id={id}
            API->>DB: SELECT * FROM reports WHERE patient_id=?
            DB->>API: Return reports
            API->>AdminClient: {success: true, data: [reports]}
        end
        
        AdminClient->>Admin: Show patient detail modal<br/>(info, reports, history)
    end
    
    alt Edit Patient
        Admin->>AdminClient: Click "Edit"
        AdminClient->>Admin: Show edit form
        Admin->>AdminClient: Update details
        Admin->>AdminClient: Click "Save"
        AdminClient->>API: PUT /api/patients.php<br/>{patient_id, updated_data}
        API->>DB: UPDATE patients SET ... WHERE patient_id=?
        DB->>API: Confirm update
        API->>AdminClient: {success: true}
        AdminClient->>Admin: Show success + refresh list
    end
```

---

## 7. Google Reviews Fetch Flow

```mermaid
sequenceDiagram
    participant Client as React Client
    participant API as PHP API<br/>(google-reviews.php)
    participant Controller as GoogleReviewController
    participant DB as MySQL Database
    participant Google as Google Places API

    Client->>API: GET /api/google-reviews.php
    API->>Controller: new GoogleReviewController($pdo)
    API->>Controller: getReviews()
    
    Controller->>DB: SELECT * FROM google_reviews<br/>ORDER BY review_time DESC LIMIT 10
    
    alt Reviews exist & recent
        DB->>Controller: Return cached reviews
        Controller->>API: Return reviews array
        API->>Client: {success: true, data: [reviews]}
    else No reviews or outdated
        DB->>Controller: Empty or old data
        Controller->>Google: Fetch fresh reviews<br/>(Google Places API)
        Google->>Controller: Return review data
        
        loop For each review
            Controller->>DB: INSERT/UPDATE review<br/>(author, rating, text, time)
        end
        
        Controller->>API: Return fresh reviews
        API->>Client: {success: true, data: [reviews]}
    end
    
    Client->>Client: Display in TestimonialsCarousel
    
    alt API Error
        API-->>Client: {success: false, message: "Error"}
        Client->>Client: Show fallback testimonials<br/>(hardcoded in component)
    end
```

---

## 8. Admin Dashboard Analytics Flow

```mermaid
sequenceDiagram
    actor Admin
    participant AdminClient as React Admin
    participant API as PHP API<br/>(dashboard.php)
    participant DB as MySQL Database

    Admin->>AdminClient: Navigate to Dashboard
    AdminClient->>API: GET /api/dashboard.php
    
    par Fetch Statistics
        API->>DB: SELECT COUNT(*) FROM patients
        DB->>API: Total patients count
    and
        API->>DB: SELECT COUNT(*) FROM reports<br/>WHERE status='completed'
        DB->>API: Completed reports count
    and
        API->>DB: SELECT COUNT(*) FROM reports<br/>WHERE status='pending'
        DB->>API: Pending reports count
    and
        API->>DB: SELECT COUNT(*) FROM patients<br/>WHERE DATE(created_at) = CURDATE()
        DB->>API: Today's registrations
    and
        API->>DB: SELECT DATE(created_at), COUNT(*)<br/>FROM patients<br/>GROUP BY DATE(created_at)<br/>ORDER BY DATE DESC LIMIT 30
        DB->>API: Patient growth data
    and
        API->>DB: SELECT test_name, COUNT(*)<br/>FROM reports<br/>GROUP BY test_id<br/>ORDER BY COUNT DESC LIMIT 10
        DB->>API: Popular tests
    end
    
    API->>AdminClient: {<br/>  totalPatients,<br/>  completedReports,<br/>  pendingReports,<br/>  todayRegistrations,<br/>  growthData,<br/>  popularTests<br/>}
    
    AdminClient->>AdminClient: Render Chart.js charts<br/>(Line, Bar, Doughnut)
    AdminClient->>Admin: Display dashboard with analytics
```

---

## 9. Test/Package Management (Admin)

```mermaid
sequenceDiagram
    actor Admin
    participant AdminClient as React Admin
    participant UploadAPI as upload.php
    participant TestAPI as tests.php
    participant DB as MySQL Database
    participant Storage as File System

    Admin->>AdminClient: Navigate to "Tests" page
    
    par Load Data
        AdminClient->>TestAPI: GET /api/tests.php
        TestAPI->>DB: SELECT * FROM tests
        DB->>TestAPI: Return tests
        TestAPI->>AdminClient: {success: true, data: [tests]}
    and
        AdminClient->>TestAPI: GET /api/packages.php
        TestAPI->>DB: SELECT * FROM packages
        DB->>TestAPI: Return packages
        TestAPI->>AdminClient: {success: true, data: [packages]}
    end
    
    AdminClient->>Admin: Display tests & packages
    
    alt Add New Test
        Admin->>AdminClient: Click "Add Test"
        Admin->>AdminClient: Fill form + upload image
        Admin->>AdminClient: Submit
        
        AdminClient->>UploadAPI: POST /api/upload.php<br/>FormData: {file, type: 'test'}
        UploadAPI->>Storage: Save image to /uploads/images/
        Storage->>UploadAPI: Return file path
        UploadAPI->>AdminClient: {success: true, file_path: "..."}
        
        AdminClient->>TestAPI: POST /api/tests.php<br/>{name, category, price, image_path}
        TestAPI->>DB: INSERT INTO tests (...)
        DB->>TestAPI: Return test_id
        TestAPI->>AdminClient: {success: true, test_id: X}
        AdminClient->>Admin: Show success + refresh list
    end
    
    alt Edit Test
        Admin->>AdminClient: Click "Edit" on test
        AdminClient->>Admin: Show edit modal with data
        Admin->>AdminClient: Update fields
        Admin->>AdminClient: Submit
        
        AdminClient->>TestAPI: PUT /api/tests.php<br/>{test_id, updated_data}
        TestAPI->>DB: UPDATE tests SET ... WHERE test_id=?
        DB->>TestAPI: Confirm update
        TestAPI->>AdminClient: {success: true}
        AdminClient->>Admin: Refresh list
    end
    
    alt Delete Test
        Admin->>AdminClient: Click "Delete"
        AdminClient->>Admin: Show confirmation dialog
        Admin->>AdminClient: Confirm deletion
        
        AdminClient->>TestAPI: DELETE /api/tests.php<br/>{test_id}
        TestAPI->>DB: DELETE FROM tests WHERE test_id=?
        DB->>TestAPI: Confirm deletion
        TestAPI->>AdminClient: {success: true}
        AdminClient->>Admin: Remove from list
    end
```

---

## 10. Error Handling & CORS Flow

```mermaid
sequenceDiagram
    participant Client as React Client<br/>(Any Origin)
    participant API as PHP API<br/>(Any endpoint)
    participant DB as MySQL Database

    Client->>API: OPTIONS /api/endpoint<br/>(Preflight request)
    API->>API: Check HTTP_ORIGIN
    
    alt Allowed Origin
        API->>Client: Headers:<br/>Access-Control-Allow-Origin: {origin}<br/>Allow-Methods: GET,POST,PUT,DELETE<br/>Allow-Headers: Content-Type, Authorization<br/>200 OK
    else Unknown Origin
        API->>Client: Access-Control-Allow-Origin: *<br/>200 OK
    end
    
    Client->>API: POST /api/endpoint<br/>{data}
    API->>API: ini_set('display_errors', 0)
    
    alt Success Path
        API->>DB: Execute query
        DB->>API: Return data
        API->>Client: Content-Type: application/json<br/>{success: true, data: ...}
    else Database Error
        DB-->>API: PDOException
        API->>API: error_log("DB error: ...")
        API->>Client: HTTP 500<br/>{success: false, message: "Database error"}
    else Validation Error
        API->>API: Detect invalid input
        API->>Client: HTTP 400<br/>{success: false, message: "Invalid data"}
    else PHP Fatal Error
        API-->>API: Error/Exception caught
        API->>API: error_log("Fatal error: ...")
        API->>Client: HTTP 500<br/>{success: false, message: "Server error"}
    end
    
    Client->>Client: Parse JSON response
    
    alt Parse Success
        Client->>Client: Handle data
    else Parse Error
        Client->>Client: error_log("JSON parse error")
        Client->>Client: Show fallback UI
    end
```

---

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        PC[Patient Client<br/>React + Vite<br/>Port 5173]
        AC[Admin Client<br/>React + Vite<br/>Port 5174]
    end
    
    subgraph "Authentication"
        GO[Google OAuth 2.0]
    end
    
    subgraph "API Layer - PHP"
        PA[Patient APIs<br/>google-auth.php<br/>reports.php<br/>tests.php<br/>packages.php]
        AA[Admin APIs<br/>admin-google-auth.php<br/>patients.php<br/>upload-report.php<br/>dashboard.php]
        GR[Google Reviews API<br/>google-reviews.php]
    end
    
    subgraph "Business Logic"
        PC1[PatientController]
        AC1[AdminController]
        RC[ReportsController]
        TC[TestController]
        PK[PackageController]
        DC[DashboardController]
        GRC[GoogleReviewController]
    end
    
    subgraph "Data Layer"
        DB[(MySQL Database<br/>certus_diagnostics)]
        FS[File System<br/>/uploads/reports/<br/>/uploads/images/]
    end
    
    subgraph "External Services"
        GP[Google Places API]
        GM[Gmail/Email Service]
    end
    
    PC -->|HTTPS/REST| PA
    AC -->|HTTPS/REST| AA
    PC -->|OAuth| GO
    AC -->|OAuth| GO
    
    PA --> PC1
    PA --> RC
    PA --> TC
    PA --> PK
    AA --> AC1
    AA --> PC1
    AA --> RC
    AA --> DC
    GR --> GRC
    
    PC1 --> DB
    AC1 --> DB
    RC --> DB
    RC --> FS
    TC --> DB
    PK --> DB
    DC --> DB
    GRC --> DB
    GRC --> GP
    
    RC --> GM
    
    style PC fill:#4CAF50
    style AC fill:#2196F3
    style GO fill:#FFC107
    style DB fill:#FF5722
    style FS fill:#FF9800
```

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend - Patient** | React 19, Vite, Tailwind CSS | Patient-facing web app |
| **Frontend - Admin** | React 19, Vite, Chart.js | Admin dashboard |
| **Authentication** | Google OAuth 2.0 (@react-oauth/google) | Secure user authentication |
| **Backend** | PHP 7.4+, Apache | RESTful API server |
| **Database** | MySQL 5.7+ | Data persistence |
| **ORM** | PDO (PHP Data Objects) | Database abstraction |
| **File Storage** | Local File System | Report & image storage |
| **External APIs** | Google Places API | Reviews integration |
| **Email** | PHPMailer / Gmail API | Notification service |
| **Deployment** | Hostinger, SSL/HTTPS | Production hosting |

---

## Key Data Flows

1. **Authentication Flow**: Client → Google OAuth → API → Database → Client
2. **Report Upload**: Admin → API → File System → Database → Email Service → Patient
3. **Report Download**: Patient → API → Database → File System → Patient
4. **Patient Management**: Admin → API → Database → Admin
5. **Test Booking**: Patient → API → Database → Confirmation
6. **Analytics**: Admin → API → Database (Aggregations) → Admin
7. **Reviews**: Client → API → Cache Check → Google API → Database → Client

---

## Error Handling Strategy

- **Frontend**: Try-catch with user-friendly messages + fallback UI
- **Backend**: Exception/Error catching → JSON error responses → Error logging
- **Database**: PDO exception handling → Rollback on failure
- **CORS**: Whitelist origins → Fallback to wildcard
- **File Operations**: Validation → Size/type checks → Secure storage
- **Authentication**: Token validation → Session management → Auto-refresh

---

*Generated: November 12, 2025*
*Project: Certus Diagnostics Management System*
