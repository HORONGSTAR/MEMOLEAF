'use client'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { useState } from 'react'
import { imgPath } from '@/shared/utils/common'
import Image from 'next/image'

interface Props {
  images: { id: number; url: string; alt: string }[]
}

export default function ImgGrid({ images }: Props) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const count = images.length
  if (count === 0) return null

  return (
    <Grid container spacing={1} minWidth="100%" minHeight={{ 1: 160, 2: 160, 3: { sm: 160, xs: 320 }, 4: 320 }[count]}>
      {images.map((img, index) => (
        <Grid size={{ 1: 6, 2: 6, 3: { sm: 4, xs: { 0: 12, 1: 6, 2: 6 }[index] }, 4: 6 }[count]} position="relative" key={img.url}>
          <Image
            tabIndex={0}
            src={imgPath + img.url}
            alt={img.alt}
            fill
            style={{ aspectRatio: 1 / 1, objectFit: 'cover', borderRadius: 2 }}
            onClick={() => {
              setIndex(index)
              setOpen(true)
            }}
          />
        </Grid>
      ))}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>이미지 상세보기</DialogTitle>
        <DialogContent>
          <img src={imgPath + images[index].url} alt={images[index].alt} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
