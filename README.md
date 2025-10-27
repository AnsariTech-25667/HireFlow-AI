# HireFlow AI

[![CI/CD Pipeline](https://github.com/AnsariTech-25667/HireFlow-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/AnsariTech-25667/HireFlow-AI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

A modern AI-powered hiring platform that connects job seekers with employers through intelligent matching and real-time collaboration.
Built with cutting-edge technologies to streamline the recruitment process and improve hiring outcomes.

## Tech Stack

### Frontend

- **React 18** - Modern JavaScript library for building user interfaces
- **Next.js** - Full-stack React framework with SSR and API routes
- **TypeScript** - Static type checking for enhanced developer experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development

### Backend

- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB** - NoSQL database for flexible data storage
- **PostgreSQL** - Relational database for structured data

### Development & Deployment

- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **Jest** - Testing framework for unit and integration tests

## Setup

### Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Git

### Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnsariTech-25667/HireFlow-AI.git
   cd HireFlow-AI
   ```

# HireFlow AI

[![CI/CD Pipeline](https://github.com/AnsariTech-25667/HireFlow-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/AnsariTech-25667/HireFlow-AI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

3. **Set up environment variables**

   ```bash
   # Copy environment template
   cp .env.example .env
   # Edit .env with your configuration values
   ```

   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable                | Description                    | Required | Example                 |
| ----------------------- | ------------------------------ | -------- | ----------------------- |
| `PORT`                  | Server port number             | ❌       | `4000`                  |
| `CLIENT_URL`            | Frontend application URL       | ✅       | `http://localhost:5173` |
| `OPENAI_API_KEY`        | OpenAI API key for AI features | ❌       | `sk-...`                |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name          | ❌       | `your-cloud-name`       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key             | ❌       | `123456789`             |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret          | ❌       | `your-api-secret`       |

### Getting API Keys

- **MongoDB**: [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier available)
- **OpenAI**: [OpenAI Platform](https://platform.openai.com/) (pay-per-use)
- **Cloudinary**: [Cloudinary](https://cloudinary.com/) (free tier available)

## Scripts

| Command                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| `npm run dev`          | Start development servers for both client and server |
| `npm run build`        | Build the client application for production          |
| `npm test`             | Run test suites for both client and server           |
| `npm run client:dev`   | Start only the client development server             |
| `npm run server:dev`   | Start only the server development server             |
| `npm run client:build` | Build only the client application                    |
| `npm run client:test`  | Run only client-side tests                           |
| `npm run server:test`  | Run only server-side tests                           |

## Deployment

TODO: Add deployment instructions for production

## Provenance & Timeline

### Development Approach

**📚 Read More:** [Development History & Technical Details](DEVELOPMENT.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

We take security seriously. If you discover a security vulnerability, please follow our security policy for responsible disclosure.
**📋 Security Guidelines:** [Security Policy](SECURITY.md)

### Reporting Security Issues

- **Email**: [maazansari25667@gmail.com](mailto:maazansari25667@gmail.com)
- **Do NOT** create public issues for security vulnerabilities
- Include steps to reproduce and potential impact assessment

### Security Features

- 🔒 **Automated Secret Scanning** - Pre-commit hooks prevent credential leaks
- 🛡️ **Dependency Auditing** - Regular security updates and vulnerability checks
- 🔐 **Input Validation** - Comprehensive data sanitization and validation
- 📊 **Security Monitoring** - Error tracking and performance monitoring

---

_Built with modern web technologies and enterprise-grade practices. Demonstrating production-ready full-stack development with AI integration and scalable architecture._
│ ├── src/
