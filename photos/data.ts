interface PhotoMeta {
  ratio: number
  blurhash: string
}

export interface Photo {
  id: string
  img: string
  url: string
  ratio: number
  blurhash: string
}

// 动态加载所有图片 URL
const images = import.meta.glob<string>('./*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})

// 动态加载所有 JSON 元数据
const metadata = import.meta.glob<PhotoMeta>('./*.json', {
  eager: true,
  import: 'default',
})

// 合并图片和元数据
export const photos: Photo[] = Object.entries(images)
  .map(([imagePath, imageUrl]) => {
    const filename = imagePath.split('/').pop() || ''
    const baseName = filename.replace(/\.jpg$/, '')
    // 匹配 metadata 的 key 格式
    const jsonPath = `./${baseName}.json`
    const meta = metadata[jsonPath]

    return {
      id: filename,
      img: imageUrl,
      url: '',
      ratio: meta?.ratio ?? 1,
      blurhash: meta?.blurhash ?? '',
    }
  })
  .sort((a, b) => b.id.localeCompare(a.id)) // 按文件名倒序（最新的在前）
