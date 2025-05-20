'use client'
import { Image, Layout } from '@/lib/types'
import { ImgModal } from '@/components'
import { ImageList, ImageListItem } from '@mui/material'
import { ReactNode } from 'react'

interface Images extends Image {
  remove?: ReactNode
  noteAlt?: ReactNode
}

interface Props {
  images: Images[]
  layout: Layout
  dense?: boolean
}

export default function ImgGrid({ images, layout, dense }: Props) {
  const count = images.length
  if (count === 0) return null

  const detail = () => {
    const cols: { [key: number]: number } = { 1: 2, 2: 4, 3: 3, 4: 2 }
    const imgListRow1 = images.slice(0, 4 - count).map((img) => (
      <ImageListItem key={img.id} cols={2} rows={2}>
        <ImgModal image={img.url} size={700} alt={img.alt} />
      </ImageListItem>
    ))

    const imgListRow2 = images.slice(4 - count, count).map((img) => (
      <ImageListItem key={img.id}>
        <ImgModal image={img.url} size={700} alt={img.alt} />
      </ImageListItem>
    ))
    return (
      <ImageList cols={cols[count]} sx={{ mt: 2 }}>
        {imgListRow1}
        {imgListRow2}
      </ImageList>
    )
  }

  const basic = (
    <ImageList cols={4} sx={{ mt: 2, maxWidth: dense ? 600 : 'auto' }}>
      {images.map((img) => (
        <ImageListItem key={img.url} sx={{ position: 'relative' }}>
          {img.remove}
          {img.noteAlt}
          <ImgModal image={img.url} alt={img.alt} />
        </ImageListItem>
      ))}
    </ImageList>
  )

  return <>{{ card: basic, list: basic, detail }[layout]}</>
}
