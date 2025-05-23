import { BookMark, Comment, Memo, User } from '@prisma/client'
import { ReactNode } from 'react'

export type Layout = 'list' | 'detail' | string
export type OnOff = 'on' | 'off' | string
export type OnOffItem = { [key: OnOff]: ReactNode }
export type Action = { id: null | number; state: null | string }
export type Image = { id?: number; url: string; alt?: string }
export type EditImage = { file: File[]; imgs: Image[] }
export type Deco = { kind: string; extra: string }
export type EditDeco = { [key: string]: { active: OnOff; extra: string } }
export type Status = 'idle' | 'loading' | 'succeeded' | 'failed'

export interface GetDataParams {
  category?: EndPoint
  pagination?: QueryString
}

export interface EndPoint {
  [key: string]: unknown
  bookmark?: number
  detail?: number
  mypost?: number
  thread?: number
  listAria?: number
}

export interface QueryString {
  [key: string]: unknown
  cursor?: number
  limit?: number
  search?: string
  keyword?: string
}

export interface BasicProps {
  image?: string
  children?: ReactNode
  icon?: ReactNode
  label?: string
  component?: ReactNode
}
export interface UserData extends Omit<User, 'credit' | 'createdAt'> {
  toUsers?: { fromUserId: number; toUserId: number }[]
}

export interface UserParams {
  name?: string
  image?: string
  info?: string
  file?: File
}

export interface FollowParams {
  fromUserId?: number
  toUserId: number
  action: 'follow' | 'unfollow' | string
}

export interface BookmarkParams {
  id: number
  action: 'add' | 'remove' | string
}

export interface MemoData extends Memo {
  images: Image[]
  decos: Deco[]
  user: User
  createdAt: Date
  bookmarks?: BookMark[]
  _count?: { comments: number; bookmarks: number; leafs: number }
}

export interface MemoParams {
  id?: number
  content: string
  images: EditImage
  decos: Deco[]
  parentId?: number
}

export interface CommentData extends Comment {
  user: User
}

export interface CommentParams {
  id: number
  text: string
}
