/* eslint-disable no-console */

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const postsDir = path.resolve(process.cwd(), 'pages/posts')
const postIdPattern = /^\d+$/
const minPostId = 1000

function getPostFiles() {
  return fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .sort()
}

function insertPostId(content, postId) {
  return content.replace(
    /^---\n([\s\S]*?)\n---/,
    (_, frontmatterBlock) => `---\n${frontmatterBlock.replace(/(^title:.*$)/m, `$1\npostId: '${postId}'`)}\n---`,
  )
}

function main() {
  const existingIds = new Map()
  const missingFiles = []

  for (const file of getPostFiles()) {
    const fullPath = path.join(postsDir, file)
    const content = fs.readFileSync(fullPath, 'utf-8')
    const { data } = matter(content)
    const postId = typeof data.postId === 'string' ? data.postId.trim() : ''

    if (!postId) {
      missingFiles.push(fullPath)
      continue
    }

    if (!postIdPattern.test(postId))
      throw new Error(`Invalid postId in ${file}: ${postId}. Use digits only.`)

    const duplicatedFile = existingIds.get(postId)
    if (duplicatedFile)
      throw new Error(`Duplicate postId ${postId} in ${duplicatedFile} and ${file}`)

    existingIds.set(postId, file)
  }

  if (!missingFiles.length) {
    console.log('✓ All posts already have numeric postId')
    return
  }

  let nextPostId = Math.max(minPostId, ...[...existingIds.keys()].map(Number)) + 1

  for (const fullPath of missingFiles) {
    const content = fs.readFileSync(fullPath, 'utf-8')
    const postId = String(nextPostId++)
    const updatedContent = insertPostId(content, postId)

    fs.writeFileSync(fullPath, updatedContent, 'utf-8')
    console.log(`✓ Assigned postId ${postId} to ${path.relative(process.cwd(), fullPath)}`)
  }
}

main()
