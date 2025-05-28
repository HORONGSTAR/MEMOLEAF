export type MemosAria = 'home' | 'mypost' | 'bookmark' | 'thread' | 'search' | string

export interface GetMemosParams {
  query: {
    [key: string]: unknown
    aria: MemosAria
    id?: number
    cursor?: number
    keyword?: string
    filter?: string
  }
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
  formData: {
    id?: number
    content: string
    decos: { kind: string; extra: string }[]
    parentId?: number | null
  }
  files: File[]
  imgs: { id?: number; url: string; alt: string }[]
}

export interface UserParams {
  name?: string
  image?: string
  info?: string
  file?: File
}

export interface CommentParams {
  id: number
  text: string
}
