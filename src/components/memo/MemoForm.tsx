'use client'
import { Paper, Button, Stack } from '@mui/material'
import { ImgForm, ImgPreview, Blank, InputText, MemoTool, MemoToolItem } from '@/components'
import { useCallback, useMemo, useState } from 'react'
import { setRenameFile, swapOnOff } from '@/lib/utills'
import { MemoParams, Image, EditImage, EditDeco } from '@/lib/types'

export interface MemoFormData {
  id?: number
  content?: string
  images?: Image[]
  decos?: EditDeco
  placeholder?: string
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
      add: images.add.filter((img) => img.id).map((img) => ({ url: img.url, alt: img.alt })),
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

    inti.onSubmit({
      id: 0,
      content,
      images: editImage,
      decos: editDecos,
    })

    setContent('')
    setImages({ file: [], add: [], del: [] })
  }, [content, images, decos, inti])

  const handleChange = (value: string) => {
    if (value.length > 191) return
    setContent(value)
  }

  const isEdit = useMemo(() => (inti.id ? true : false), [inti])

  return (
    <Paper onClick={(e) => e.stopPropagation()} variant="outlined" sx={{ p: 2, bgcolor: '#ebf0e4' }}>
      <Stack sx={{ bgcolor: '#fff', p: 1, mb: 2 }}>
        <MemoToolItem {...decoProps} />
        <InputText
          id="content"
          multiline
          autoFocus
          minRows={3}
          aria-label="메모 입력"
          placeholder={inti.placeholder || '기록을 남겨보세요!'}
          value={content}
          fontSize="body1"
          onChange={(e) => handleChange(e.target.value)}
        />
        <ImgPreview {...imageProps} />
      </Stack>
      <Stack direction="row" alignItems="center">
        <ImgForm {...imageProps} />
        <MemoTool {...decoProps} />
        <Blank />
        <Button
          variant={isEdit ? 'outlined' : 'contained'}
          onClick={(e) => {
            e.stopPropagation()
            handleSubmit()
          }}
        >
          {isEdit ? '수정' : '메모'}
        </Button>
      </Stack>
    </Paper>
  )
}
