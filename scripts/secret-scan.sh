#!/bin/bash

# Secret Scanner - Detects high-confidence secrets in files
# Exits with code 1 if secrets are found, 0 if clean

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔍 Running secret scan...${NC}"

# Get list of files to scan (staged files if in git hook, otherwise all files)
if [ "$#" -eq 0 ]; then
    # No arguments, scan all tracked files
    FILES=$(git ls-files 2>/dev/null || find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './dist/*' -not -path './build/*')
else
    # Scan specific files passed as arguments
    FILES="$@"
fi

# If no files to scan, exit cleanly
if [ -z "$FILES" ]; then
    echo -e "${GREEN}✅ No files to scan${NC}"
    exit 0
fi

# Secret patterns to detect (high confidence)
declare -a PATTERNS=(
    # AWS Keys
    "AKIA[0-9A-Z]{16}"                          # AWS Access Key ID
    "aws_secret_access_key[\"'\s]*[:=][\"'\s]*[A-Za-z0-9/+=]{40}"  # AWS Secret Access Key
    
    # OpenAI API Keys
    "sk-[a-zA-Z0-9]{48}"                        # OpenAI Secret Key
    "sk-proj-[a-zA-Z0-9]{48}"                   # OpenAI Project Key
    
    # Clerk Keys
    "pk_test_[a-zA-Z0-9_.-]{26,}"               # Clerk Publishable Test Key
    "pk_live_[a-zA-Z0-9_.-]{26,}"               # Clerk Publishable Live Key
    "sk_test_[a-zA-Z0-9_.-]{26,}"               # Clerk Secret Test Key
    "sk_live_[a-zA-Z0-9_.-]{26,}"               # Clerk Secret Live Key
    
    # Private Keys
    "-----BEGIN RSA PRIVATE KEY-----"           # RSA Private Key
    "-----BEGIN PRIVATE KEY-----"               # Generic Private Key
    "-----BEGIN OPENSSH PRIVATE KEY-----"       # OpenSSH Private Key
    
    # MongoDB Connection Strings with credentials
    "mongodb\+srv://[^:]+:[^@]+@"               # MongoDB URI with credentials
    
    # JWT Secrets (long random strings)
    "JWT_SECRET[\"'\s]*[:=][\"'\s]*[A-Za-z0-9_.-]{32,}"  # JWT Secret
    
    # Generic high-entropy strings that look like secrets
    "[\"']?[A-Za-z0-9_.-]{32,}[\"']?\s*$"      # High entropy strings (32+ chars)
)

SECRETS_FOUND=0
TOTAL_FILES=0

# Function to check a single file
check_file() {
    local file="$1"
    local file_secrets=0
    
    # Skip binary files, images, and excluded patterns
    if file "$file" 2>/dev/null | grep -q "binary\|image\|executable"; then
        return 0
    fi
    
    # Skip files that should not contain secrets
    case "$file" in
        *.png|*.jpg|*.jpeg|*.gif|*.ico|*.svg|*.woff|*.woff2|*.ttf|*.eot)
            return 0
            ;;
        *.zip|*.tar|*.gz|*.7z|*.rar)
            return 0
            ;;
        */node_modules/*|*/.git/*|*/dist/*|*/build/*|*/coverage/*)
            return 0
            ;;
    esac
    
    # Check each pattern against the file
    for pattern in "${PATTERNS[@]}"; do
        # Use grep with Perl regex for better pattern matching
        if grep -P -n "$pattern" "$file" 2>/dev/null | grep -v -E "(example|template|placeholder|test|mock|dummy|sample)" | grep -q .; then
            if [ $file_secrets -eq 0 ]; then
                echo -e "${RED}🚨 Potential secrets found in: $file${NC}"
                file_secrets=1
                SECRETS_FOUND=$((SECRETS_FOUND + 1))
            fi
            
            # Show the matches (but mask them for security)
            grep -P -n "$pattern" "$file" 2>/dev/null | grep -v -E "(example|template|placeholder|test|mock|dummy|sample)" | while read -r line; do
                line_num=$(echo "$line" | cut -d: -f1)
                content=$(echo "$line" | cut -d: -f2- | sed 's/[A-Za-z0-9]/*/g')
                echo -e "   ${YELLOW}Line $line_num:${NC} $content"
            done
        fi
    done
    
    TOTAL_FILES=$((TOTAL_FILES + 1))
}

# Process all files
echo "Scanning files for secrets..."
for file in $FILES; do
    if [ -f "$file" ]; then
        check_file "$file"
    fi
done

echo ""
echo -e "📊 Scan complete. Checked $TOTAL_FILES files."

if [ $SECRETS_FOUND -gt 0 ]; then
    echo -e "${RED}❌ Found potential secrets in $SECRETS_FOUND file(s)!${NC}"
    echo ""
    echo -e "${YELLOW}🛡️  Security Recommendations:${NC}"
    echo "1. Remove secrets from files and use environment variables"
    echo "2. Add secrets to .env file (which is gitignored)"
    echo "3. Update .env.example with placeholder values"
    echo "4. If secrets were committed, see docs/secret_history_cleanup.md"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ No secrets detected. Repository is clean!${NC}"
    exit 0
fi