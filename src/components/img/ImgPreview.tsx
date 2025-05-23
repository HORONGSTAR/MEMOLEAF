'use client'
import { Dialog, TextCount } from '@/components/common'
import { imgPath } from '@/lib/utills'
import { EditImage, Image } from '@/lib/types'
import { Box, IconButton, Stack, TextField, Typography } from '@mui/material'
import { Cancel, NoteAlt } from '@mui/icons-material'
import { Dispatch, SetStateAction, useState } from 'react'
import ImgGrid from './ImgGrid'

interface Props {
  images: EditImage
  setImages: Dispatch<SetStateAction<EditImage>>
}
export default function ImgForm(props: Props) {
  const { images, setImages } = props
  const [alt, setAlt] = useState('')
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const removeFile = (index: number) => {
    const file = images.file.filter((_, i) => i !== index)
    const imgs = images.imgs.filter((_, i) => i !== index)

    setImages({ file, imgs })
  }

  const addAlt = () => {
    const imgs = images.imgs.map((img, i) => (i !== index ? img : { ...img, alt }))
    setAlt('')
    setOpen(false)
    setImages((prev) => ({ ...prev, imgs }))
  }

  const remove = (_: Image, index: number) => (
    <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
      <IconButton aria-label="이미지 삭제" size="small" onClick={() => removeFile(index)}>
        <Cancel />
      </IconButton>
    </Box>
  )
  const noteAlt = (img: Image, index: number) => (
    <Box sx={{ position: 'absolute', bottom: 0, left: 0 }}>
      <IconButton
        aria-label="alt작성"
        size="small"
        onClick={() => {
          setOpen(true)
          setIndex(index)
        }}
      >
        <NoteAlt />
      </IconButton>
      <Typography variant="caption" color="textSecondary" noWrap>
        {img.alt}
      </Typography>
    </Box>
  )

  const list = images.imgs.map((img, index) => ({
    id: img.id,
    url: img.id ? imgPath + img.url : img.url,
    remove: remove(img, index),
    noteAlt: noteAlt(img, index),
  }))

  const handleChange = (value: string) => {
    if (value.length > 191) return
    setAlt(value)
  }

  return (
    <>
      <ImgGrid images={list} layout="list" dense />
      <Dialog open={open} onAction={addAlt} actionLabel="확인" closeLabel="취소" onClose={() => setOpen(false)} title={'대체 텍스트 작성'}>
        <Stack maxWidth={400}>
          <Typography variant="body2">
            대체 텍스트(ALT) : 이미지가 제공하는 정보를 텍스트로 표현하여 화면 읽기 프로그램과 같은 보조 기술을 통해 전달될 수 있도록 도와줍니다
          </Typography>
          <TextCount text={alt} max={191} />
          <TextField value={alt} label="대체 텍스트" onChange={(e) => handleChange(e.target.value)} multiline />
        </Stack>
      </Dialog>
    </>
  )
}
