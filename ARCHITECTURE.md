# Architecture Overview

This project follows a client-server-database model, enabling scalable and maintainable development. The client (frontend) communicates with the server (backend API), which in turn interacts with the database to store and retrieve application data. This separation of concerns ensures modularity, security, and efficient data flow throughout the system.

## System Diagram

```mermaid
%% System Overview
flowchart LR
    Client[Client (React)] -->|HTTP| Server[Server (Express API)]
    Server -->|CRUD| Database[(MongoDB)]
```

## Client → API → DB Flow

```mermaid
%% Client to API to DB Flow
sequenceDiagram
    participant C as Client
    participant S as Server
    participant D as Database
    C->>S: Request (e.g., GET /jobs)
    S->>D: Query jobs collection
    D-->>S: Return job data
    S-->>C: Respond with job data
```

## Entity-Relationship Diagram

```mermaid
%% Main Collections/Tables ER Diagram
erDiagram
    USER ||--o{ JOB_APPLICATION : applies
    USER ||--o{ JOB : posts
    COMPANY ||--o{ JOB : offers
    JOB ||--o{ JOB_APPLICATION : receives
    USER {
      string id
      string name
      string email
      string role
    }
    COMPANY {
      string id
      string name
      string industry
    }
    JOB {
      string id
      string title
      string description
      string companyId
    }
    JOB_APPLICATION {
      string id
      string userId
      string jobId
      string status
    }
```
