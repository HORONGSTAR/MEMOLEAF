'use client'
import { Typography, Chip, IconButton, Divider, ChipProps, Button, Box } from '@mui/material'
import { ExpandMore, DriveFileRenameOutline, Check, LockOutlined } from '@mui/icons-material'
import { InputText, Dialog } from '@/components'
import { Dispatch, ReactNode, SetStateAction, useCallback, useState } from 'react'
import { Option } from '@/lib/types'

interface Props {
  option: Option
  setOption: Dispatch<SetStateAction<Option>>
}

type Component = { [key: string]: ReactNode }

export default function ToolBoxItem(props: Props) {
  const { option, setOption } = props
  const [isEdit, setEdit] = useState(false)
  const [open, setOpen] = useState(false)

  const handleChange = useCallback(
    (value: string, field: string) => {
      setOption((prev) => ({ ...prev, [field]: { activate: 'on', extra: value } }))
    },
    [setOption]
  )

  const handleSave = useCallback(() => {
    setOpen(false)
  }, [])

  const handleCancel = useCallback(() => {
    setOpen(false)
    setOption((prev) => ({ ...prev, secret: { activate: 'off', extra: '' } }))
  }, [setOption])

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
        label: <InputText {...inputProps.folder} value={option.folder.extra || ''} onChange={(e) => handleChange(e.target.value, 'folder')} />,
      }
    : { variant: 'filled', label: option.folder.extra || '더 보기' }

  const secretChipProps: ChipProps = option.secret.extra
    ? { icon: <Check />, label: '비밀번호 설정 완료', color: 'success' }
    : { icon: <LockOutlined />, label: '비밀번호 설정 필요' }

  const secretBox: Component = {
    on: (
      <Box>
        <Chip size="small" onClick={() => setOpen(true)} {...secretChipProps} />
        <Dialog {...dialogProps}>
          <InputText {...inputProps.secret} value={option.secret.extra || ''} onChange={(e) => handleChange(e.target.value, 'secret')} />
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
        <InputText {...inputProps.subtext} value={option.subtext.extra || ''} onChange={(e) => handleChange(e.target.value, 'subtext')} />
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
      {secretBox[option.secret.activate]}
      {subtextBox[option.subtext.activate]}
      {folderBox[option.folder.activate]}
    </>
  )
}
