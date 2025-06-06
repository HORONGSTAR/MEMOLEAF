export type MemosAria = 'home' | 'mypost' | 'bookmark' | 'favorite' | 'thread' | 'search' | string

export interface GetMemosParams {
  [key: string]: unknown
  aria: MemosAria
  id?: number
  cursor?: number
  keyword?: string
  filter?: string
}

export interface GetFollowParams {
  endpoint: 'follower' | 'following' | 'search' | string
  query: {
    [key: string]: unknown
    cursor?: number
    id?: number
    keyword?: string
    filter?: string
  }
}

export interface MemoParams {
  id?: number
  content: string
  decos: { kind: string; extra: string }[]
  titleId?: number | null
}

export interface UserParams {
  name?: string
  image?: string
  info?: string
  note?: string
  cover?: string
}
