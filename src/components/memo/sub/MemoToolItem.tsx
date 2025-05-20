'use client'
import { Dialog, InputText } from '@/components'
import { Dispatch, SetStateAction, useState, useCallback } from 'react'
import { EditDeco, OnOffItem } from '@/lib/types'
import { Box, Chip, ChipProps, IconButton, Button, Divider, Stack, Typography } from '@mui/material'
import { ExpandMore, DriveFileRenameOutline, Key } from '@mui/icons-material'
import { swapOnOff } from '@/lib/utills'

interface Props {
  decos: EditDeco
  setDecos: Dispatch<SetStateAction<EditDeco>>
}

export default function MemoToolItem(props: Props) {
  const { decos, setDecos } = props
  const [edit, setEdit] = useState('off')
  const [open, setOpen] = useState('off')

  const handleChangeSubtext = useCallback(
    (value: string) => {
      if (value.length > 30) return
      setDecos((prev) => ({ ...prev, subtext: { active: 'on', extra: value } }))
    },
    [setDecos]
  )

  const handleChangeFolder = useCallback(
    (value: string) => {
      if (value.length > 16) return
      setDecos((prev) => ({ ...prev, folder: { active: 'on', extra: value } }))
    },
    [setDecos]
  )

  const handleChangeSecret = useCallback(
    (value: string) => {
      if (value.length > 12) return
      setDecos((prev) => ({ ...prev, secret: { active: 'on', extra: value } }))
    },
    [setDecos]
  )

  const handleClose = useCallback(() => {
    setOpen('off')
    if (!decos.secret.extra) {
      setDecos((prev) => ({ ...prev, secret: { active: 'on', extra: Math.random().toString(36).slice(2, 8) } }))
    }
  }, [setDecos, decos])

  const chipProps: { [key: string]: ChipProps } = {
    on: {
      variant: 'outlined',
      label: (
        <InputText
          id="folder"
          value={decos.folder.extra}
          onChange={(e) => handleChangeFolder(e.target.value)}
          autoFocus
          aria-label="접힌 글 버튼 문구 입력"
          placeholder="예) 내용 열기, 펼치기"
        />
      ),
    },
    off: { variant: 'filled', label: decos.folder.extra || '내용 열기' },
  }

  const subtextBox: OnOffItem = {
    on: (
      <Box>
        <InputText
          id="subtext"
          value={decos.subtext.extra}
          onChange={(e) => handleChangeSubtext(e.target.value)}
          slotProps={{ input: { 'aria-label': '덧붙임 내용 입력' } }}
          placeholder="부연 설명을 덧붙일 수 있어요."
          autoFocus
        />
        <Divider />
      </Box>
    ),
    off: null,
  }

  const folderBox: OnOffItem = {
    on: (
      <Box>
        <Chip {...chipProps[edit]} icon={<ExpandMore />} size="small" />
        <IconButton aria-label="접힌글 열기 버튼 문구 편집" autoFocus size="small" onClick={() => setEdit(swapOnOff[edit].next)}>
          <DriveFileRenameOutline fontSize="small" />
        </IconButton>
      </Box>
    ),
    off: null,
  }

  const dialogProps = {
    open: swapOnOff[open].bool,
    title: '비밀번호 변경하기',
    closeLabel: '저장',
    onClose: handleClose,
  }

  const secretBox: OnOffItem = {
    on: (
      <Box>
        <Button autoFocus startIcon={<Key />} size="small" onClick={() => setOpen('on')}>
          감추기 비밀번호 설정
        </Button>
        <Dialog {...dialogProps}>
          <InputText
            id="secret"
            autoFocus
            value={decos.secret.extra}
            onChange={(e) => handleChangeSecret(e.target.value)}
            aria-label="감추기 해제용 비밀번호 입력"
            placeholder="입력 없으면 자동 생성됩니다."
            aria-describedby="secret-info"
          />
          <Divider />
          <Typography id="secret-info" maxWidth={300} mt={2} variant="body2">
            간단한 비밀번호로 메모를 잠글 수 있어요. 하지만 완전한 보안은 아니니 개인정보나 중요한 내용은 적지 말아주세요!
          </Typography>
        </Dialog>
      </Box>
    ),
    off: null,
  }

  return (
    <Stack spacing={1}>
      {secretBox[decos.secret.active]}
      {subtextBox[decos.subtext.active]}
      {folderBox[decos.folder.active]}
    </Stack>
  )
}
