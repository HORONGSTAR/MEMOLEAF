import { Dispatch, ReactNode, SetStateAction } from 'react'

export type Image = {
  id?: number
  url: string
  alt?: string
}

export type ImgList = { files: File[]; create: Image[]; remove: Image[] }

export interface User {
  id: number
  name: string
  image: string
}

export interface UserParams extends User {
  info: string
}

export interface MemoParamsD {
  id: number
  images: ImgList
}

export interface MemoParamsCU extends MemoParamsD {
  content: string
  styles: Style[]
}

export interface Memo {
  id: number
  content: string
  images: Image[]
  styles: Style[]
}

export interface MemoProps extends Memo {
  userId: number
  user: User
  createdAt: string
}

export interface IntiMemoProps extends Memo {
  onSubmit: (params: MemoParamsCU) => void
}

export interface BasicProps {
  image?: string
  children?: ReactNode
  icon?: ReactNode
  label?: string
  component?: ReactNode
}

export type Option = { [key: string]: { activate: string; extra?: string } }

export type Style = {
  option: string
  extra?: string
}

export interface ImageState {
  imgList: ImgList
  setImgList: Dispatch<SetStateAction<ImgList>>
}
