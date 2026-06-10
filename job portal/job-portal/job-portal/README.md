# Job Portal Web Application

A full-stack Job Portal built with **Java Spring Boot** (backend) and **React.js** (frontend).

## Features
- **Role-based access**: Admin, Recruiter, Job Seeker
- **Authentication**: JWT-based login/register
- **Job Posting**: Recruiters can create, update, delete jobs
- **Job Search**: Search by keyword, location, or job type
- **Apply to Jobs**: Job seekers can apply with a cover letter
- **Application Tracking**: Recruiters can update status (Under Review, Shortlisted, Rejected, Hired)
- **Dashboard**: Personalized view for both job seekers and recruiters

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Backend    | Java 17, Spring Boot 3.2, Spring Security, Spring MVC |
| Auth       | JWT (JSON Web Tokens)                               |
| Database   | MySQL + JPA/Hibernate                               |
| Frontend   | React.js 18, React Router v6, Axios                 |
| Build Tool | Maven                                               |

## Project Structure

```
job-portal/
├── src/main/java/com/ganesh/jobportal/
│   ├── controller/       # REST API controllers (Auth, Job, Application)
│   ├── service/          # Business logic layer
│   ├── repository/       # Spring Data JPA repositories
│   ├── model/            # JPA Entities (User, Job, JobApplication)
│   ├── dto/              # Request/Response DTOs
│   └── security/         # JWT utils, filter, SecurityConfig
├── frontend/             # React application
│   └── src/
│       ├── pages/        # Home, Login, Register, JobDetail, Dashboard, PostJob
│       ├── components/   # Navbar
│       └── services/     # Axios API service
└── pom.xml
```

## API Endpoints

### Auth
| Method | Endpoint            | Access  |
|--------|---------------------|---------|
| POST   | /api/auth/register  | Public  |
| POST   | /api/auth/login     | Public  |

### Jobs
| Method | Endpoint            | Access          |
|--------|---------------------|-----------------|
| GET    | /api/jobs/search    | Public          |
| GET    | /api/jobs/{id}      | Public          |
| POST   | /api/jobs           | Recruiter/Admin |
| PUT    | /api/jobs/{id}      | Recruiter/Admin |
| DELETE | /api/jobs/{id}      | Recruiter/Admin |
| GET    | /api/jobs/my-jobs   | Recruiter/Admin |

### Applications
| Method | Endpoint                              | Access          |
|--------|---------------------------------------|-----------------|
| POST   | /api/applications/apply/{jobId}       | Job Seeker      |
| GET    | /api/applications/my-applications     | Job Seeker      |
| GET    | /api/applications/job/{jobId}         | Recruiter/Admin |
| PUT    | /api/applications/{id}/status         | Recruiter/Admin |

## Setup & Run

### Prerequisites
- Java 17+
- MySQL 8+
- Node.js 18+
- Maven

### Backend
1. Create MySQL database: `CREATE DATABASE job_portal_db;`
2. Update `src/main/resources/application.properties` with your DB credentials
3. Run: `mvn spring-boot:run`

### Frontend
```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`, backend on `http://localhost:8080`.
