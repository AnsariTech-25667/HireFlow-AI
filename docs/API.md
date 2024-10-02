# HireFlow AI - API Documentation

## Authentication Endpoints

### POST /api/auth/register
Register a new user account

### POST /api/auth/login
User login with credentials

### POST /api/auth/logout
User logout and token invalidation

## Job Endpoints

### GET /api/jobs
Retrieve all job listings with pagination

### POST /api/jobs
Create a new job posting (Recruiter only)

### GET /api/jobs/:id
Get specific job details

### PUT /api/jobs/:id
Update job posting (Recruiter only)

### DELETE /api/jobs/:id
Delete job posting (Recruiter only)

## Application Endpoints

### POST /api/applications
Submit job application

### GET /api/applications
Get user's applications

### PUT /api/applications/:id
Update application status (Recruiter only)

## User Endpoints

### GET /api/users/profile
Get user profile information

### PUT /api/users/profile
Update user profile

### POST /api/users/upload-resume
Upload resume file