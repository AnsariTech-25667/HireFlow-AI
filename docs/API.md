# HireFlow AI - API Documentation

## Example Endpoints

### GET /health

- **Success Response:**
  - Status: 200
  - Body:
    ```json
    { "status": "ok" }
    ```

### POST /login

- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "yourPassword"
  }
  ```
- **Success Response:**
  - Status: 200
  - Body:
    ```json
    {
      "token": "jwt-token",
      "user": { "id": "123", "email": "user@example.com" }
    }
    ```

### GET /jobs

- **Success Response:**
  - Status: 200
  - Body:
    ```json
    [
      { "id": "job1", "title": "Frontend Developer", "company": "Acme Corp" },
      { "id": "job2", "title": "Backend Developer", "company": "Beta Inc" }
    ]
    ```

## Authentication

**Method:** (GET/POST/PUT/DELETE)
**Path:** /api/auth/...
**Request Body:**

```
{
  // ...placeholder for authentication request
}
```

**Response:**

```
{
  // ...placeholder for authentication response
}
```

## Users

**Method:** (GET/POST/PUT/DELETE)
**Path:** /api/users/...
**Request Body:**

```
{
  // ...placeholder for user request
}
```

**Response:**

```
{
  // ...placeholder for user response
}
```

## Jobs

**Method:** (GET/POST/PUT/DELETE)
**Path:** /api/jobs/...
**Request Body:**

```
{
  // ...placeholder for job request
}
```

**Response:**

```
{
  // ...placeholder for job response
}
```

## Analytics

**Method:** (GET/POST/PUT/DELETE)
**Path:** /api/analytics/...
**Request Body:**

```
{
  // ...placeholder for analytics request
}
```

**Response:**

```
{
  // ...placeholder for analytics response
}
```

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

## Error Codes

- **401 Unauthorized:** Invalid credentials or missing token
- **404 Not Found:** Resource does not exist
- **500 Internal Server Error:** Unexpected server error
