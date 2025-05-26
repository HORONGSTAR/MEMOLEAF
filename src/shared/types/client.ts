export type UserData = {
  id: number
  name: string
  image: string
  info?: string | null
}

export type ImageData = {
  id?: number
  url: string
  alt: string
}

export type DecoData = {
  [key: 'subtext' | 'folder' | 'secret' | string]: {
    active: 'on' | 'off' | string
    extra: string
  }
}
export interface ProfileData extends Required<UserData> {
  userNum?: number | null
  toUsers?: { fromUserId: number; toUserId: number }[]
}

export interface MemoData {
  id: number
  content: string
  images: Required<ImageData>[]
  decos: DecoData
  user: UserData
  parentId: number | null
  bookmarks: { id: number }[]
  createdAt: Date
  _count?: {
    comments: number
    bookmarks: number
    leafs: number
  }
}

export interface LeafData {
  id: number
  content: string
  images: Required<ImageData>[]
  decos: DecoData
  parentId: number | null
  createdAt: Date
}

export interface CommentData {
  id: number
  text: string
  user: UserData
  memoId: number
  createdAt: Date
}
