import { ReactNode } from 'react'

export type Active = 'on' | 'off' | string
export type Component = { [key: Active]: ReactNode }

export type Image = { id?: number; url: string; alt?: string }
export type EditImage = { file: File[]; add: Image[]; del: Image[] }
export type Deco = { kind: string; extra: string }
export type EditDeco = { [key: string]: { active: Active; extra: string } }

export interface QueryString {
  [key: string]: unknown
  page?: number | string
  id?: number | string
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

export interface Memo {
  id: number
  content: string
  images: Image[]
  decos: Deco[]
  user: User
  createdAt: string
  replies: Memo[]
  _count: { comments: number; bookmarks: number }
}

export interface MemoParams {
  id: number
  content: string
  images: EditImage
  decos: Deco[]
  parentId?: number
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
