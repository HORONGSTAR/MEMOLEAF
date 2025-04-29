'use client'
import { InputBase, Paper, Button, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { createMemoThunk } from '@/store/slices/postSlice'
import { useSession } from 'next-auth/react'
import { IntiVal } from '@/lib/types'
import { setRenameFile } from '@/lib/utills'
import { ImgForm, Blank, Stack } from '@/components'

export default function MemoForm(inti: IntiVal) {
  const dispatch = useAppDispatch()
  const [imgFiles, setImgFiles] = useState<File[]>([])
  const [imgUrls, setImgUrls] = useState<string[]>(inti.images || [])
  const [content, setContent] = useState(inti.content || '')
  const [length, setLength] = useState(inti.content?.length || 0)
  const { data: session } = useSession()
  const user = session?.user

  const imgProps = { imgUrls, setImgFiles, setImgUrls }

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
    if (inti.id && inti.onSubmit) {
      inti.onSubmit(inti.id, content)
    } else {
      dispatch(createMemoThunk({ user, content, images, files }))
      setContent('')
      setLength(0)
      setImgUrls([])
      setImgFiles([])
    }
  }, [dispatch, inti, user, content, imgFiles])

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
