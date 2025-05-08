'use client'
import { Paper, Button, Stack } from '@mui/material'
import { ImgForm, ImgPreview, Blank, InputText, ToolBox } from '@/components'
import { useCallback, useState } from 'react'
import { setRenameFile } from '@/lib/utills'
import { IntiMemoProps, ImgList, Style } from '@/lib/types'

export default function MemoForm(inti: IntiMemoProps) {
  const [imgList, setImgList] = useState<ImgList>({ files: [], create: inti.images || [], remove: [] })
  const [styles, setStyles] = useState<Style[]>(inti.styles || [])
  const [content, setContent] = useState(inti.content || '')
  const imgProps = { imgList, setImgList }

  console.log(styles)

  const handleSubmit = useCallback(() => {
    const images: ImgList = {
      files: [],
      create: imgList.create.filter((img) => img.id).map((img) => ({ url: img.url, alt: img.alt })),
      remove: imgList.remove,
    }
    const renamedFiles = imgList.files.map((file) => {
      const renamedFile = setRenameFile(file)
      images.create.push({ url: renamedFile.name, alt: '' })
      return renamedFile
    })

    images.files = renamedFiles
    inti.onSubmit({ id: 0, content, styles, images })
    setContent('')
    setImgList({ files: [], create: [], remove: [] })
  }, [imgList, content, styles, inti])

  const handleChange = (value: string) => {
    if (value.length > 191) return
    setContent(value)
  }

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <ToolBox setStyles={setStyles} />
      <InputText
        sx={{ p: 1 }}
        fullWidth
        multiline
        minRows={3}
        aria-label="메모 입력"
        placeholder="기록을 남겨보세요!"
        value={content}
        fontSize="body1"
        onChange={(e) => handleChange(e.target.value)}
      />
      <ImgPreview {...imgProps} />
      <Stack direction="row" alignItems="center">
        <ImgForm {...imgProps} />
        <Blank />
        <Button variant="contained" onClick={handleSubmit}>
          메모
        </Button>
      </Stack>
    </Paper>
  )
}
