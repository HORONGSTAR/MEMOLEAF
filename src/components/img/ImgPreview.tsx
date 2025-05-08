'use client'
import { ImgGrid } from '@/components'
import { imgPath } from '@/lib/utills'
import { ImageState, Image } from '@/lib/types'
import { IconButton } from '@mui/material'
import { Cancel } from '@mui/icons-material'

export default function ImgForm(props: ImageState) {
  const { imgList, setImgList } = props

  const removeFile = (img: Image, index: number) => {
    const files = imgList.files.filter((_, i) => i !== index)
    const create = imgList.create.filter((_, i) => i !== index)
    const remove = img.id ? [...imgList.remove, img] : imgList.remove

    setImgList({ files, create, remove })
  }

  const remove = (img: Image, index: number) => (
    <IconButton sx={{ position: 'absolute', top: -4, right: -4 }} onClick={() => removeFile(img, index)}>
      <Cancel />
    </IconButton>
  )

  const list = imgList.create.map((img, index) => ({ id: img.id, url: img.id ? imgPath + img.url : img.url, remove: remove(img, index) }))

  return <ImgGrid images={list} />
}
