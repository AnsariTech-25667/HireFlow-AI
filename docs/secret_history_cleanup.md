# 🔒 Secret History Cleanup Guide

**⚠️ CRITICAL: Use this guide when secrets have been committed to Git history**

If secrets (API keys, passwords, tokens) have been accidentally committed to your Git repository, you need to completely remove them from the Git history. Simply deleting them in a new commit is **NOT sufficient** as they remain accessible in the commit history.

## 🚨 Emergency Response Checklist

### Immediate Actions (First 5 minutes)

1. **🔄 Rotate all compromised credentials immediately**
   - Generate new API keys
   - Change passwords
   - Revoke old tokens
   - Update environment variables

2. **🛑 Stop the spread**
   - Don't push more commits until cleanup is complete
   - Notify team members if this is a shared repository
   - Consider making repository private temporarily

## 🛠️ Git History Cleanup Methods

### Method 1: git-filter-repo (Recommended)

`git-filter-repo` is the modern, recommended tool for rewriting Git history.

#### Installation

```bash
# Install git-filter-repo
pip install git-filter-repo

# Or on macOS with Homebrew
brew install git-filter-repo

# Or download from GitHub releases
# https://github.com/newren/git-filter-repo/releases
```

#### Usage Examples

**Remove specific files completely:**

```bash
# Remove a file from entire Git history
git filter-repo --path secrets.txt --invert-paths

# Remove multiple files
git filter-repo --path secrets.txt --path config/prod.env --invert-paths
```

**Remove text patterns (secrets) from all files:**

```bash
# Replace AWS keys with placeholder text
git filter-repo --replace-text replacements.txt
```

Create `replacements.txt` with patterns:

```
# AWS Access Keys
AKIA[0-9A-Z]{16}==>AWS_ACCESS_KEY_REMOVED
aws_secret_access_key==>AWS_SECRET_REMOVED

# OpenAI Keys
sk-[a-zA-Z0-9]{48}==>OPENAI_KEY_REMOVED
sk-proj-[a-zA-Z0-9]{48}==>OPENAI_PROJECT_KEY_REMOVED

# JWT Secrets
literal:your_actual_jwt_secret_here==>JWT_SECRET_REMOVED

# MongoDB URIs with credentials
mongodb+srv://username:password@==>mongodb+srv://USER:PASS@
```

**Remove specific lines containing secrets:**

```bash
# Create a script to remove lines containing secrets
cat > remove-secrets.py << 'EOF'
#!/usr/bin/env python3
import re

def process_blob(blob, metadata):
    # Remove lines containing high-confidence secrets
    lines = blob.data.decode('utf-8', errors='ignore').splitlines()

    secret_patterns = [
        r'AKIA[0-9A-Z]{16}',                    # AWS Access Keys
        r'sk-[a-zA-Z0-9]{48}',                  # OpenAI Keys
        r'pk_test_[a-zA-Z0-9_.-]{26,}',         # Clerk Test Keys
        r'sk_test_[a-zA-Z0-9_.-]{26,}',         # Clerk Secret Keys
        r'mongodb\+srv://[^:]+:[^@]+@',         # MongoDB with credentials
        r'-----BEGIN RSA PRIVATE KEY-----',     # Private Keys
    ]

    filtered_lines = []
    for line in lines:
        contains_secret = any(re.search(pattern, line) for pattern in secret_patterns)
        if not contains_secret:
            filtered_lines.append(line)
        else:
            filtered_lines.append('# SECRET REMOVED BY CLEANUP SCRIPT')

    blob.data = '\n'.join(filtered_lines).encode('utf-8')

EOF

chmod +x remove-secrets.py

# Run the filter
git filter-repo --blob-callback remove-secrets.py
```

### Method 2: git filter-branch (Legacy)

⚠️ **Note**: `git filter-branch` is deprecated but included for reference.

```bash
# Remove a file from all commits
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/secret/file' \
  --prune-empty --tag-name-filter cat -- --all

# Remove text pattern from all files
git filter-branch --force --tree-filter \
  'find . -name "*.js" -exec sed -i "s/sk-[a-zA-Z0-9]\{48\}/OPENAI_KEY_REMOVED/g" {} \;' \
  --prune-empty --tag-name-filter cat -- --all
```

## 🔄 After History Cleanup

### 1. Force Push Changes

```bash
# Push the cleaned history (THIS IS DESTRUCTIVE)
git push origin --force --all
git push origin --force --tags

# Or push to specific branch
git push origin main --force
```

### 2. Notify Collaborators

Send this message to all repository collaborators:

```markdown
🚨 IMPORTANT: Git history has been rewritten to remove committed secrets.

Required actions:

1. Delete your local repository
2. Fresh clone: git clone <repository-url>
3. Re-apply any local changes

DO NOT merge old branches - they contain the compromised history.
```

### 3. Clean Up Local Clones

Each collaborator must:

```bash
# Delete local repository
rm -rf repository-name

# Fresh clone
git clone <repository-url>
cd repository-name

# Verify secrets are gone
git log --all --full-history -- path/to/former/secret/file
```

### 4. Verify Cleanup

```bash
# Search for patterns in entire history
git rev-list --all | xargs git grep "AKIA[0-9A-Z]\{16\}" || echo "AWS keys not found"
git rev-list --all | xargs git grep "sk-[a-zA-Z0-9]\{48\}" || echo "OpenAI keys not found"

# Check specific files that contained secrets
git log --all --full-history -- path/to/former/secret/file
```

## 🛡️ Prevention for the Future

### 1. Update Security Tools

Make sure these are configured after cleanup:

```bash
# Install and run secret scanning
npm install
npm run secret-scan

# Verify pre-commit hooks work
git add . && git commit -m "test commit"
```

### 2. Security Checklist

- [ ] All old secrets rotated and disabled
- [ ] New secrets added to `.env` (gitignored)
- [ ] `.env.example` updated with placeholders
- [ ] Pre-commit hooks active and tested
- [ ] Team notified about new security practices
- [ ] Secret scanning integrated into CI/CD

### 3. Environment Variables Setup

```bash
# Copy template
cp .env.example .env

# Edit with real values
nano .env

# Verify gitignore
git status # .env should not appear in tracked files
```

## ⚠️ Important Warnings

- **GitHub/GitLab Cache**: These platforms may cache the old history for up to 24 hours
- **Forks**: External forks will still contain the secret history
- **Local Clones**: All existing clones must be deleted and re-cloned
- **CI/CD**: Update any cached credentials in your deployment pipelines
- **Backup Repos**: Check if any backup systems need updating

## 🆘 Emergency Contacts

If this is a security incident affecting production:

1. **Immediate escalation**: Contact security team
2. **Document incident**: Log the compromise details
3. **Monitor logs**: Check for unauthorized access using old credentials
4. **Update dependencies**: Consider updating packages if keys were in lock files

---

## 📚 Additional Resources

- [Git Filter-Repo Documentation](https://github.com/newren/git-filter-repo)
- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Atlassian: Rewriting Git History](https://www.atlassian.com/git/tutorials/rewriting-history)

**Remember**: Prevention is better than cleanup. Use the pre-commit hooks and secret scanning to prevent future incidents!
