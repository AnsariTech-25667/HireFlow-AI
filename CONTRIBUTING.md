# Contributing to HireFlow AI

Thank you for your interest in contributing to HireFlow AI! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** 9.0.0 or higher
- **Git** 2.30.0 or higher
- **MongoDB** 6.0+ (for local development)

### Local Development Setup

1. **Fork and Clone**

   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/HireFlow-AI.git
   cd HireFlow-AI
   ```

2. **Install Dependencies**

   ```bash
   # Install all dependencies (client, server, and root)
   npm run install:all
   ```

3. **Environment Configuration**

   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env and add your API keys:
   # - CLERK_PUBLISHABLE_KEY & CLERK_SECRET_KEY (clerk.dev)
   # - MONGODB_URI (mongodb.com/atlas)
   # - CLOUDINARY credentials (cloudinary.com)
   # - OPENAI_API_KEY (openai.com)
   ```

4. **Database Setup**

   ```bash
   # Option 1: Use MongoDB Atlas (recommended)
   # Sign up at mongodb.com/atlas and get connection string

   # Option 2: Local MongoDB
   # Install MongoDB Community Edition
   # Start MongoDB service
   mongod --dbpath /path/to/your/db
   ```

5. **Start Development**

   ```bash
   # Start both client and server
   npm run dev

   # Frontend: http://localhost:5173
   # Backend: http://localhost:4000
   # API Docs: http://localhost:4000/api-docs (when implemented)
   ```

6. **Verify Setup**

   ```bash
   # Run tests to ensure everything works
   npm test

   # Run linting
   npm run lint

   # Run security scan
   npm run secret-scan
   ```

## 🌿 Branch Naming Convention

Use descriptive branch names following this pattern:

```
<type>/<scope>/<description>

Examples:
feature/auth/add-oauth-integration
fix/api/resolve-memory-leak
docs/readme/update-installation-guide
chore/deps/upgrade-react-18
refactor/ui/modernize-job-cards
perf/db/optimize-search-queries
test/components/add-unit-tests
```

### Branch Types

- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `style/` - Code style/formatting changes
- `refactor/` - Code refactoring without feature changes
- `perf/` - Performance improvements
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks, dependency updates

## 📝 Commit Message Standards

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Examples

```bash
# Features - New functionality
feat(auth): add Google OAuth integration
feat(ui): implement dark mode toggle
feat(api): add job recommendation endpoint
feat(search): implement advanced filtering system

# Bug fixes - Fixing issues
fix(db): resolve connection pool exhaustion
fix(ui): correct mobile responsive layout
fix(api): handle null user preferences
fix(auth): resolve JWT token expiration issue

# Documentation - Documentation updates
docs(readme): update installation instructions
docs(api): add endpoint documentation
docs(contributing): clarify branch naming conventions
docs(setup): add environment variable examples

# Chores - Maintenance and dependencies
chore(deps): upgrade React to v18.3.1
chore(config): update ESLint rules
chore(ci): add automated security scanning
chore(package): update development dependencies

# Refactoring - Code structure improvements
refactor(api): simplify user authentication logic
refactor(components): extract reusable UI components
refactor(db): optimize query performance
refactor(utils): consolidate helper functions
```

### Commit Types

- `feat` - New features
- `fix` - Bug fixes
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes
- `revert` - Reverting previous commits

## 🎨 Code Style Guidelines

We use **Prettier** and **ESLint** to maintain consistent code style across the project.

### Automated Formatting

```bash
# Format all code with Prettier
npm run format

# Check linting with ESLint
npm run lint

# Fix auto-fixable linting issues
npm run lint -- --fix
```

### Style Rules

**JavaScript/TypeScript:**

```javascript
// Use const/let instead of var
const apiUrl = 'https://api.example.com';
let userCount = 0;

// Use arrow functions for callbacks
const users = data.map(user => ({
  id: user.id,
  name: user.fullName,
}));

// Destructure objects and arrays
const { name, email } = user;
const [first, second] = items;

// Use template literals for string concatenation
const message = `Welcome ${name}, you have ${count} notifications`;
```

**React Components:**

```jsx
// Use functional components with hooks
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  return (
    <div className="user-profile">
      <h2>{user?.name}</h2>
    </div>
  );
};
```

**CSS/Tailwind:**

```jsx
// Group Tailwind classes logically
className="
  flex items-center justify-between
  px-4 py-2 rounded-lg
  bg-white border border-gray-200
  hover:shadow-md transition-all
"
```

### Pre-commit Checks

Before committing, the following checks are automatically run:

- **Prettier** formatting
- **ESLint** linting
- **Secret scanning** to prevent credential leaks
- **Test suite** to ensure code quality

## 🔄 Pull Request Process

### Before Opening a PR

1. **Create Feature Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add/update tests as needed
   - Update documentation if required

3. **Test Your Changes**

   ```bash
   # Run all tests
   npm test

   # Run linting
   npm run lint

   # Check test coverage
   npm run test:coverage

   # IMPORTANT: Run security scan before committing
   npm run secret-scan
   ```

   **⚠️ Security Notice:** Always run `npm run secret-scan` before pushing to ensure no API keys, passwords, or sensitive data are accidentally committed. This scan checks for:
   - API keys (AWS, OpenAI, Clerk, etc.)
   - Database connection strings
   - JWT secrets and tokens
   - Private keys and certificates
   - Other sensitive credentials

4. **Commit Your Changes**

   ```bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   ```

5. **Update Your Branch**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

### Pull Request Checklist

**Before submitting your PR, ensure:**

#### ✅ Code Quality

- [ ] Code follows project style guidelines
- [ ] All existing tests pass (`npm test`)
- [ ] New code has appropriate test coverage
- [ ] No ESLint errors or warnings (`npm run lint`)
- [ ] No security issues detected (`npm run secret-scan`)

#### ✅ Documentation

- [ ] Code is self-documenting with clear variable/function names
- [ ] Complex logic includes inline comments
- [ ] README.md updated if new setup steps required
- [ ] API documentation updated for new endpoints

#### ✅ Testing

- [ ] New features have unit tests
- [ ] Integration tests added for API changes
- [ ] Edge cases are covered
- [ ] Manual testing completed

#### ✅ Performance

- [ ] No performance regressions introduced
- [ ] Database queries are optimized
- [ ] Large files/images are optimized
- [ ] Bundle size impact considered

#### ✅ Security

- [ ] No sensitive data in commits
- [ ] Input validation implemented
- [ ] Authentication/authorization checked
- [ ] Dependencies are up-to-date

#### ✅ Breaking Changes

- [ ] Breaking changes are documented
- [ ] Migration guide provided if needed
- [ ] Backwards compatibility maintained where possible

### PR Description Template

```markdown
## Description

Brief description of changes and motivation.

## Type of Change

- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

Add screenshots or GIFs demonstrating the changes.

## Related Issues

- Closes #123
- Relates to #456
```

## 🧪 Testing Guidelines

### Running Tests

```bash
# All tests
npm test

# Client tests only
npm run test:client

# Server tests only
npm run test:server

# With coverage
npm run test:coverage

# Watch mode (during development)
cd client && npm run test:watch
cd server && npm run test:watch
```

### Writing Tests

**Client-Side Tests (Jest)**

```javascript
// client/tests/utils.test.js
describe('Utility Functions', () => {
  test('should format job title correctly', () => {
    expect(formatJobTitle('software engineer')).toBe('Software Engineer');
  });
});
```

**Server-Side Tests (Jest + Supertest)**

```javascript
// server/tests/jobs.test.js
describe('Job API', () => {
  test('GET /api/jobs should return job list', async () => {
    const response = await request(app).get('/api/jobs').expect(200);

    expect(response.body).toHaveProperty('jobs');
  });
});
```

### Test Coverage Requirements

- **Minimum**: 80% line coverage
- **Target**: 90% line coverage
- **Critical paths**: 100% coverage (auth, payments, data mutations)

## 🎨 Code Style Guidelines

### JavaScript/React

```javascript
// Use arrow functions for components
const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h3>{job.title}</h3>
    </div>
  );
};

// Use meaningful variable names
const isUserAuthenticated = user?.id ? true : false;

// Destructure props and objects
const { title, company, salary } = job;
```

### CSS/Tailwind

```javascript
// Group Tailwind classes logically
className="
  flex items-center justify-between
  p-4 rounded-lg
  bg-white border border-gray-200
  hover:shadow-md transition-shadow
"

// Use semantic class names for complex styles
<div className="job-card job-card--featured">
```

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Modal)
│   ├── forms/          # Form-specific components
│   └── layout/         # Layout components (Header, Footer)
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── context/            # React context providers
└── assets/             # Static assets
```

## 📋 Issue Guidelines

### Bug Reports

```markdown
**Describe the bug**
Clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
```

### Feature Requests

```markdown
**Is your feature request related to a problem?**
Clear description of what the problem is.

**Describe the solution you'd like**
Clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other context or screenshots.
```

## 🚀 Development Workflow

### Daily Development

1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/your-feature`
3. Make changes and commit regularly
4. Run tests frequently: `npm test`
5. Push to your fork: `git push origin feature/your-feature`
6. Open PR when ready

### Code Review Process

1. **Self-review**: Review your own code first
2. **Automated checks**: Ensure CI passes
3. **Peer review**: Address reviewer feedback
4. **Final approval**: Maintainer approval required
5. **Merge**: Squash and merge to main

## 🔒 Security

### Reporting Security Issues

- **DO NOT** create public issues for security vulnerabilities
- Email security concerns to: [maazansari25667@gmail.com](mailto:maazansari25667@gmail.com)
- Include steps to reproduce and potential impact

### Security Best Practices

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate all user inputs
- Implement proper authentication checks
- Keep dependencies updated

## 📞 Getting Help

### Community

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Email**: [maazansari25667@gmail.com](mailto:maazansari25667@gmail.com)

### Resources

- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

By contributing to HireFlow AI, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to HireFlow AI! 🚀
