#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Pre-commit hook to prevent committing private markdown files
 *
 * This script checks all staged .md files for:
 * 1. Files with frontmatter containing `private: true`
 * 2. Files matching the pattern `*.private.md`
 *
 * If any private files are found, the commit will be blocked.
 */

const { execSync } = require('node:child_process')
const fs = require('node:fs')
const matter = require('gray-matter')

// ANSI color codes for terminal output
const colors = {
  reset: '\x1B[0m',
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  green: '\x1B[32m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function getStagedMarkdownFiles() {
  try {
    // Get all staged files
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    })

    // Filter for .md files
    return output
      .split('\n')
      .filter(file => file.trim() && file.endsWith('.md'))
  }
  catch (error) {
    // If git command fails, allow commit to proceed
    log('⚠️  Warning: Could not get staged files', 'yellow')
    return []
  }
}

function checkPrivateFiles(files) {
  const privateFiles = []

  for (const file of files) {
    // Check 1: File name contains .private.md
    if (file.includes('.private.md')) {
      privateFiles.push({
        file,
        reason: 'File name contains .private.md',
      })
      continue
    }

    // Check 2: File is in pages/private/ directory
    if (file.startsWith('pages/private/')) {
      privateFiles.push({
        file,
        reason: 'File is in pages/private/ directory',
      })
      continue
    }

    // Check 3: Frontmatter contains private: true
    try {
      if (!fs.existsSync(file)) {
        // File might be deleted, skip
        continue
      }

      const content = fs.readFileSync(file, 'utf-8')
      const { data } = matter(content)

      if (data.private === true) {
        privateFiles.push({
          file,
          reason: 'Frontmatter contains private: true',
        })
      }
    }
    catch (error) {
      // If we can't parse the file, log warning but allow commit
      log(`⚠️  Warning: Could not parse ${file}: ${error.message}`, 'yellow')
    }
  }

  return privateFiles
}

function main() {
  log('\n🔍 Checking for private files...\n')

  const stagedFiles = getStagedMarkdownFiles()

  if (stagedFiles.length === 0) {
    log('✓ No markdown files staged\n', 'green')
    process.exit(0)
  }

  log(`Found ${stagedFiles.length} staged markdown file(s)`)

  const privateFiles = checkPrivateFiles(stagedFiles)

  if (privateFiles.length === 0) {
    log('✓ No private files detected\n', 'green')
    process.exit(0)
  }

  // Private files found - block commit
  log('\n❌ ERROR: Cannot commit private files!\n', 'red')
  log('The following private files are staged for commit:\n', 'red')

  privateFiles.forEach(({ file, reason }) => {
    log(`  • ${file}`, 'red')
    log(`    Reason: ${reason}\n`, 'yellow')
  })

  log('Please unstage these files before committing:', 'yellow')
  log('  git reset HEAD <file>\n', 'yellow')

  log('Or remove the private marker and try again.\n', 'yellow')

  process.exit(1)
}

// Run the check
main()
