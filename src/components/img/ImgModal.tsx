'use client'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useState } from 'react'
import { BasicProps } from '@/lib/types'
import Image from 'next/image'

export default function ImgModalBox(props: BasicProps) {
  const { image, label } = props
  const [open, setOpen] = useState(false)

  return (
    <>
      <Image
        onClick={() => setOpen(true)}
        src={`${image}`}
        alt={`${label}`}
        width={852}
        height={852}
        className="aspect-square object-cover rounded-2xl"
      />
      <Dialog open={open}>
        <DialogTitle>미리보기</DialogTitle>
        <DialogContent>
          <Image src={`${image}`} alt={`${label}`} width={1024} height={1024} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
