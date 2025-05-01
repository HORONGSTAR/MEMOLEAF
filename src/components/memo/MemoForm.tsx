'use client'
import { InputBase, Paper, Button, Typography } from '@mui/material'
import { ImgForm, Blank, Stack } from '@/components'
import { useCallback, useState } from 'react'
import { setRenameFile } from '@/lib/utills'
import { useSession } from 'next-auth/react'
import { IntiVal, Image } from '@/lib/types'

export default function MemoForm(inti: IntiVal) {
  const [imgFiles, setImgFiles] = useState<File[]>([])
  const [rmImgs, setRmImgs] = useState<{ id: number[]; url: string[] }>({ id: [], url: [] })
  const [images, setImages] = useState<Image[]>(inti.images || [])
  const [content, setContent] = useState(inti.content || '')
  const [length, setLength] = useState(inti.content?.length || 0)
  const { data: session } = useSession()
  const { onSubmit } = inti
  const user = session?.user
  const imgProps = { images, setImages, setImgFiles, setRmImgs }

  const handleChange = (value: string) => {
    if (value.length > 191) return
    setContent(value)
    setLength(value.length)
  }

  const handleSubmit = useCallback(() => {
    if (!user) return
    const images: string[] = []
    const files = imgFiles.map((file) => {
      const renamedFile = setRenameFile(file)
      images.push(renamedFile.name)
      return renamedFile
    })

    onSubmit({ id: user.id, content, images, files, rmImgs })
    setContent('')
    setLength(0)
    setImages([])
    setImgFiles([])
  }, [onSubmit, user, content, imgFiles, rmImgs])

  return (
    <Paper variant="outlined" sx={{ p: 2, minHeight: 120 }}>
      <InputBase
        fullWidth
        multiline
        autoFocus
        minRows={3}
        value={content}
        placeholder={'기록을 남겨보세요!'}
        onChange={(e) => handleChange(e.target.value)}
      />
      <Stack alignItems={'center'} spacing={2}>
        <ImgForm {...imgProps} />
        <Blank />
        <Typography variant="body2">{length} / 191</Typography>
        <Button variant="contained" onClick={handleSubmit}>
          메모
        </Button>
      </Stack>
    </Paper>
  )
}
