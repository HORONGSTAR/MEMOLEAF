'use client'
import { Paper, Button } from '@mui/material'
import { ImgForm, ImgPreview, Blank, Stack, TextCount, MemoOption, InputText } from '@/components'
import { useCallback, useState } from 'react'
import { setRenameFile } from '@/lib/utills'
import { useSession } from 'next-auth/react'
import { IntiMemoVal, Image, RmImgs } from '@/lib/types'

export default function MemoForm(inti: IntiMemoVal) {
  const [imgFiles, setImgFiles] = useState<File[]>([])
  const [rmImgs, setRmImgs] = useState<RmImgs>({ id: [], url: [] })
  const [images, setImages] = useState<Image[]>(inti.images || [])
  const [content, setContent] = useState(inti.content || '')
  const { data: session } = useSession()
  const { onSubmit } = inti
  const user = session?.user
  const imgProps = { images, setImages, setImgFiles, setRmImgs }

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
    setImages([])
    setImgFiles([])
  }, [onSubmit, user, content, imgFiles, rmImgs])

  return (
    <Paper variant="outlined" sx={{ p: 2, minHeight: 120 }}>
      <MemoOption />
      <InputText
        fullWidth
        multiline
        minRows={3}
        placeholder="기록을 남겨보세요!"
        value={content}
        max={191}
        fontSize="body1"
        setValue={setContent}
      />
      <Stack alignItems={'center'} spacing={2}>
        <ImgForm {...imgProps} />
        <Blank />
        <TextCount text={content} max={191} />
        <Button variant="contained" onClick={handleSubmit}>
          메모
        </Button>
      </Stack>
      <ImgPreview {...imgProps} />
    </Paper>
  )
}
