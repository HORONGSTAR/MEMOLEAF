'use client'
import { Box, IconButton, ImageList, ImageListItem, Stack, TextField, Typography } from '@mui/material'
import { Dispatch, SetStateAction, useState } from 'react'
import { Cancel, NoteAlt } from '@mui/icons-material'
import { ImageData } from '@/shared/types/client'
import { imgPath } from '@/shared/utils/common'
import TextCount from '@/components/common/TextCount'
import Dialog from '@/components/common/Dialog'
import Image from 'next/image'

interface Props {
  imgs: ImageData[]
  setImgs: Dispatch<SetStateAction<ImageData[]>>
  setFiles: Dispatch<SetStateAction<File[]>>
}
export default function ImgForm({ imgs, setImgs, setFiles }: Props) {
  const [alt, setAlt] = useState('')
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const removeFile = (index: number) => {
    setImgs((prev) => prev.filter((_, i) => i !== index))
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addAlt = () => {
    setAlt('')
    setOpen(false)
    setImgs((prev) => prev.map((img, i) => (i !== index ? img : { ...img, alt })))
  }

  const handleChange = (value: string) => {
    if (value.length > 191) return
    setAlt(value)
  }

  return (
    <>
      <ImageList cols={4} sx={{ mt: 2, maxWidth: 600 }}>
        {imgs.map((img) => (
          <ImageListItem key={img.url} sx={{ position: 'relative' }}>
            <Image
              src={img.id ? imgPath + img.url : img.url}
              alt={img.alt}
              width={150}
              height={150}
              style={{ width: '100%', height: '100%', aspectRatio: 1 / 1, objectFit: 'cover', borderRadius: 2 }}
            />
            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
              <IconButton aria-label="이미지 삭제" size="small" onClick={() => removeFile(index)}>
                <Cancel />
              </IconButton>
            </Box>
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
          </ImageListItem>
        ))}
      </ImageList>
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
