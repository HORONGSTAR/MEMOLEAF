'use client'
import { ImgPreview, ImgForm, ToolBox, ToolItem } from '@/components/memo/sub'
import { ReactNode, useCallback, useState } from 'react'
import { Button, Snackbar, Stack, Box } from '@mui/material'
import { InputText, TextCount } from '@/components/common'
import { DecoData, ImageData } from '@/shared/types/client'
import { MemoParams } from '@/shared/types/api'
import { swapOnOff } from '@/shared/utils/common'

interface IntiMemoValue {
  action: 'create' | 'update'
  id?: number
  parentId: number | null
  content?: string
  images?: ImageData[]
  decos?: DecoData
  children?: ReactNode
  onSubmint: (params: MemoParams) => void
}

const intiDecoValue = {
  subtext: { active: 'off', extra: '' },
  folder: { active: 'off', extra: '' },
  secret: { active: 'off', extra: Math.random().toString(36).slice(2, 8) },
}

export default function MemoForm(inti: IntiMemoValue) {
  const [content, setContent] = useState(inti.content || '')
  const [files, setFiles] = useState<File[]>([])
  const [imgs, setImgs] = useState(inti?.images || [])
  const [decos, setDecos] = useState<DecoData>({ ...intiDecoValue, ...inti.decos })
  const [message, setMessage] = useState('')

  const { action, id, parentId, children, onSubmint } = inti

  const handleSubmit = useCallback(() => {
    if (!content) return setMessage('내용을 입력하세요.')
    const formData = {
      decos: Object.keys(decos)
        .filter((key) => swapOnOff[decos[key].active].bool)
        .map((key) => ({ kind: key, extra: decos[key].extra })),
      id,
      parentId,
      content,
    }
    onSubmint({ formData, imgs, files })
    setContent('')
    setFiles([])
    setImgs([])
    setDecos(intiDecoValue)
  }, [content, decos, id, parentId, files, imgs, onSubmint])

  const handleContentChange = (value: string) => {
    if (value.length > 191) return
    setContent(value)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Stack sx={{ bgcolor: '#fff', p: 1, mb: 2 }}>
        <ToolItem decos={decos} setDecos={setDecos} />
        <InputText
          id="content"
          multiline
          minRows={3}
          aria-label="메모 작성. 글자수 제한 191자."
          placeholder={'기록을 남겨보세요!'}
          value={content}
          fontSize="body1"
          onChange={(e) => handleContentChange(e.target.value)}
        />
        <ImgPreview imgs={imgs} setImgs={setImgs} setFiles={setFiles} />
        <TextCount text={content} max={191} />
      </Stack>
      <Stack direction="row" alignItems="center">
        <ImgForm imgs={imgs} setImgs={setImgs} setFiles={setFiles} />
        <ToolBox decos={decos} setDecos={setDecos} />
        <Box flexGrow={1} />
        {children}
        {
          {
            create: (
              <Button size="large" variant="contained" onClick={handleSubmit}>
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
