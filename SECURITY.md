# Security Policy

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please report it privately to maintain the security of the project.

### How to Report

- Email: [Your email or organization security contact]
- Create a private security advisory on GitHub
- Or contact via GitHub issues with the "security" label (if public discussion is appropriate)

### What to Include

Please include the following details:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if known)

### Response Timeline

- We aim to acknowledge security reports within 48 hours
- We will provide updates on investigation progress within 5 business days
- Security fixes will be prioritized and released as soon as possible

### Security Considerations for This Starter Kit

This project includes **demonstration-only security implementations**:

- Mock authentication (Bearer `userId:role` headers)
- Simple CSRF token checking
- In-memory rate limiting
- Basic input validation

**⚠️ Important**: These are educational examples only. **Do not use in production** without implementing proper:
- Real authentication/authorization (NextAuth, Clerk, etc.)
- Secure session management
- Production-grade rate limiting (Redis-backed)
- Comprehensive input validation and sanitization
- HTTPS enforcement
- Proper CORS configuration
- Database connection security

### Supported Versions

We provide security updates for the latest major version only.

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## License

This security policy is part of the MIT-licensed project.