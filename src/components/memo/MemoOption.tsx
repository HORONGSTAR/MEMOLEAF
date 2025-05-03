'use client'
import { Typography, Checkbox, FormControlLabel, Stack, Divider, Chip, IconButton } from '@mui/material'
import { ExpandMore, DriveFileRenameOutline } from '@mui/icons-material'
import { InputText } from '@/components'
import { useCallback, useState } from 'react'

export default function MemoOption() {
  const [open, setOpen] = useState(false)
  const [info, setInfo] = useState('')
  const [folder, setFolder] = useState('')
  const [secret, setSecret] = useState('')
  const [checked, setChecked] = useState({ info: false, folder: false, secret: false, font: false, color: false })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, label: string) => {
    setChecked((prev) => ({ ...prev, [label]: e.target.checked }))
  }, [])

  return (
    <Stack spacing={1} mb={2}>
      <div>
        <FormControlLabel
          control={<Checkbox onChange={(e) => handleChange(e, 'info')} checked={checked.info} size="small" />}
          label={<Typography variant="body2">설명 추가</Typography>}
        />
        <FormControlLabel
          control={<Checkbox onChange={(e) => handleChange(e, 'folder')} checked={checked.folder} size="small" />}
          label={<Typography variant="body2">글 접기</Typography>}
        />
        <FormControlLabel
          control={<Checkbox onChange={(e) => handleChange(e, 'secret')} checked={checked.secret} size="small" />}
          label={<Typography variant="body2">비밀글</Typography>}
        />
        {checked.secret && (
          <InputText
            placeholder="비밀번호 (최대 12자)"
            type="password"
            value={secret}
            fontSize="body2"
            max={12}
            setValue={setSecret}
          />
        )}
      </div>
      {checked.info && (
        <div>
          <Stack direction="row" alignItems="center">
            <InputText
              placeholder="내용 상단에 설명 추가하기 (최대 30자)"
              fullWidth
              value={info}
              fontSize="body2"
              max={30}
              setValue={setInfo}
            />
          </Stack>
          <Divider />
        </div>
      )}
      {checked.folder && (
        <Stack direction="row" alignItems="center">
          <Chip
            size="small"
            sx={{ px: 0.5, my: 1 }}
            variant={open ? 'outlined' : 'filled'}
            icon={<ExpandMore />}
            label={
              open ? (
                <>
                  <InputText
                    placeholder="문구 변경하기 (최대 12자)"
                    value={folder}
                    fontSize="body2"
                    max={12}
                    setValue={setFolder}
                  />
                </>
              ) : (
                folder || '더 보기'
              )
            }
          />
          <IconButton onClick={() => setOpen((prev) => !prev)} size="small">
            <DriveFileRenameOutline fontSize="small" />
          </IconButton>
        </Stack>
      )}
    </Stack>
  )
}
