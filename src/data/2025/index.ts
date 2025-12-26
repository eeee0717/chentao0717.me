import type { RecapData } from '~/types'

export const recapData: RecapData = {
  year: 2025,
  layout: [
    // 第1-2行: music(2x2) + photo(4x2) + avatar(2x2)
    {
      type: 'grid',
      gridRow: 1,
      cols: 2,
      rows: 2,
      data: { id: 'music', image: '/images/2025/Song.jpg', cols: 2, rows: 2 },
    },
    {
      type: 'grid',
      gridRow: 1,
      cols: 4,
      rows: 2,
      data: { id: 'photo', image: '/images/2025/Photo.jpg', cols: 4, rows: 2 },
    },
    {
      type: 'grid',
      gridRow: 1,
      cols: 2,
      rows: 2,
      data: { id: 'avatar', image: '/avatar.png', cols: 2, rows: 2 },
    },
    // 第3-4行: language(4x2) + ai(4x2)
    {
      type: 'grid',
      gridRow: 3,
      cols: 4,
      rows: 2,
      data: { id: 'language', image: '/images/2025/TypeScript.jpg', cols: 4, rows: 2 },
    },
    {
      type: 'grid',
      gridRow: 3,
      cols: 4,
      rows: 2,
      data: { id: 'ai', image: '/images/2025/ClaudeCode.jpg', cols: 4, rows: 2 },
    },
    // 第5-7行: book(2x3) + personality(4x3) + podcast(2x3)
    {
      type: 'grid',
      gridRow: 5,
      cols: 2,
      rows: 3,
      data: { id: 'book', image: '/images/2025/Book.jpg', cols: 2, rows: 3 },
    },
    {
      type: 'personality',
      gridRow: 5,
      cols: 4,
      rows: 3,
      data: { type: 'INFJ', image: '/images/infj.svg', color: '#33a474' },
    },
    {
      type: 'grid',
      gridRow: 5,
      cols: 2,
      rows: 3,
      data: { id: 'podcast', image: '/images/2025/Podcasts.jpg', cols: 2, rows: 3 },
    },
    // 第8-9行: github(4x2) + travel(4x2)
    {
      type: 'github',
      gridRow: 8,
      cols: 4,
      rows: 2,
      data: { title: 'Universal Rank', rank: 'Top 1%', subtitle: '*Github Commit > 2000' },
    },
    {
      type: 'travel',
      gridRow: 8,
      cols: 4,
      rows: 2,
      data: {
        backgroundImage: '/images/2024final/2024-location.png',
        locations: [
          { location: '杭州', position: { x: 90, y: 50 } },
          { location: '桂林', position: { x: 20, y: 88 } },
          { location: '北京', position: { x: 70, y: 8 } },
          { location: '成都', position: { x: 8, y: 48 } },
          { location: '天津', position: { x: 72, y: 17 } },
          { location: '贵阳', position: { x: 12, y: 80 } },
          { location: '昆明', position: { x: 4, y: 88 } },
          { location: '重庆', position: { x: 12, y: 54 } },
        ],
      },
    },
  ],
}
