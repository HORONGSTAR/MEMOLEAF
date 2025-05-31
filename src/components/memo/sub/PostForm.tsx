'use client'
import { ImgPreview, ImgForm, ToolBox, ToolItem } from '@/components/memo/sub'
import { ReactNode, useCallback, useState } from 'react'
import { Button, Snackbar, Stack, Box, InputBase } from '@mui/material'
import { DecoData, ImageData, UploadData } from '@/shared/types/client'
import { MemoParams } from '@/shared/types/api'
import { swapOnOff } from '@/shared/utils/common'
import TextCount from '@/components/common/TextCount'

interface IntiMemoValue {
  action: 'create' | 'update'
  id?: number
  titleId: number | null
  content?: string
  images?: ImageData[]
  decos?: DecoData
  children?: ReactNode
  onSubmint: (params: MemoParams, uploads: UploadData[]) => void
}

const intiDecoValue = {
  subtext: { active: 'off', extra: '' },
  folder: { active: 'off', extra: '' },
  secret: { active: 'off', extra: Math.random().toString(36).slice(2, 8) },
}

export default function MemoForm(inti: IntiMemoValue) {
  const [content, setContent] = useState(inti.content || '')
  const [images, setImages] = useState<UploadData[]>(inti?.images || [])
  const [decos, setDecos] = useState<DecoData>({ ...intiDecoValue, ...inti.decos })
  const [message, setMessage] = useState('')

  const { action, id, titleId, children, onSubmint } = inti

  const handleSubmit = useCallback(() => {
    if (!content) return setMessage('내용을 입력하세요.')
    const formData = {
      decos: Object.keys(decos)
        .filter((key) => swapOnOff[decos[key].active].bool)
        .map((key) => ({ kind: key, extra: decos[key].extra })),
      id,
      titleId,
      content,
    }
    onSubmint(formData, images)
    setContent('')
    setImages([])
    setDecos(intiDecoValue)
  }, [content, decos, id, titleId, images, onSubmint])

  const handleContentChange = (value: string) => {
    if (value.length > 191) return
    setContent(value)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Stack sx={{ bgcolor: '#fff', p: 1, mb: 1 }}>
        <ToolItem decos={decos} setDecos={setDecos} />
        <InputBase
          id="content"
          multiline
          minRows={2}
          aria-label="메모 작성. 글자수 제한 191자."
          placeholder={'기록을 남겨보세요!'}
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
        />
        <ImgPreview images={images} setImages={setImages} />
        <TextCount text={content} max={191} />
      </Stack>
      <Stack direction="row" alignItems="center">
        <ImgForm images={images} setImages={setImages} />
        <ToolBox decos={decos} setDecos={setDecos} />
        <Box flexGrow={1} />
        {children}
        {
          {
            create: (
              <Button variant="contained" onClick={handleSubmit}>
                메모
              </Button>
            ),
            update: <Button onClick={handleSubmit}>수정</Button>,
          }[action]
        }
      </Stack>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </div>
  )
}
