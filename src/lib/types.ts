import { Dispatch, ReactNode, SetStateAction } from 'react'

export type Image = {
  id?: number
  url: string
  alt: string
}

export type ImgList = { create: Image[]; remove: Image[] }

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
  files: File[]
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

export type Activate = 'on' | 'off'

export type Options = {
  info: { activate: Activate; extra?: string }
  secret: { activate: Activate; extra?: string }
  folder: { activate: Activate; extra?: string }
}

export type Style = {
  option: 'info' | 'secret' | 'folder'
  extra: string
}

export interface ImageState {
  imgList: ImgList
  setImgList: Dispatch<SetStateAction<ImgList>>
  setImgFiles: Dispatch<SetStateAction<File[]>>
}
