export type UserData = {
  id: number
  name: string
  image: string
  info?: string | null
  userNum?: number | null
}

export type ImageData = {
  id?: number
  url: string
  alt: string
}

export interface UploadData extends ImageData {
  file?: File
}

export type DecoData = {
  [key: 'subtext' | 'folder' | 'secret' | string]: {
    active: 'on' | 'off' | string
    extra: string
  }
}
export interface ProfileData extends UserData {
  note?: string | null
  cover?: string | null
  followings?: { followerId: number; followingId: number }[]
}

export interface MemoData {
  id: number
  content: string
  images: Required<ImageData>[]
  decos: DecoData
  user: UserData
  titleId: number | null
  createdAt: Date
  bookmarks?: { id: number }
  favorites?: { id: number }
  _count: {
    favorites: number
    bookmarks: number
    leafs: number
  }
}

export interface NotificationsData {
  id: number
  aria: 'comment' | 'follow' | 'favorite'
  memo?: { id: number; content: string } | null
  sander: UserData
}
