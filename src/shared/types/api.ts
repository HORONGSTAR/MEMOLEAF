export interface GetMemosParams {
  query: {
    [key: string]: unknown
    aria: 'home' | 'mypost' | 'bookmark' | 'thread'
    id?: number
    cursor: number
  }
}

export interface GetFollowParams {
  id: number
  endpoint: 'follower' | 'following'
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
