#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * Pre-commit hook：为 markdown 文件生成 AI 摘要
 *
 * 检查所有暂存的 .md 文件：
 * 1. frontmatter 包含 `ai: true`
 * 2. 缺少 `summary` 字段
 *
 * 如果设置了 OPENAI_API_KEY，则生成摘要并写回 frontmatter
 */

const { execSync } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const matter = require('gray-matter')

// 加载 .env 文件
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          let value = valueParts.join('=')
          // 移除引号
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith('\'') && value.endsWith('\'')))
            value = value.slice(1, -1)
          process.env[key.trim()] = value
        }
      }
    }
  }
}

loadEnv()

// 终端输出颜色（与 check-private.cjs 保持一致）
const colors = {
  reset: '\x1B[0m',
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  green: '\x1B[32m',
  cyan: '\x1B[36m',
  magenta: '\x1B[35m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function getStagedMarkdownFiles() {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    })
    return output
      .split('\n')
      .filter(file => file.trim() && file.endsWith('.md'))
  }
  catch {
    log('⚠️  警告：无法获取暂存文件', 'yellow')
    return []
  }
}

function findFilesNeedingSummary(files) {
  const needsSummary = []

  for (const file of files) {
    try {
      if (!fs.existsSync(file))
        continue

      const content = fs.readFileSync(file, 'utf-8')
      const { data } = matter(content)

      // 检查 ai: true 且没有 summary
      if (data.ai === true && !data.summary) {
        needsSummary.push({
          file,
          frontmatter: data,
          content,
        })
      }
    }
    catch (error) {
      log(`⚠️  警告：无法解析 ${file}: ${error.message}`, 'yellow')
    }
  }

  return needsSummary
}

async function generateSummary(markdownContent, title, lang) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey)
    throw new Error('未设置 OPENAI_API_KEY 环境变量')

  // 移除 frontmatter
  const contentWithoutFrontmatter = markdownContent.replace(/^---[\s\S]*?---\n/, '')

  const systemPrompt = lang === 'zh'
    ? '博客的作者是槑囿脑袋, 你是一个优秀的编辑, 可以精准的把控博客的主题和内容. 使用中文生成一个简洁的摘要 (2-3 句, 最多 150 字符). 摘要应准确反映文章的主要内容和价值. 不要使用引号包裹摘要.'
    : 'You are an excellent editor who can accurately capture the theme and content of blog posts. Generate a concise summary in English (2-3 sentences, maximum 150 characters). The summary should accurately reflect the main content and value of the article. Do not use quotation marks around the summary.'

  const userPrompt = lang === 'zh'
    ? `请为以下博客文章生成摘要：\n\n标题：${title}\n\n内容：\n${contentWithoutFrontmatter.slice(0, 4000)}`
    : `Generate a summary for this blog post:\n\nTitle: ${title}\n\nContent:\n${contentWithoutFrontmatter.slice(0, 4000)}`

  const response = await fetch('https://open.cherryin.cc/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API 错误: ${response.status} - ${error}`)
  }

  const result = await response.json()
  return result.choices[0].message.content.trim()
}

function writeSummaryToFile(file, originalContent, summary) {
  const { data, content } = matter(originalContent)
  data.summary = summary

  const newContent = matter.stringify(content, data)
  fs.writeFileSync(file, newContent, 'utf-8')
}

async function main() {
  log('\n✨ 检查 AI 摘要生成...\n', 'magenta')

  const stagedFiles = getStagedMarkdownFiles()

  if (stagedFiles.length === 0) {
    log('✓ 没有暂存的 markdown 文件\n', 'green')
    process.exit(0)
  }

  const filesNeedingSummary = findFilesNeedingSummary(stagedFiles)

  if (filesNeedingSummary.length === 0) {
    log('✓ 没有文件需要生成 AI 摘要\n', 'green')
    process.exit(0)
  }

  // 检查 API key
  if (!process.env.OPENAI_API_KEY) {
    log('\n⚠️  警告：未设置 OPENAI_API_KEY，跳过 AI 摘要生成', 'yellow')
    log('设置环境变量以启用自动摘要生成\n', 'yellow')
    filesNeedingSummary.forEach(({ file }) => {
      log(`  跳过: ${file}`, 'yellow')
    })
    process.exit(0)
  }

  log(`发现 ${filesNeedingSummary.length} 个文件需要 AI 摘要：\n`, 'cyan')

  let successCount = 0
  let failCount = 0

  for (const { file, frontmatter, content } of filesNeedingSummary) {
    log(`  处理中: ${file}`, 'cyan')

    try {
      const summary = await generateSummary(
        content,
        frontmatter.title || 'Untitled',
        frontmatter.lang || 'en',
      )

      writeSummaryToFile(file, content, summary)

      // 重新暂存修改后的文件
      execSync(`git add "${file}"`, { encoding: 'utf-8' })

      log(`    ✓ 生成摘要: "${summary.slice(0, 50)}..."`, 'green')
      successCount++
    }
    catch (error) {
      log(`    ✗ 错误: ${error.message}`, 'red')
      failCount++
    }
  }

  log('')
  if (successCount > 0)
    log(`✓ 成功生成 ${successCount} 个摘要`, 'green')

  if (failCount > 0) {
    log(`✗ 失败 ${failCount} 个`, 'red')
    log('你可以手动添加摘要或稍后重试\n', 'yellow')
  }

  // 始终允许提交继续
  process.exit(0)
}

main().catch((error) => {
  log(`意外错误: ${error.message}`, 'red')
  process.exit(0)
})
