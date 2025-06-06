'use client'
import { Box, IconButton, ImageList, ImageListItem, Stack, TextField, Typography } from '@mui/material'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Cancel, NoteAlt } from '@mui/icons-material'
import { UploadData } from '@/shared/types/client'
import { imgPath } from '@/shared/utils/common'
import TextCount from '@/components/common/TextCount'
import DialogBox from '@/components/common/DialogBox'
import Image from 'next/image'

interface Props {
  images: UploadData[]
  setImages: Dispatch<SetStateAction<UploadData[]>>
}
export default function ImgForm({ images, setImages }: Props) {
  const [alt, setAlt] = useState('')
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const removeFile = useCallback(
    (index: number) => {
      setImages((prev) => prev.filter((_, i) => i !== index))
    },
    [setImages]
  )

  const addAlt = useCallback(() => {
    setAlt('')
    setOpen(false)
    setImages((prev) => prev.map((img, i) => (i !== index ? img : { ...img, alt })))
  }, [alt, index, setImages])

  const handleChange = (value: string) => {
    if (value.length > 191) return
    setAlt(value)
  }

  return (
    <>
      <ImageList cols={4} sx={{ mt: 2, maxWidth: 600 }}>
        {images.map((img, i) => (
          <ImageListItem key={img.url} sx={{ position: 'relative' }}>
            <Image
              src={img.id ? imgPath + img.url : img.url}
              alt={img.alt}
              width={150}
              height={150}
              style={{ width: '100%', height: '100%', aspectRatio: 1 / 1, objectFit: 'cover', borderRadius: 2 }}
            />
            <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
              <IconButton aria-label="이미지 삭제" size="small" onClick={() => removeFile(i)}>
                <Cancel />
              </IconButton>
            </Box>
            <Box sx={{ position: 'absolute', bottom: 0, left: 0 }}>
              <IconButton
                aria-label="alt작성"
                size="small"
                onClick={() => {
                  setOpen(true)
                  setIndex(i)
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
      <DialogBox open={open} onAction={addAlt} actionLabel="확인" closeLabel="취소" onClose={() => setOpen(false)} title={'대체 텍스트 작성'}>
        <Stack maxWidth={400}>
          <Typography variant="body2">
            대체 텍스트(ALT) : 이미지가 제공하는 정보를 텍스트로 표현하여 화면 읽기 프로그램과 같은 보조 기술을 통해 전달될 수 있도록 도와줍니다
          </Typography>
          <TextCount text={alt} max={191} />
          <TextField value={alt} label="대체 텍스트" onChange={(e) => handleChange(e.target.value)} multiline />
        </Stack>
      </DialogBox>
    </>
  )
}
