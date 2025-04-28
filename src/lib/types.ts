import { GridSpacing, Breakpoint } from '@mui/material'
import { ReactNode } from 'react'

export interface Props {
  spacing?: GridSpacing
  maxWidth?: Breakpoint
  children?: ReactNode
  icon?: ReactNode
  imgUrl?: string
  title?: string
  label?: string
  size?: number
  user?: {
    name?: string | null | undefined
    image?: string | null | undefined
  }
  variant?: 'circular' | 'rounded' | 'square'
}

export interface Memo {
  id: number
  content?: string
  userId: number
  user: {
    name: string
    image: string
  }
  createdAt: string
}

export interface IntiVal {
  id?: number
  content?: string
  onSubmit?: (id: number, content: string) => void
}
