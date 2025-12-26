import type { RecapData } from '~/types'

export const recapData: RecapData = {
  year: 2024,
  layout: [
    // 第1-2行: music(2x2) + mainPhoto(4x2) + avatar(2x2)
    {
      type: 'grid',
      cols: 2,
      rows: 2,
      data: { id: 'music', image: '/images/2024final/2024-music.png', cols: 2, rows: 2 },
    },
    {
      type: 'grid',
      cols: 4,
      rows: 2,
      data: { id: 'mainPhoto', image: '/images/2024final/2024-photo.jpg', cols: 4, rows: 2 },
    },
    {
      type: 'grid',
      cols: 2,
      rows: 2,
      data: { id: 'avatar', image: '/avatar.png', cols: 2, rows: 2 },
    },
    // 第3-5行: funnyBook(2x3) + photos(2x3) + editor(4x3)
    {
      type: 'grid',
      cols: 2,
      rows: 3,
      data: { id: 'funnyBook', image: '/images/2024final/2024-book-funny.jpg', title: '年度有趣书籍', cols: 2, rows: 3 },
    },
    {
      type: 'grid',
      cols: 2,
      rows: 3,
      data: { id: 'photos', image: '/images/2024final/2024-photos2.jpg', cols: 2, rows: 3 },
    },
    {
      type: 'grid',
      cols: 4,
      rows: 3,
      data: { id: 'editor', image: '/images/2024final/2024-code-vim.png', title: '年度最佳编辑器', cols: 4, rows: 3 },
    },
    // 第6-7行: Map(4x2) + 空白(4x1)
    {
      type: 'map',
      cols: 4,
      rows: 2,
      data: { location: '北京市朝阳区', backgroundImage: '/images/2024final/2024-location.png' },
    },
    { type: 'empty', cols: 4, rows: 1 },
    // 第6-8行: language(4x3)
    {
      type: 'grid',
      gridRow: 6,
      gridCol: 5,
      cols: 4,
      rows: 3,
      data: { id: 'language', image: '/images/2024final/2024-code-rust.png', title: '年度最爱语言', cols: 4, rows: 3 },
    },
    // 第8-10行: podcast(2x3) + personality(4x3) + book(2x3)
    {
      type: 'grid',
      cols: 2,
      rows: 3,
      data: { id: 'podcast', image: '/images/2024final/2024-podcast.jpg', cols: 2, rows: 3 },
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
      data: { id: 'book', image: '/images/2024final/2024-book-fantasy.jpg', title: '年度烧脑推理', cols: 2, rows: 3 },
    },
    // 第11-12行: Github(4x2) + chess(4x2)
    {
      type: 'github',
      cols: 4,
      rows: 2,
      data: { title: 'Universal Rank', rank: 'Top 5%', subtitle: '*Github Commit > 500' },
    },
    {
      type: 'grid',
      cols: 4,
      rows: 2,
      data: { id: 'chess', image: '/images/2024final/2024-chess.png', cols: 4, rows: 2 },
    },
  ],
}
