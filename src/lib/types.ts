import { GridSpacing, Breakpoint } from '@mui/material'
import { Dispatch, ReactNode, SetStateAction } from 'react'

export type RmImgs = {
  id: number[]
  url: string[]
}

export type Image = {
  id: number
  url: string
}

export type User = {
  id: number
  name: string
  image: string
}

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

export interface Params {
  id?: number
  userId?: number
  name?: string
  info?: string
  page?: string
  content?: string
  images?: string[]
  files?: File[]
  rmImgs?: RmImgs
}

export interface Memo {
  id: number
  content?: string
  userId: number
  user: User
  images: Image[]
  style?: string
  createdAt: string
}

export interface IntiMemoVal {
  id?: number
  content?: string
  images?: Image[]
  onSubmit: (params: Params) => void
}

export interface ImageState {
  images: Image[]
  setImages: Dispatch<SetStateAction<Image[]>>
  setImgFiles: Dispatch<SetStateAction<File[]>>
  setRmImgs: Dispatch<
    SetStateAction<{
      id: number[]
      url: string[]
    }>
  >
}
