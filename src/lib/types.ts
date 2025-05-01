import { GridSpacing, Breakpoint } from '@mui/material'
import { ReactNode } from 'react'

export interface Props {
  onClick?: () => void
  items?: ReactNode[]
  isBlind?: boolean
  spacing?: GridSpacing
  maxWidth?: Breakpoint
  children?: ReactNode
  icon?: ReactNode
  imgUrl?: string
  title?: string
  alt?: string
  label?: string
  size?: number
  user?: {
    name?: string | null | undefined
    image?: string | null | undefined
  }
  variant?: 'circular' | 'rounded' | 'square'
}

export interface User {
  id: number
  name: string
  image: string
}

export interface Params {
  id?: number
  userId?: number
  name?: string
  info?: string
  page?: string
  content?: string
  images?: string[]
  files?: File[]
  rmImgs?: { id: number[]; url: string[] }
}

export interface Image {
  id: number
  url: string
}

export interface Memo {
  id: number
  content?: string
  userId: number
  user: User
  images: Image[]
  createdAt: string
}

export interface IntiVal {
  id?: number
  content?: string
  images?: Image[]
  onSubmit: (params: Params) => void
}
