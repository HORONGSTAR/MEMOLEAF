'use client'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useState } from 'react'
import { Props } from '@/lib/types'

export default function ImgModalBox({ imgUrl, label }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <img onClick={() => setOpen(true)} src={`${imgUrl}`} alt={`${label}`} className="aspect-square object-cover" />
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
