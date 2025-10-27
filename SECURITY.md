# Security Policy

## Supported Versions

We actively support the latest version of HireFlow AI. Security updates are provided for:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in HireFlow AI, please report it responsibly:

### 🔒 Private Disclosure

- **Email**: maazansari25667@gmail.com
- **Subject**: `[SECURITY] HireFlow AI Vulnerability Report`
- **Response Time**: Within 48 hours

### 📝 What to Include

Please include the following information in your report:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** and severity assessment
4. **Suggested fix** (if known)
5. **Your contact information** for follow-up

### 🛡️ Security Measures

HireFlow AI implements several security measures:

- **Authentication**: Clerk-based secure authentication
- **Data Validation**: Input sanitization and validation
- **Environment Variables**: Secure API key management
- **Rate Limiting**: Protection against brute force attacks
- **HTTPS**: Encrypted data transmission
- **JWT Tokens**: Secure session management

### 🚨 Common Security Issues

Please avoid reporting the following as they are already mitigated:

- Rate limiting on API endpoints
- CORS configuration
- Input validation
- SQL injection (we use MongoDB with Mongoose)

### 🎯 Bug Bounty

While we don't currently offer a formal bug bounty program, we appreciate security researchers who help improve our platform's security.

### 📢 Security Advisories

Security advisories will be published through:

- GitHub Security Advisories
- Release notes for security patches
- Direct notification to enterprise users

---

**Thank you for helping keep HireFlow AI secure!**
