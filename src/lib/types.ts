import { ReactNode } from 'react'

export type Active = 'on' | 'off' | string
export type ActiveNode = { [key: Active]: ReactNode }

export type Image = { id?: number; url: string; alt?: string }
export type EditImage = { file: File[]; imgs: Image[] }
export type Deco = { kind: string; extra: string }
export type EditDeco = { [key: string]: { active: Active; extra: string } }

export interface FollowMemos {
  query: QueryString
  myId: number
}

export interface QueryString {
  [key: string]: unknown
  page?: number | string
  limit?: number | string
  id?: number | string
  keyword?: string
  userId?: number | string
  parentId?: number | string
}

export interface BasicProps {
  image?: string
  children?: ReactNode
  icon?: ReactNode
  label?: string
  component?: ReactNode
}
export interface User {
  id: number
  userNum: number
  name: string
  image: string
  info: string
}

export interface UserParams {
  id: number
  name?: string
  image?: string
  info?: string
  file?: File
}

export interface FollowParams {
  followedById: number
  followingId: number
}

export interface Memo {
  id: number
  content: string
  images: Image[]
  decos: Deco[]
  user: User
  createdAt: string
  leafs: Memo[]
  parentId: number
  _count: { comments: number; bookmarks: number; leafs: number }
}

export interface MemoParams {
  id: number
  content: string
  images: EditImage
  decos: Deco[]
  parentId?: number
  user?: User
}

export interface Comment {
  id: number
  text: string
  user: User
  memoId: number
  createdAt: string
}

export interface CommentParams {
  id: number
  text: string
  userId: number
}
