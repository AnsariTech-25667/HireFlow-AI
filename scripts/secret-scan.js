#!/usr/bin/env node

/**
 * Secret Scanner - Detects high-confidence secrets in files
 * Cross-platform Node.js implementation for Windows/Mac/Linux
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  reset: '\x1b[0m',
};

console.log(`${colors.yellow}🔍 Running secret scan...${colors.reset}`);

// Secret patterns to detect (high confidence)
const SECRET_PATTERNS = [
  // AWS Keys
  { pattern: /AKIA[0-9A-Z]{16}/g, name: 'AWS Access Key ID' },
  {
    pattern: /aws_secret_access_key["'\s]*[:=]["'\s]*[A-Za-z0-9/+=]{40}/gi,
    name: 'AWS Secret Access Key',
  },

  // OpenAI API Keys
  { pattern: /sk-[a-zA-Z0-9]{48}/g, name: 'OpenAI Secret Key' },
  { pattern: /sk-proj-[a-zA-Z0-9]{48}/g, name: 'OpenAI Project Key' },

  // Clerk Keys
  {
    pattern: /pk_test_[a-zA-Z0-9_.-]{26,}/g,
    name: 'Clerk Publishable Test Key',
  },
  {
    pattern: /pk_live_[a-zA-Z0-9_.-]{26,}/g,
    name: 'Clerk Publishable Live Key',
  },
  { pattern: /sk_test_[a-zA-Z0-9_.-]{26,}/g, name: 'Clerk Secret Test Key' },
  { pattern: /sk_live_[a-zA-Z0-9_.-]{26,}/g, name: 'Clerk Secret Live Key' },

  // Private Keys
  { pattern: /-----BEGIN RSA PRIVATE KEY-----/g, name: 'RSA Private Key' },
  { pattern: /-----BEGIN PRIVATE KEY-----/g, name: 'Generic Private Key' },
  {
    pattern: /-----BEGIN OPENSSH PRIVATE KEY-----/g,
    name: 'OpenSSH Private Key',
  },

  // MongoDB Connection Strings with credentials
  {
    pattern: /mongodb\+srv:\/\/[^:]+:[^@]+@/g,
    name: 'MongoDB URI with credentials',
  },

  // JWT Secrets (long random strings)
  {
    pattern: /JWT_SECRET["'\s]*[:=]["'\s]*[A-Za-z0-9_.-]{32,}/gi,
    name: 'JWT Secret',
  },

  // High-entropy strings that might be secrets (32+ chars, alphanumeric)
  {
    pattern: /["']?[A-Za-z0-9_.-]{50,}["']?\s*$/gm,
    name: 'Potential High-Entropy Secret',
  },
];

// Files and directories to exclude
const EXCLUDE_PATTERNS = [
  /node_modules/,
  /\.git/,
  /dist/,
  /build/,
  /coverage/,
  /\.next/,
  /\.nuxt/,
  /\.vscode/,
  /\.idea/,
  /\.DS_Store/,
  /package-lock\.json$/,
  /yarn\.lock$/,
  /\.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|pdf|zip|tar|gz|7z|rar)$/i,
];

// Exception patterns (template/example values)
const EXCEPTION_PATTERNS = [
  /example/i,
  /template/i,
  /placeholder/i,
  /test/i,
  /mock/i,
  /dummy/i,
  /sample/i,
  /your_/i,
  /<[^>]+>/, // HTML-like placeholders
  /\{[^}]+\}/, // Curly brace placeholders
  /\[[^\]]+\]/, // Square bracket placeholders
  /change_me/i,
  /replace_with/i,
  /username:password/i, // Generic username:password patterns
  /user>:<pass>/i, // Placeholder patterns like <user>:<pass>
  /cluster\.mongodb\.net/i, // MongoDB documentation examples
  /your_cloud_name/i,
  /your_api_key/i,
];

/**
 * Get list of files to scan
 */
function getFilesToScan() {
  const args = process.argv.slice(2);

  if (args.length > 0) {
    // Scan specific files passed as arguments
    return args.filter(
      file => fs.existsSync(file) && fs.statSync(file).isFile()
    );
  }

  // Try to get git tracked files first
  try {
    const gitFiles = execSync('git ls-files', { encoding: 'utf8' })
      .split('\n')
      .filter(file => file.trim())
      .filter(file => fs.existsSync(file));

    if (gitFiles.length > 0) {
      return gitFiles;
    }
  } catch (error) {
    // Not a git repository or git not available
  }

  // Fallback to recursive file scan
  return getAllFiles('.');
}

/**
 * Recursively get all files in directory
 */
function getAllFiles(dir, files = []) {
  try {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip excluded directories
        if (!EXCLUDE_PATTERNS.some(pattern => pattern.test(fullPath))) {
          getAllFiles(fullPath, files);
        }
      } else if (stat.isFile()) {
        // Skip excluded files
        if (!EXCLUDE_PATTERNS.some(pattern => pattern.test(fullPath))) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    // Skip directories we can't read
  }

  return files;
}

/**
 * Check if a line contains exception patterns
 */
function isException(line) {
  return EXCEPTION_PATTERNS.some(pattern => pattern.test(line));
}

/**
 * Check if file should be excluded from secret scanning
 */
function shouldExcludeFile(filePath) {
  const fileName = path.basename(filePath);
  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();

  // Exclude specific files that contain legitimate pattern examples
  const excludedFiles = [
    'secret_history_cleanup.md',
    'secret-scan.js',
    'secret-scan.sh',
    'security.md',
  ];

  // Exclude by filename
  if (
    excludedFiles.some(excluded =>
      fileName.toLowerCase().includes(excluded.toLowerCase())
    )
  ) {
    return true;
  }

  // Exclude scripts and docs directories when they contain security tools
  if (
    normalizedPath.includes('/scripts/') ||
    normalizedPath.includes('/docs/')
  ) {
    return true;
  }

  return false;
}

/**
 * Check a single file for secrets
 */
function checkFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const foundSecrets = [];

    lines.forEach((line, lineNumber) => {
      // Skip lines that look like templates/examples
      if (isException(line)) {
        return;
      }

      SECRET_PATTERNS.forEach(({ pattern, name }) => {
        const matches = line.match(pattern);
        if (matches) {
          matches.forEach(match => {
            foundSecrets.push({
              lineNumber: lineNumber + 1,
              pattern: name,
              maskedContent: line.replace(/[A-Za-z0-9]/g, '*'),
            });
          });
        }
      });
    });

    return foundSecrets;
  } catch (error) {
    // Skip files we can't read (binary files, permission issues, etc.)
    return [];
  }
}

/**
 * Main scanning function
 */
function scanFiles() {
  const filesToScan = getFilesToScan();
  let totalSecretsFound = 0;
  let totalFilesScanned = 0;
  const filesWithSecrets = [];

  console.log('Scanning files for secrets...');

  filesToScan.forEach(file => {
    // Skip files that should be excluded
    if (shouldExcludeFile(file)) {
      return;
    }

    const secrets = checkFile(file);
    totalFilesScanned++;

    if (secrets.length > 0) {
      filesWithSecrets.push({ file, secrets });
      totalSecretsFound += secrets.length;
    }
  });

  // Report results
  console.log('');
  console.log(`📊 Scan complete. Checked ${totalFilesScanned} files.`);

  if (filesWithSecrets.length > 0) {
    console.log(
      `${colors.red}❌ Found potential secrets in ${filesWithSecrets.length} file(s)!${colors.reset}`
    );
    console.log('');

    filesWithSecrets.forEach(({ file, secrets }) => {
      console.log(
        `${colors.red}🚨 Potential secrets found in: ${file}${colors.reset}`
      );
      secrets.forEach(({ lineNumber, pattern, maskedContent }) => {
        console.log(
          `   ${colors.yellow}Line ${lineNumber} (${pattern}):${colors.reset} ${maskedContent}`
        );
      });
      console.log('');
    });

    console.log(`${colors.yellow}🛡️  Security Recommendations:${colors.reset}`);
    console.log('1. Remove secrets from files and use environment variables');
    console.log('2. Add secrets to .env file (which is gitignored)');
    console.log('3. Update .env.example with placeholder values');
    console.log(
      '4. If secrets were committed, see docs/secret_history_cleanup.md'
    );
    console.log('');

    process.exit(1);
  } else {
    console.log(
      `${colors.green}✅ No secrets detected. Repository is clean!${colors.reset}`
    );
    process.exit(0);
  }
}

// Run the scanner
scanFiles();
