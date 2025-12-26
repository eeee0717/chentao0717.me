export interface Post {
  path: string
  title: string
  place?: string
  date: string
  lang?: string
  desc?: string
  platform?: string
  duration?: string
  recording?: string
  radio?: boolean
  video?: boolean
  inperson?: boolean
  redirect?: string
  ai?: boolean
  summary?: string
}

// Recap 年度回顾相关类型
export interface GridItem {
  id: string
  image: string
  title?: string
  cols: number
  rows: number
}

export interface MapData {
  location: string
  backgroundImage: string
}

export interface GithubData {
  title: string
  rank: string
  subtitle: string
}

export interface PersonalityData {
  type: string
  image: string
  color: string
}

// 布局项类型
export type LayoutItemType = 'grid' | 'map' | 'personality' | 'github' | 'empty'

export interface LayoutItem {
  type: LayoutItemType
  // Grid 定位（可选，不指定则自动流式排列）
  gridRow?: number
  gridCol?: number
  cols: number
  rows: number
  // 根据 type 的不同数据
  data?: GridItem | MapData | PersonalityData | GithubData
}

export interface RecapData {
  year: number
  layout: LayoutItem[]
}
