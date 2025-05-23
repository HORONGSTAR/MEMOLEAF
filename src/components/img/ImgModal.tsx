'use client'
import { useState } from 'react'
import { BasicProps } from '@/lib/types'
import Image from 'next/image'
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material'

interface Props extends BasicProps {
  size?: number
  alt?: string
}

export default function ImgModalBox(props: Props) {
  const { image, alt, size } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <Image
        onClick={() => setOpen(true)}
        tabIndex={0}
        src={`${image}.jpg?w=150&h=150&c=fill`}
        alt={`${alt} 이미지`}
        width={size || 150}
        height={size || 150}
        style={{ aspectRatio: 1 / 1, objectFit: 'cover', borderRadius: 2 }}
      />

      {open && (
        <Dialog title="이미지 상세보기" open={open} onClose={() => setOpen(false)}>
          <DialogTitle>이미지 상세보기</DialogTitle>
          <img src={`${image}`} alt={`${alt}`} width={600} height={600} />
          {alt}
          <DialogActions>
            <Button onClick={() => setOpen(false)}>닫기</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  )
}
