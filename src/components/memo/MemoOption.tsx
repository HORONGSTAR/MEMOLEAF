'use client'
import { Typography, Checkbox, FormControlLabel, Stack, Chip, IconButton, Divider, ChipProps, Button } from '@mui/material'
import { ExpandMore, DriveFileRenameOutline, LockOutline, Check } from '@mui/icons-material'
import { InputText, Dialog } from '@/components'
import { useCallback, useState } from 'react'

type Checked = { [key: string]: boolean }

export default function MemoOption() {
  const [isEdit, setEdit] = useState(false)
  const [open, setOpen] = useState(false)
  const [subtext, setSubtext] = useState('')
  const [folder, setFolder] = useState('')
  const [secret, setSecret] = useState('')
  const [checked, setChecked] = useState<Checked>({ subtext: false, folder: false, secret: false })

  const handleChange = useCallback((value: boolean, field: string) => {
    setChecked((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleSave = useCallback(() => {
    setOpen(false)
  }, [])

  const handleCancel = useCallback(() => {
    setOpen(false)
    setSecret('')
    handleChange(false, 'secret')
  }, [handleChange])

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

  const formItems = [
    { field: 'subtext', label: '덧붙임' },
    { field: 'folder', label: '접힌 글' },
    { field: 'secret', label: '감추기' },
  ]

  const inputProps = {
    subtext: {
      'aria-label': '덧붙임 내용 입력',
      placeholder: '안내문이나 주의사항을 추가할 수 있어요.',
      value: subtext,
      fullWidth: true,
      max: 30,
      setValue: setSubtext,
    },
    folder: {
      'aria-label': '접힌글 더 보기 버튼 문구 입력',
      placeholder: '예: 더 보기, 펼쳐보기',
      value: folder,
      max: 20,
      setValue: setFolder,
    },
    secret: {
      'aria-label': '감추기 해제용 비밀번호 입력',
      placeholder: '비밀번호 입력',
      value: secret,
      max: 12,
      type: 'password',
      fontSize: 'body1',
      setValue: setSecret,
    },
  }

  const folderChipProps: ChipProps = isEdit
    ? { variant: 'outlined', label: <InputText {...inputProps.folder} /> }
    : { variant: 'filled', label: folder || '더 보기' }

  const secretChipProps: ChipProps = secret
    ? { icon: <Check />, label: '비밀번호 설정 완료', color: 'success' }
    : { icon: <LockOutline />, label: '비밀번호 설정 필요' }

  return (
    <Stack spacing={1}>
      <Stack direction="row" flexWrap="wrap" alignItems="center">
        {formItems.map((item) => (
          <FormControlLabel
            key={item.field}
            control={<Checkbox onChange={(e) => handleChange(e.target.checked, item.field)} checked={checked[item.field]} size="small" />}
            label={<Typography variant="body2">{item.label}</Typography>}
          />
        ))}
        {checked.secret && <Chip size="small" onClick={() => setOpen(true)} {...secretChipProps} />}
        <Dialog {...dialogProps}>
          <InputText {...inputProps.secret} />
          <Divider />
          <Typography width={300} mt={2} variant="body2">
            간단한 비밀번호로 메모를 잠글 수 있어요. 하지만 완전한 보안은 아니니 개인정보나 중요한 내용은 적지 말아주세요!
          </Typography>
        </Dialog>
      </Stack>
      {checked.subtext && (
        <div>
          <InputText {...inputProps.subtext} />
          <Divider />
        </div>
      )}
      {checked.folder && (
        <Stack direction="row" alignItems="center">
          <Chip color="secondary" size="small" icon={<ExpandMore />} {...folderChipProps} />
          <IconButton onClick={() => setEdit((prev) => !prev)} size="small" aria-label="더 보기 버튼 라벨 수정">
            <DriveFileRenameOutline fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Stack>
  )
}
