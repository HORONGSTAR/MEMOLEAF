import { ReactNode } from 'react'

export type Image = { id?: number; url: string; alt?: string }
export type EditImage = { file: File[]; add: Image[]; del: Image[] }
export type Deco = { kind: string; extra: string }
export type EditDeco = { [key: string]: { active: string; extra: string } }

export interface BasicProps {
  image?: string
  children?: ReactNode
  icon?: ReactNode
  label?: string
  component?: ReactNode
}
export interface User {
  id: number
  name: string
  image: string
  info: string
}

export interface Memo {
  id: number
  content: string
  images: Required<Image>[]
  decos: Deco[]
  user: User
  createdAt: string
}

export interface MemoParams {
  id: number
  content: string
  images: EditImage
  decos: Deco[]
}
