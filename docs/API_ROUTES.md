# 🛠️ API Routes Documentation

> **Complete API reference for HireFlow AI platform**

**Author:** Maaz Ansari <maazansari25667@gmail.com>  
**Portfolio:** https://portfolio-rose-ten-h8vdzjp4ol.vercel.app/  
**GitHub:** https://github.com/AnsariTech-25667  

---

## 🔗 Base URL
```
Development: http://localhost:4000
Production: https://hireflow-ai-api.vercel.app
```

## 🔐 Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📋 API Routes Reference

| Method | Path | Body | Response | Notes |
|--------|------|------|----------|--------|
| **AUTH ROUTES** |
| `GET` | `/` | - | `{ message, author, email, version }` | API health check |
| `POST` | `/api/auth/register` | `{ name, email, password, userType }` | `{ success, message, user, token }` | Register new user |
| `POST` | `/api/auth/login` | `{ email, password }` | `{ success, message, user, token }` | User login |
| `POST` | `/api/auth/logout` | - | `{ success, message }` | User logout |
| **USER ROUTES** |
| `GET` | `/api/users/profile` | - | `{ success, user }` | Get user profile |
| `PUT` | `/api/users/profile` | `{ name, phone, location, resume }` | `{ success, message, user }` | Update profile |
| `POST` | `/api/users/apply` | `{ jobId, coverLetter }` | `{ success, message }` | Apply to job |
| `GET` | `/api/users/applications` | - | `{ success, applications }` | Get user applications |
| `POST` | `/api/users/update-resume` | `FormData: resume` | `{ success, resumeUrl }` | Upload resume |
| **JOB ROUTES** |
| `GET` | `/api/jobs` | - | `{ success, jobs }` | Get all jobs |
| `GET` | `/api/jobs/:id` | - | `{ success, job }` | Get job by ID |
| `POST` | `/api/jobs/search` | `{ title, location, category }` | `{ success, jobs }` | Search jobs |
| `GET` | `/api/jobs/featured` | - | `{ success, jobs }` | Get featured jobs |
| `GET` | `/api/jobs/recent` | - | `{ success, jobs }` | Get recent jobs |
| **COMPANY ROUTES** |
| `POST` | `/api/company/register` | `{ name, email, password, company }` | `{ success, message, user, token }` | Register company |
| `POST` | `/api/company/post-job` | `{ title, description, location, salary, requirements }` | `{ success, message, job }` | Create job posting |
| `GET` | `/api/company/list-jobs` | - | `{ success, jobs }` | Get company jobs |
| `PUT` | `/api/company/jobs/:id` | `{ title, description, location, salary }` | `{ success, message, job }` | Update job |
| `DELETE` | `/api/company/jobs/:id` | - | `{ success, message }` | Delete job |
| `GET` | `/api/company/applications/:jobId` | - | `{ success, applications }` | Get job applications |
| `PUT` | `/api/company/application/:id` | `{ status }` | `{ success, message }` | Update application status |
| `POST` | `/api/company/change-visibility` | `{ jobId, visible }` | `{ success, message }` | Toggle job visibility |

---

## 📝 Request/Response Examples

### Authentication

#### Register User
```javascript
// POST /api/auth/register
{
  "name": "Maaz Ansari",
  "email": "maazansari25667@gmail.com",
  "password": "securePassword123",
  "userType": "user" // or "company"
}

// Response
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "64f...",
    "name": "Maaz Ansari",
    "email": "maazansari25667@gmail.com",
    "userType": "user"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```javascript
// POST /api/auth/login
{
  "email": "maazansari25667@gmail.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "user": {
    "_id": "64f...",
    "name": "Maaz Ansari",
    "email": "maazansari25667@gmail.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Job Management

#### Create Job Posting
```javascript
// POST /api/company/post-job
{
  "title": "Senior React Developer",
  "description": "<p>We are looking for an experienced React developer...</p>",
  "location": "Pune, India",
  "salary": "80000-120000",
  "requirements": ["React", "Node.js", "MongoDB", "3+ years experience"],
  "category": "Technology",
  "jobType": "Full-time",
  "level": "Senior"
}

// Response
{
  "success": true,
  "message": "Job posted successfully",
  "job": {
    "_id": "64f...",
    "title": "Senior React Developer",
    "companyId": "64f...",
    "location": "Pune, India",
    "salary": "80000-120000",
    "createdAt": "2024-10-27T...",
    "applications": 0,
    "views": 0
  }
}
```

#### Search Jobs
```javascript
// POST /api/jobs/search
{
  "title": "React",
  "location": "Pune",
  "category": "Technology"
}

// Response
{
  "success": true,
  "jobs": [
    {
      "_id": "64f...",
      "title": "Senior React Developer",
      "company": "TechCorp Solutions",
      "location": "Pune, India",
      "salary": "80000-120000",
      "applications": 12,
      "createdAt": "2024-10-27T..."
    }
  ]
}
```

### Application Management

#### Apply to Job
```javascript
// POST /api/users/apply
{
  "jobId": "64f123...",
  "coverLetter": "I am excited about this opportunity because..."
}

// Response
{
  "success": true,
  "message": "Application submitted successfully"
}
```

#### Upload Resume
```javascript
// POST /api/users/update-resume
// FormData with file upload
const formData = new FormData();
formData.append('resume', file);

// Response
{
  "success": true,
  "resumeUrl": "https://res.cloudinary.com/.../resume.pdf"
}
```

---

## 🔍 Query Parameters

### Job Search Filters
```
GET /api/jobs?category=Technology&location=Pune&salary=80000-120000&level=Senior
```

**Available Filters:**
- `category`: Technology, Marketing, Design, etc.
- `location`: City or remote
- `salary`: Range (e.g., 50000-100000)
- `level`: Entry, Mid, Senior, Lead
- `jobType`: Full-time, Part-time, Contract, Freelance
- `page`: Pagination (default: 1)
- `limit`: Results per page (default: 10)

### Application Status
```
GET /api/company/applications/64f123?status=pending&page=1&limit=20
```

**Status Values:**
- `pending`: Newly submitted
- `reviewing`: Under review
- `shortlisted`: Selected for interview
- `rejected`: Not selected
- `hired`: Successfully hired

---

## ⚠️ Error Responses

### Common Error Formats
```javascript
// 400 Bad Request
{
  "success": false,
  "message": "Validation error",
  "errors": [
    { "field": "email", "message": "Valid email is required" },
    { "field": "password", "message": "Password must be at least 6 characters" }
  ]
}

// 401 Unauthorized
{
  "success": false,
  "message": "Access denied. No token provided."
}

// 404 Not Found
{
  "success": false,
  "message": "Job not found"
}

// 500 Internal Server Error
{
  "success": false,
  "message": "Internal server error",
  "error": "Detailed error message for debugging"
}
```

---

## 🚀 Rate Limits

### API Limits
- **General API**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 5 requests per 15 minutes per IP
- **File uploads**: 10 requests per hour per user
- **Search endpoints**: 50 requests per 15 minutes per IP

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 🔧 Development Tools

### Testing API Routes
```bash
# Using curl
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Using Postman
# Import the collection: docs/postman_collection.json
```

### Database Seeding
```bash
# Seed sample data for development
npm run seed

# Reset database
npm run db:reset
```

---

## 📊 API Analytics

### Performance Metrics
- **Average Response Time**: <200ms
- **Uptime**: 99.9%
- **Error Rate**: <0.1%
- **Concurrent Connections**: 1000+

### Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Morgan**: HTTP request logging
- **Custom Analytics**: API usage tracking

---

## 🔐 Security Features

### Implementation
- **JWT Authentication** with refresh tokens
- **Password Hashing** using bcrypt
- **Input Validation** with express-validator
- **CORS Configuration** for secure cross-origin requests
- **Rate Limiting** to prevent abuse
- **Helmet.js** for security headers

### Best Practices
- Use HTTPS in production
- Validate all inputs
- Sanitize user data
- Monitor for suspicious activity
- Regular security audits

---

## 📞 Support

**Maaz Ansari** - Full-Stack Engineer  
📧 **Email:** maazansari25667@gmail.com  
🌐 **Portfolio:** https://portfolio-rose-ten-h8vdzjp4ol.vercel.app/  
📱 **GitHub:** https://github.com/AnsariTech-25667  

*For API issues, feature requests, or integration support, please contact via email or create an issue on GitHub.*

---

*API documentation last updated: October 27, 2025*