# Job Portal - MERN Stack Application

**Author:** Maaz Ansari <maazansari25667@gmail.com>  
**Location:** Pune, India  
**Repository:** [GitHub URL]

## Hi! I'm Maaz Ansari 👋

I'm a **Full-Stack Engineer (MERN/Next.js)** with expertise in **AI/ML & Data Analytics**, currently based in Pune, India. I built this comprehensive job portal application as a showcase of modern web development practices and full-stack capabilities.

## About This Project

This job portal is a complete MERN stack application that demonstrates my expertise in building scalable, production-ready web applications. The platform serves both job seekers and recruiters with distinct interfaces and functionalities.

### 🚀 Key Features

- **Dual Interface**: Separate dashboards for job seekers and recruiters
- **Authentication**: Secure user authentication with Clerk
- **Job Management**: Complete CRUD operations for job postings
- **Application System**: Job application tracking and management
- **Real-time Updates**: Live job listings and application status
- **Responsive Design**: Modern UI with Tailwind CSS
- **File Upload**: Resume upload with Cloudinary integration
- **Rich Text Editor**: Quill.js for job descriptions

## My Background

As a **Full-Stack Developer** with hands-on experience at **Netraket (All Remote Solutions Pvt. Ltd. - Skuad)** and **Softmaque Consulting**, I bring both technical depth and product thinking to this project.

### Professional Experience:
- **Netraket (Skuad)** - Full-Stack Developer (Aug-Sep 2025)
  - Built WordPress analytics/chat plugins (PHP, JS, MySQL)
  - Developed React/Next.js + Express features with MongoDB
  - Delivered dashboards, hooks, cron jobs, and real-time tracking

- **Softmaque Consulting** - Software Engineer Intern (Jan-June 2025)
  - Contributed to enterprise Defect Tracking & Workflow System
  - Implemented role-based UI and dynamic notifications
  - Worked with ASP.NET, SQL Server, jQuery, AJAX

### Education:
**B.Tech Electronics & Telecommunications**  
Vishwakarma Institute of Technology, Pune  
CGPA: 8.0/10 (May 2025)

### Research & Publications:
- **"AI-Powered Precision Robotic Arm (Computer Vision)"** — IJISAE (Scopus-indexed), 2024
- **"Vehicle Detection & Depth Estimation using Thermal Imaging"** — Independent Research, 2025
- **Google Data Analytics Professional Certificate** (Coursera)

## 🛠️ Tech Stack

### Frontend
- **React** - Component-based UI development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Clerk** - Authentication and user management
- **Quill.js** - Rich text editor
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Cloudinary** - Image and file upload
- **Multer** - File upload middleware
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

### DevOps & Tools
- **Vercel** - Deployment platform
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Nodemon** - Development server

## 📁 Project Structure

```
job-portal/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── context/        # React context for state management
│   │   └── assets/         # Static assets and data
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── controllers/        # Business logic
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Custom middleware
│   ├── config/             # Configuration files
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Clerk account for authentication
- Cloudinary account for file uploads

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd job-portal
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Variables**

Create `.env` files in both server and client directories:

**Server (.env):**
```env
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
JWT_SECRET=your_jwt_secret
SENTRY_DSN=your_sentry_dsn
```

**Client (.env):**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

4. **Run the application**
```bash
# Start the server (from server directory)
npm run server

# Start the client (from client directory)
npm run dev
```

## 🎯 Key Features Implemented

### For Job Seekers
- **Job Search & Filtering**: Search jobs by title, location, category
- **Job Applications**: Apply to jobs with resume upload
- **Application Tracking**: Monitor application status
- **Profile Management**: Update personal information and resume

### For Recruiters
- **Job Posting**: Create and manage job listings
- **Application Management**: Review and manage job applications
- **Company Profile**: Maintain company information
- **Analytics Dashboard**: Track job performance and applications

## 🔧 My Development Philosophy

As a Full-Stack Engineer with experience at Netraket and Softmaque, I believe in:

1. **Scalable Architecture**: Building applications that can grow with user demands
2. **Clean Code**: Writing maintainable and readable code
3. **User Experience**: Prioritizing intuitive and responsive design
4. **Performance**: Optimizing for speed and efficiency
5. **Security**: Implementing robust security measures

## 📈 Future Enhancements

- **Real-time Chat**: Direct messaging between recruiters and candidates
- **AI-Powered Matching**: ML algorithms for job-candidate matching
- **Advanced Analytics**: Detailed insights and reporting
- **Mobile App**: React Native mobile application
- **Video Interviews**: Integrated video calling functionality

## 🤝 Technical Challenges Solved

1. **Authentication Flow**: Implemented secure auth with Clerk across both user types
2. **File Management**: Integrated Cloudinary for efficient file handling
3. **State Management**: Used React Context for global state management
4. **Responsive Design**: Ensured optimal experience across all devices
5. **API Design**: Created RESTful APIs with proper error handling

## 📞 Contact Me

**Maaz Ansari**  
📧 **Email:** maazansari25667@gmail.com  
📱 **Phone:** +91 95116 70380  
📍 **Location:** Pune, India  
💼 **LinkedIn:** [linkedin.com/in/maazansari](https://www.linkedin.com/in/maazansari)  

**I'm actively seeking Full-Stack/Backend roles** where I can apply this kind of end-to-end product development thinking and contribute to innovative projects.

## 🔗 Other Projects

- **PromptPilot** — AI Prompt Workspace (Next.js, React, MongoDB, Clerk, OpenAI API)
- **NovaDraft** — AI Writing & Image Suite (React Vite, Express 5, Neon Postgres, Cloudinary)
- **SyncSlate** — Scheduling & Calendar Sync (Next.js App Router, Prisma, PostgreSQL, Google Calendar API)
- **FinSight-AI** — Finance Tracking & Insights (Next.js, Node/Express, MongoDB Prisma)

---

*Built with ❤️ by Maaz Ansari - Full-Stack Engineer specializing in MERN Stack, AI/ML, and scalable web applications.*
