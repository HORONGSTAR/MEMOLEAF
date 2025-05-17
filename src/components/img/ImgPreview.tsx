'use client'
import { ImgGrid } from '@/components'
import { imgPath } from '@/lib/utills'
import { EditImage, Image } from '@/lib/types'
import { IconButton } from '@mui/material'
import { Cancel } from '@mui/icons-material'
import { Dispatch, SetStateAction } from 'react'

interface Props {
  images: EditImage
  setImages: Dispatch<SetStateAction<EditImage>>
}
export default function ImgForm(props: Props) {
  const { images, setImages } = props

  const removeFile = (index: number) => {
    const file = images.file.filter((_, i) => i !== index)
    const imgs = images.imgs.filter((_, i) => i !== index)

    setImages({ file, imgs })
  }

  const remove = (_: Image, index: number) => (
    <IconButton sx={{ position: 'absolute', top: -4, right: -4 }} onClick={() => removeFile(index)}>
      <Cancel />
    </IconButton>
  )

  const list = images.imgs.map((img, index) => ({ id: img.id, url: img.id ? imgPath + img.url : img.url, remove: remove(img, index) }))

  return <ImgGrid images={list} layout="list" />
}
