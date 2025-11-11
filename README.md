Okay — here’s the **fully corrected, final `README.md`** you can paste straight into your repo.
✅ Works exactly like your PromptPilot README
✅ All images visible (once filenames are fixed)
✅ Clean formatting for GitHub dark/light mode

---

### 🧩 Make sure your files look like this

```
HireFlow-AI/
│
├── Hero.png
├── analytics_dash.png
└── job_cards.png
```

*(Rename the last one exactly to `job_cards.png` — no spaces!)*

---

### 💎 Final Complete `README.md` (copy and paste everything)

````markdown
# 🚀 HireFlow AI

[![CI/CD Pipeline](https://github.com/AnsariTech-25667/HireFlow-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/AnsariTech-25667/HireFlow-AI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

> 💼 **HireFlow AI** is a modern, AI-powered hiring platform that bridges the gap between job seekers and employers through **intelligent matching** and **real-time collaboration**.  
Built with cutting-edge technologies to **streamline recruitment** and improve **hiring outcomes**.

---

## 🧠 Tech Stack

### 🖥️ Frontend

- ⚛️ **React 18** – Modern JavaScript library for building dynamic UIs  
- 🧭 **Next.js** – Full-stack React framework with SSR & API routes  
- 🧩 **TypeScript** – Type-safe development for better reliability  
- 🎨 **Tailwind CSS** – Utility-first CSS framework for rapid, elegant UI design  

### ⚙️ Backend

- 🟢 **Node.js** – High-performance JavaScript runtime  
- 🚀 **Express.js** – Fast and minimal web framework  
- 🍃 **MongoDB** – Flexible NoSQL database for dynamic data  
- 🐘 **PostgreSQL** – Reliable relational database for structured data  

### 🧰 Development & Deployment

- ⚡ **Vite** – Blazing-fast build tool and dev server  
- ✅ **ESLint** – Code linting and quality assurance  
- 🧪 **Jest** – Testing framework for unit and integration tests  

---

## 🏗️ Setup Guide

### 📋 Prerequisites

Before running the project, ensure you have:

- **Node.js** ≥ 18.0.0  
- **npm** ≥ 9.0.0  
- **Git** installed  

---

### 🧩 Local Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AnsariTech-25667/HireFlow-AI.git
   cd HireFlow-AI
````

2. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your own configuration
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

---

## 🌍 Environment Variables

Create a `.env` file in the project root and configure the following:

| Variable                | Description                    | Required | Example                 |
| ----------------------- | ------------------------------ | -------- | ----------------------- |
| `PORT`                  | Server port number             | ❌        | `4000`                  |
| `CLIENT_URL`            | Frontend application URL       | ✅        | `http://localhost:5173` |
| `OPENAI_API_KEY`        | OpenAI API key for AI features | ❌        | `sk-...`                |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name          | ❌        | `your-cloud-name`       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key             | ❌        | `123456789`             |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret          | ❌        | `your-api-secret`       |

### 🔑 Getting API Keys

* 🗄️ **MongoDB** → [MongoDB Atlas](https://www.mongodb.com/atlas)
* 🧠 **OpenAI** → [OpenAI Platform](https://platform.openai.com/)
* ☁️ **Cloudinary** → [Cloudinary](https://cloudinary.com/)

---

## 🧪 Scripts

| Command                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Start both client & server in development mode |
| `npm run build`        | Build client for production                    |
| `npm test`             | Run tests for both client & server             |
| `npm run client:dev`   | Run client-side dev server only                |
| `npm run server:dev`   | Run server-side dev server only                |
| `npm run client:build` | Build client-side code                         |
| `npm run client:test`  | Run frontend tests                             |
| `npm run server:test`  | Run backend tests                              |

---

## 🖼️ Project Gallery

✨ A quick look at **HireFlow AI** ✨

### 🧭 Landing Page

![Hero Section](./Hero.png)

### 📊 Analytics Dashboard

![Analytics Dashboard](./analytics_dash.png)

### 💼 Job Cards

![Job Cards](./job_cards.png)

---

## 🚀 Deployment

> ⚙️ *Coming Soon:* Production deployment instructions for hosting and scaling HireFlow AI.

---

## 🧩 Development Approach

HireFlow AI follows a modular, scalable, and AI-first architecture — enabling rapid iteration and seamless integration of intelligent matching features.

📚 **Read More:** [Development History & Technical Details](DEVELOPMENT.md)

---

## 🔐 Security

We take security **very seriously**.
If you discover a vulnerability, please follow our responsible disclosure policy.

📋 **Security Policy:** [View Security Guidelines](SECURITY.md)

### Reporting Security Issues

* 📧 **Email:** [maazansari25667@gmail.com](mailto:maazansari25667@gmail.com)
* 🚫 **Do NOT** post public issues for vulnerabilities
* Include detailed **steps to reproduce** and **impact assessment**

### Security Features

* 🔒 Automated Secret Scanning (pre-commit protection)
* 🛡️ Dependency Auditing & Vulnerability Checks
* 🔐 Input Validation and Data Sanitization
* 📊 Real-time Security Monitoring

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.

---

### 💖 Built with Passion

> Built with modern web technologies, scalable architecture, and enterprise-grade security.
> Empowering smarter, faster, and fairer hiring — powered by AI. 🤖✨

```

---

### ✅ What to Do Now
1. Rename `job_cards .png` → `job_cards.png` (remove the space).  
2. Commit and push that change.  
3. Keep the three images (`Hero.png`, `analytics_dash.png`, `job_cards.png`) in the repo root (same folder as `README.md`).  
4. Refresh your GitHub page — all images will render just like the screenshot of your PromptPilot repo.
```
