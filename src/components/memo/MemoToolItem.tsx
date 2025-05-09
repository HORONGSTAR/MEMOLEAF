'use client'
import { Typography, Chip, IconButton, Divider, ChipProps, Button, Box } from '@mui/material'
import { ExpandMore, DriveFileRenameOutline, Check, LockOutlined } from '@mui/icons-material'
import { InputText, Dialog } from '@/components'
import { Dispatch, ReactNode, SetStateAction, useCallback, useState } from 'react'
import { EditDeco } from '@/lib/types'

interface Props {
  decos: EditDeco
  setDecos: Dispatch<SetStateAction<EditDeco>>
}

type Component = { [key: string]: ReactNode }

export default function MemoToolItem(props: Props) {
  const { decos, setDecos } = props
  const [isEdit, setEdit] = useState(false)
  const [open, setOpen] = useState(false)

  const handleChange = useCallback(
    (value: string, field: string) => {
      setDecos((prev) => ({ ...prev, [field]: { active: 'on', extra: value } }))
    },
    [setDecos]
  )

  const handleSave = useCallback(() => {
    setOpen(false)
  }, [])

  const handleCancel = useCallback(() => {
    setOpen(false)
    setDecos((prev) => ({ ...prev, secret: { active: 'off', extra: '' } }))
  }, [setDecos])

  const dialogProps = {
    open: open,
    actions: (
      <>
        <Button onClick={handleSave}>완료</Button>
        <Button onClick={handleCancel}>취소</Button>
      </>
    ),
    label: '감추기 비밀번호 설정',
  }

  const inputProps = {
    subtext: {
      'aria-label': '덧붙임 내용 입력',
      placeholder: '안내문이나 주의사항을 추가할 수 있어요.',
      fullWidth: true,
    },
    folder: {
      'aria-label': '접힌글 더 보기 버튼 문구 입력',
      placeholder: '예: 더 보기, 펼쳐보기',
    },
    secret: {
      'aria-label': '감추기 해제용 비밀번호 입력',
      placeholder: '비밀번호 입력',
      fontSize: 'body1',
    },
  }

  const folderChipProps: ChipProps = isEdit
    ? {
        variant: 'outlined',
        label: <InputText {...inputProps.folder} value={decos.folder.extra || ''} onChange={(e) => handleChange(e.target.value, 'folder')} />,
      }
    : { variant: 'filled', label: decos.folder.extra || '더 보기' }

  const secretChipProps: ChipProps = decos.secret.extra
    ? { icon: <Check />, label: '비밀번호 설정 완료', color: 'success' }
    : { icon: <LockOutlined />, label: '비밀번호 설정 필요' }

  const secretBox: Component = {
    on: (
      <Box>
        <Chip size="small" onClick={() => setOpen(true)} {...secretChipProps} />
        <Dialog {...dialogProps}>
          <InputText {...inputProps.secret} value={decos.secret.extra || ''} onChange={(e) => handleChange(e.target.value, 'secret')} />
          <Divider />
          <Typography width={300} mt={2} variant="body2">
            간단한 비밀번호로 메모를 잠글 수 있어요. 하지만 완전한 보안은 아니니 개인정보나 중요한 내용은 적지 말아주세요!
          </Typography>
        </Dialog>
      </Box>
    ),
    off: null,
  }

  const subtextBox: Component = {
    on: (
      <Box>
        <InputText {...inputProps.subtext} value={decos.subtext.extra || ''} onChange={(e) => handleChange(e.target.value, 'subtext')} />
        <Divider />
      </Box>
    ),
    off: null,
  }
  const folderBox: Component = {
    on: (
      <Box>
        <Chip color="secondary" size="small" icon={<ExpandMore />} {...folderChipProps} />
        <IconButton onClick={() => setEdit((prev) => !prev)} size="small" aria-label="더 보기 버튼 라벨 수정">
          <DriveFileRenameOutline fontSize="small" />
        </IconButton>
      </Box>
    ),
    off: null,
  }

  return (
    <>
      {secretBox[decos.secret.active]}
      {subtextBox[decos.subtext.active]}
      {folderBox[decos.folder.active]}
    </>
  )
}
