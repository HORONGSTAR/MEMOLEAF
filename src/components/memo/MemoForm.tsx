'use client'
import { Button, Snackbar, Stack } from '@mui/material'
import { ImgForm, ImgPreview, Blank, InputText, MemoTool, MemoToolItem, TextCount } from '@/components'
import { ReactNode, useCallback, useMemo, useState } from 'react'
import { swapOnOff } from '@/lib/utills'
import { MemoData, MemoParams, EditImage, EditDeco } from '@/lib/types'

interface MemoFormData extends Partial<Omit<MemoData, 'decos'>> {
  decos?: EditDeco
  placeholder?: string
  children?: ReactNode
  onSubmit: (params: Omit<MemoParams, 'id'>) => void
}

const kindData = {
  subtext: { active: 'off', extra: '' },
  folder: { active: 'off', extra: '' },
  secret: { active: 'off', extra: Math.random().toString(36).slice(2, 8) },
}

export default function MemoForm(inti: MemoFormData) {
  const [images, setImages] = useState<EditImage>({ file: [], imgs: inti.images || [] })
  const [decos, setDecos] = useState<EditDeco>({ ...kindData, ...inti.decos })
  const [content, setContent] = useState(inti.content || '')
  const [message, setMessage] = useState('')
  const imageProps = { images, setImages }
  const decoProps = { decos, setDecos }
  const { children, placeholder } = inti

  const handleSubmit = useCallback(() => {
    if (!content) return setMessage('내용을 입력하세요.')

    const editImage: EditImage = {
      file: images.file,
      imgs: images.imgs.filter((img) => img.id).map((img) => ({ url: img.url, alt: img.alt })),
    }

    const editDecos = Object.keys(decos)
      .filter((key) => swapOnOff[decos[key].active].bool)
      .map((key) => ({ kind: key, extra: decos[key].extra }))

    inti.onSubmit({
      content,
      images: editImage,
      decos: editDecos,
    })

    setContent('')
    setImages({ file: [], imgs: [] })
    setDecos({ ...kindData })
  }, [content, images, decos, inti])

  const handleChange = (value: string) => {
    if (value.length > 191) return
    setContent(value)
  }

  const isEdit = useMemo(() => (inti.id ? true : false), [inti])

  return (
    <>
      <Stack sx={{ bgcolor: '#fff', p: 1, mb: 2 }}>
        <MemoToolItem {...decoProps} />
        <InputText
          id="content"
          multiline
          minRows={3}
          aria-label="메모 작성. 글자수 제한 191자."
          placeholder={placeholder || '기록을 남겨보세요!'}
          value={content}
          fontSize="body1"
          onChange={(e) => handleChange(e.target.value)}
        />
        <ImgPreview {...imageProps} />
        <TextCount text={content} max={191} />
      </Stack>
      <Stack direction="row" alignItems="center">
        <ImgForm {...imageProps} />
        <MemoTool {...decoProps} />
        <Blank />
        {children}
        <Button size="large" variant={isEdit ? 'text' : 'contained'} onClick={handleSubmit}>
          {isEdit ? '수정' : '메모'}
        </Button>
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </>
  )
}
