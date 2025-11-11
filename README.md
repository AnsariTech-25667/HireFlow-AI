
# 🚀 HireFlow AI

[![CI/CD Pipeline](https://github.com/AnsariTech-25667/HireFlow-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/AnsariTech-25667/HireFlow-AI/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)

> 💼 **HireFlow AI** is a modern, AI-powered hiring platform that connects job seekers and employers through **intelligent matching** and **real-time collaboration**.  
> Built with cutting-edge technologies to **streamline recruitment** and improve **hiring outcomes**.

---

## 🧠 Tech Stack

### 🖥️ Frontend
- ⚛️ **React 18** – Modern JavaScript library for building dynamic UIs  
- 🧭 **Next.js** – Full-stack React framework with SSR & API routes  
- 🧩 **TypeScript** – Static typing for reliable, maintainable code  
- 🎨 **Tailwind CSS** – Utility-first CSS framework for rapid UI development  

### ⚙️ Backend
- 🟢 **Node.js** – Fast JavaScript runtime  
- 🚀 **Express.js** – Minimal web framework  
- 🍃 **MongoDB** – NoSQL database for unstructured data  
- 🐘 **PostgreSQL** – Relational database for structured data  

### 🧰 Development & Deployment
- ⚡ **Vite** – Super-fast build tool and dev server  
- ✅ **ESLint** – Code linting and consistency  
- 🧪 **Jest** – Testing framework for reliable tests  

---

## 🏗️ Setup Guide

### 📋 Prerequisites
Make sure you have installed:
- **Node.js** ≥ 18.0.0  
- **npm** ≥ 9.0.0  
- **Git**

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

| Variable                | Description           | Required | Example                 |
| ----------------------- | --------------------- | -------- | ----------------------- |
| `PORT`                  | Server port           | ❌        | `4000`                  |
| `CLIENT_URL`            | Frontend URL          | ✅        | `http://localhost:5173` |
| `OPENAI_API_KEY`        | OpenAI key            | ❌        | `sk-...`                |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | ❌        | `your-cloud`            |
| `CLOUDINARY_API_KEY`    | Cloudinary API key    | ❌        | `123456789`             |
| `CLOUDINARY_API_SECRET` | Cloudinary secret     | ❌        | `abc123`                |

### 🔑 API Key Providers

* 🗄️ [MongoDB Atlas](https://www.mongodb.com/atlas)
* 🧠 [OpenAI Platform](https://platform.openai.com/)
* ☁️ [Cloudinary](https://cloudinary.com/)

---

## 🧪 Scripts

| Command                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Start both client & server in development mode |
| `npm run build`        | Build client for production                    |
| `npm test`             | Run tests                                      |
| `npm run client:dev`   | Start client dev server only                   |
| `npm run server:dev`   | Start server dev server only                   |
| `npm run client:build` | Build client only                              |
| `npm run client:test`  | Run client-side tests                          |
| `npm run server:test`  | Run server-side tests                          |

---

## 🖼️ Project Gallery

✨ A look at **HireFlow AI** in action ✨

### 🧭 Landing Page

![Hero Section](./Hero.png)

### 📊 Analytics Dashboard

![Analytics Dashboard](./analytics_dash.png)

### 💼 Job Cards

![Job Cards](./job_cards.png)

---

## 🚀 Deployment

> ⚙️ *Coming Soon:* Production deployment and scaling instructions.

---

## 🧩 Development Approach

HireFlow AI is designed with modular, scalable, and AI-driven architecture for seamless integrations and rapid iteration.
📚 **Learn more:** [Development History & Technical Details](DEVELOPMENT.md)

---

## 🔐 Security

We take security seriously.
If you discover a vulnerability, please follow our disclosure policy.

📋 **Policy:** [Security Guidelines](SECURITY.md)

### Report Vulnerabilities

* 📧 Email: [maazansari25667@gmail.com](mailto:maazansari25667@gmail.com)
* 🚫 Do **not** open public issues for security concerns

### Security Features

* 🔒 Pre-commit secret scanning
* 🛡️ Dependency auditing
* 🔐 Input validation
* 📊 Real-time monitoring

---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE).

---

### 💖 Built with Passion

> Built using modern web technologies, scalable architecture, and enterprise-grade security.
> Empowering smarter, faster, and fairer hiring — powered by AI. 🤖✨

