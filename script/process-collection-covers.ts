/* eslint-disable no-console */

/**
 * 处理 collections 封面图片
 *
 * 功能：
 * 1. 遍历 public/images/collections/{year}/ 目录
 * 2. 将中文命名的图片重命名为编号格式 (001.jpg, 002.jpg, ...)
 * 3. 压缩图片（最大 800px，JPEG 质量 80）
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

type ColorName = 'reset' | 'red' | 'yellow' | 'green' | 'cyan' | 'magenta'

const COLLECTIONS_DIR = path.resolve(__dirname, '../public/images/collections')
const MAX_DIMENSION = 800
const JPEG_QUALITY = 80

const colors: Record<ColorName, string> = {
  reset: '\x1B[0m',
  red: '\x1B[31m',
  yellow: '\x1B[33m',
  green: '\x1B[32m',
  cyan: '\x1B[36m',
  magenta: '\x1B[35m',
}

function log(message: string, color: ColorName = 'reset'): void {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function compressImage(inputPath: string, outputPath: string): Promise<number> {
  const stats = fs.statSync(inputPath)

  await sharp(inputPath)
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY })
    .toFile(outputPath)

  const newStats = fs.statSync(outputPath)
  return stats.size - newStats.size
}

async function processYear(yearDir: string): Promise<{ count: number, saved: number }> {
  const yearPath = path.join(COLLECTIONS_DIR, yearDir)

  if (!fs.statSync(yearPath).isDirectory())
    return { count: 0, saved: 0 }

  log(`\n  📁 ${yearDir}/`, 'cyan')

  const files = fs.readdirSync(yearPath)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort()

  if (files.length === 0) {
    log('    (空目录)', 'yellow')
    return { count: 0, saved: 0 }
  }

  let totalSaved = 0
  const renamedFiles: { from: string, to: string }[] = []

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const newName = `${String(i + 1).padStart(3, '0')}.jpg`
    const inputPath = path.join(yearPath, file)
    const tempPath = path.join(yearPath, `_temp_${newName}`)

    try {
      const savedBytes = await compressImage(inputPath, tempPath)
      totalSaved += savedBytes

      renamedFiles.push({ from: file, to: newName })

      const savedKB = (savedBytes / 1024).toFixed(0)
      if (file !== newName)
        log(`    ✓ ${file} → ${newName} (${savedKB}KB)`, 'green')

      else
        log(`    ✓ ${newName} (${savedKB}KB)`, 'green')
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      log(`    ✗ ${file}: ${message}`, 'red')
    }
  }

  // 删除原文件，重命名临时文件
  for (const { from, to } of renamedFiles) {
    const originalPath = path.join(yearPath, from)
    const tempPath = path.join(yearPath, `_temp_${to}`)
    const finalPath = path.join(yearPath, to)

    if (fs.existsSync(originalPath))
      fs.unlinkSync(originalPath)

    if (fs.existsSync(tempPath))
      fs.renameSync(tempPath, finalPath)
  }

  return { count: files.length, saved: totalSaved }
}

async function processCollections(): Promise<void> {
  log('\n🖼️  处理 Collections 封面...\n', 'magenta')

  if (!fs.existsSync(COLLECTIONS_DIR)) {
    log(`目录不存在: ${COLLECTIONS_DIR}`, 'red')
    return
  }

  const years = fs.readdirSync(COLLECTIONS_DIR).sort()

  let totalCount = 0
  let totalSaved = 0

  for (const year of years) {
    const { count, saved } = await processYear(year)
    totalCount += count
    totalSaved += saved
  }

  log('')
  log(`✓ 处理完成 ${totalCount} 张图片`, 'green')
  if (totalSaved > 0)
    log(`✓ 节省 ${(totalSaved / 1024 / 1024).toFixed(2)} MB`, 'green')

  log('')
}

processCollections().catch((error) => {
  const message = error instanceof Error ? error.message : String(error)
  log(`\n✗ 错误: ${message}`, 'red')
  process.exit(1)
})
