#!/usr/bin/env node

/* eslint-disable no-console */

/**
 * 处理照片：生成 blurhash 和压缩图片
 *
 * 功能：
 * 1. 遍历 public/photos/ 目录下的图片
 * 2. 压缩图片（最大 1440px，JPEG 质量 80）
 * 3. 生成 blurhash 字符串（32x32 采样，4x4 组件）
 * 4. 提取图片尺寸计算 ratio (height/width)
 * 5. 为每张图片生成同名 .json sidecar 文件
 */

const fs = require('node:fs')
const path = require('node:path')
const sharp = require('sharp')
const { encode } = require('blurhash')

const PHOTOS_DIR = path.resolve(__dirname, '../photos')
const MAX_DIMENSION = 1440
const JPEG_QUALITY = 80
const BLURHASH_SIZE = 32
const BLURHASH_COMPONENTS = 4

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

async function generateBlurhash(imagePath) {
  const { data, info } = await sharp(imagePath)
    .resize(BLURHASH_SIZE, BLURHASH_SIZE, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  return encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    BLURHASH_COMPONENTS,
    BLURHASH_COMPONENTS,
  )
}

async function compressImage(inputPath) {
  const metadata = await sharp(inputPath).metadata()
  const needsResize = metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION

  if (!needsResize) {
    // 检查是否需要压缩
    const stats = fs.statSync(inputPath)
    const tempPath = `${inputPath}.tmp`

    await sharp(inputPath)
      .jpeg({ quality: JPEG_QUALITY })
      .toFile(tempPath)

    const newStats = fs.statSync(tempPath)

    // 只有压缩后体积减少 10% 以上才替换
    if (newStats.size < stats.size * 0.9) {
      fs.renameSync(tempPath, inputPath)
      return { compressed: true, savedBytes: stats.size - newStats.size }
    }
    else {
      fs.unlinkSync(tempPath)
      return { compressed: false, savedBytes: 0 }
    }
  }

  // 需要调整尺寸
  const stats = fs.statSync(inputPath)
  const tempPath = `${inputPath}.tmp`

  await sharp(inputPath)
    .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY })
    .toFile(tempPath)

  const newStats = fs.statSync(tempPath)
  fs.renameSync(tempPath, inputPath)

  return { compressed: true, savedBytes: stats.size - newStats.size }
}

async function processPhotos() {
  log('\n🖼️  处理照片...\n', 'magenta')

  // 获取所有图片文件
  const files = fs.readdirSync(PHOTOS_DIR)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort()

  log(`  找到 ${files.length} 张图片\n`, 'cyan')

  let compressCount = 0
  let totalSaved = 0
  let jsonCount = 0

  for (const file of files) {
    const inputPath = path.join(PHOTOS_DIR, file)
    const baseName = file.replace(/\.(jpg|jpeg|png|webp)$/i, '')
    const jsonPath = path.join(PHOTOS_DIR, `${baseName}.json`)

    try {
      // 压缩图片
      const { compressed, savedBytes } = await compressImage(inputPath)
      if (compressed) {
        compressCount++
        totalSaved += savedBytes
      }

      // 获取压缩后的元数据
      const metadata = await sharp(inputPath).metadata()
      const ratio = metadata.height / metadata.width

      // 生成 blurhash
      const blurhash = await generateBlurhash(inputPath)

      // 写入 sidecar JSON
      const jsonData = { ratio, blurhash }
      fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf-8')
      jsonCount++

      const status = compressed ? `压缩 ${(savedBytes / 1024).toFixed(0)}KB` : '跳过'
      log(`  ✓ ${file} (${status})`, compressed ? 'green' : 'yellow')
    }
    catch (error) {
      log(`  ✗ ${file}: ${error.message}`, 'red')
    }
  }

  log('')
  log(`✓ 处理完成 ${files.length} 张图片`, 'green')
  if (compressCount > 0)
    log(`✓ 压缩 ${compressCount} 张，节省 ${(totalSaved / 1024 / 1024).toFixed(2)} MB`, 'green')
  log(`✓ 生成 ${jsonCount} 个 sidecar JSON 文件`, 'green')
  log('')
}

processPhotos().catch((error) => {
  log(`\n✗ 错误: ${error.message}`, 'red')
  process.exit(1)
})
