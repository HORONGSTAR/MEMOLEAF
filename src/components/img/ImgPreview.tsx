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

  const removeFile = (img: Image, index: number) => {
    const file = images.file.filter((_, i) => i !== index)
    const add = images.add.filter((_, i) => i !== index)
    const del = img.id ? [...images.del, img] : images.del

    setImages({ file, add, del })
  }

  const remove = (img: Image, index: number) => (
    <IconButton sx={{ position: 'absolute', top: -4, right: -4 }} onClick={() => removeFile(img, index)}>
      <Cancel />
    </IconButton>
  )

  const list = images.add.map((img, index) => ({ id: img.id, url: img.id ? imgPath + img.url : img.url, remove: remove(img, index) }))

  return <ImgGrid images={list} />
}
