'use client'
import { Paper, Button, Stack } from '@mui/material'
import { ImgForm, ImgPreview, Blank, InputText, MemoTool, MemoToolItem } from '@/components'
import { useCallback, useState } from 'react'
import { setRenameFile, swapOnOff } from '@/lib/utills'
import { MemoParams, Image, EditImage, EditDeco } from '@/lib/types'

export interface MemoFormData {
  id?: number
  content?: string
  images?: Image[]
  decos?: EditDeco
  onSubmit: (params: MemoParams) => void
}

const kindData = {
  subtext: { active: 'off', extra: '' },
  folder: { active: 'off', extra: '' },
  secret: { active: 'off', extra: '' },
}

export default function MemoForm(inti: MemoFormData) {
  const [images, setImages] = useState<EditImage>({ file: [], add: inti.images || [], del: [] })
  const [decos, setDecos] = useState<EditDeco>({ ...kindData, ...inti.decos })
  const [content, setContent] = useState(inti.content || '')
  const imageProps = { images, setImages }

  const decoProps = { decos, setDecos }

  const handleSubmit = useCallback(() => {
    const editImage: EditImage = {
      file: [],
      add: images.add.filter((img) => img.id),
      del: images.del,
    }
    const renamedFiles = images.file.map((f) => {
      const renamedFile = setRenameFile(f)
      editImage.add.push({ url: renamedFile.name, alt: '' })
      return renamedFile
    })

    const editDecos = Object.keys(decos)
      .filter((key) => swapOnOff[decos[key].active].bool)
      .map((key) => ({ kind: key, extra: decos[key].extra }))
    editImage.file = renamedFiles
    inti.onSubmit({ id: 0, content, images: editImage, decos: editDecos })
    setContent('')
    setImages({ file: [], add: [], del: [] })
  }, [content, images, decos, inti])

  const handleChange = (value: string) => {
    if (value.length > 191) return
    setContent(value)
  }

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <MemoToolItem {...decoProps} />
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

      <ImgPreview {...imageProps} />
      <Stack direction="row" alignItems="center">
        <ImgForm {...imageProps} />
        <MemoTool {...decoProps} />
        <Blank />
        <Button variant="contained" onClick={handleSubmit}>
          메모
        </Button>
      </Stack>
    </Paper>
  )
}
