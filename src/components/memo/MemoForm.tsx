'use client'
import { Paper, Button, Stack } from '@mui/material'
import { ImgForm, ImgPreview, Blank, TextCount, MemoOption, InputText } from '@/components'
import { useCallback, useState } from 'react'
import { setRenameFile } from '@/lib/utills'
import { useSession } from 'next-auth/react'
import { IntiMemoProps, ImgList, Style } from '@/lib/types'

export default function MemoForm(inti: IntiMemoProps) {
  const [imgFiles, setImgFiles] = useState<File[]>([])
  const [imgList, setImgList] = useState<ImgList>({ create: inti.images || [], remove: [] })
  const [styles, setStyles] = useState<Style[]>(inti.styles || [])
  const [content, setContent] = useState(inti.content || '')
  const { data: session } = useSession()
  const { onSubmit } = inti
  const user = session?.user
  const imgProps = { imgList, setImgList, setImgFiles }

  const handleSubmit = useCallback(() => {
    if (!user) return
    const images: ImgList = {
      create: imgList.create.filter((img) => img.id).map((img) => ({ url: img.url, alt: img.alt })),
      remove: imgList.remove,
    }
    const files = imgFiles.map((file) => {
      const renamedFile = setRenameFile(file)
      images.create.push({ url: renamedFile.name, alt: '' })
      return renamedFile
    })

    onSubmit({ id: user.id, content, files, styles, images })
    setContent('')
    setImgList({ create: [], remove: [] })
    setImgFiles([])
  }, [imgList, user, imgFiles, content, styles, onSubmit])

  return (
    <Paper variant="outlined" sx={{ p: 2, minHeight: 120 }}>
      <MemoOption />
      <InputText fullWidth multiline minRows={3} placeholder="기록을 남겨보세요!" value={content} max={191} fontSize="body1" setValue={setContent} />
      <Stack direction="row" alignItems={'center'} spacing={2}>
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
