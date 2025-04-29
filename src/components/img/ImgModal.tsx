'use client'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useState } from 'react'
import { Props } from '@/lib/types'
import Image from 'next/image'

export default function ImgModalBox({ imgUrl, label }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Image
        onClick={() => setOpen(true)}
        src={`${imgUrl}`}
        alt={`${label}`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover rounded"
      />
      <Dialog open={open}>
        <DialogTitle>미리보기</DialogTitle>
        <DialogContent>
          <img src={`${imgUrl}`} alt={`${label}`} className="max-h-[80vh] m-auto" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
