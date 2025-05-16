'use client'
import { Image } from '@/lib/types'
import { ImgModal } from '@/components'
import { Box, ImageList, ImageListItem } from '@mui/material'
import { ReactNode } from 'react'

interface Images extends Image {
  remove?: ReactNode
}

interface Props {
  images: Images[]
  isDetail?: boolean
}

export default function ImageGrid({ images, isDetail }: Props) {
  const count = images.length
  if (count === 0) return null

  if (isDetail) {
    const cols: { [key: number]: number } = { 1: 2, 2: 4, 3: 3, 4: 2 }
    const imgListRow1 = images.slice(0, 4 - count).map((img) => (
      <ImageListItem key={img.id} cols={2} rows={2}>
        <ImgModal image={img.url} size={700} />
      </ImageListItem>
    ))

    const imgListRow2 = images.slice(4 - count, count).map((img) => (
      <ImageListItem key={img.id}>
        <ImgModal image={img.url} size={700} />
      </ImageListItem>
    ))
    return (
      <ImageList cols={cols[count]} sx={{ mt: 2 }}>
        {imgListRow1}
        {imgListRow2}
      </ImageList>
    )
  }

  return (
    <ImageList cols={4} sx={{ mt: 2 }}>
      {images.map((img) => (
        <ImageListItem key={img.url}>
          <Box position="relative">
            {img.remove}
            <ImgModal image={img.url} label={img.id + 'img'} />
          </Box>
        </ImageListItem>
      ))}
    </ImageList>
  )
}
