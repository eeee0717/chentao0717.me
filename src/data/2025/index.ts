import type { RecapData } from '~/types'

export const recapData: RecapData = {
  year: 2025,
  layout: [
    // 第1-2行: music(2x2) + photo(4x2) + avatar(2x2)
    {
      type: 'grid',
      cols: 2,
      rows: 2,
      data: { id: 'music', image: '/images/2025/Song.jpg', cols: 2, rows: 2 },
    },
    {
      type: 'grid',
      cols: 4,
      rows: 2,
      data: { id: 'photo', image: '/images/2025/Photo.jpg', cols: 4, rows: 2 },
    },
    {
      type: 'grid',
      cols: 2,
      rows: 2,
      data: { id: 'avatar', image: '/avatar.png', cols: 2, rows: 2 },
    },
    // 第3-4行: language(4x2) + ai(4x2)
    {
      type: 'grid',
      cols: 4,
      rows: 2,
      data: { id: 'language', image: '/images/2025/TypeScript.jpg', cols: 4, rows: 2 },
    },
    {
      type: 'grid',
      cols: 4,
      rows: 2,
      data: { id: 'ai', image: '/images/2025/ClaudeCode.jpg', cols: 4, rows: 2 },
    },
    {
      type: 'grid',
      cols: 2,
      rows: 3,
      data: { id: 'book', image: '/images/2025/Book.jpg', cols: 2, rows: 3 },
    },
    {
      type: 'personality',
      cols: 4,
      rows: 3,
      data: { type: 'INFJ', image: '/images/infj.svg', color: '#33a474' },
    },
    {
      type: 'grid',
      cols: 2,
      rows: 3,
      data: { id: 'podcast', image: '/images/2025/Podcasts.jpg', cols: 2, rows: 3 },
    },
    {
      type: 'github',
      cols: 4,
      rows: 2,
      data: { title: 'Universal Rank', rank: 'Top 1%', subtitle: '*Github Commit > 2000' },
    },
    {
      type: 'map',
      cols: 4,
      rows: 2,
      data: { location: '北京市朝阳区', backgroundImage: '/images/2024final/2024-location.png' },
    },
  ],
}
