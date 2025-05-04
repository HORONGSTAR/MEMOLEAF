'use client'
import { ReactNode, useState } from 'react'
import { Collapse, Typography, Chip, Box, Paper, Stack } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import InputText from '../common/InputText'
import { Options } from '@/lib/types'

interface Props {
  children: ReactNode
  options: Options
}

export default function MemoStyle(props: Props) {
  const [password, setPassword] = useState('')
  const [checked, setChecked] = useState(false)
  const { options, children } = props

  const info = (
    <Typography variant="body2" color="textSecondary">
      {options.info.extra}
    </Typography>
  )

  const secret = (
    <Stack alignItems="center" spacing={1}>
      <Typography variant="body2">비공개 글입니다.</Typography>
      <Typography variant="body2">열람 비밀번호가 필요합니다.</Typography>
      <Paper variant="outlined" sx={{ px: 1, maxWidth: 120 }}>
        <InputText fontSize="body2" value={password} setValue={setPassword} max={12} placeholder="비밀번호 입력" />
      </Paper>
    </Stack>
  )

  const folder = (
    <Box>
      <Chip
        onClick={() => setChecked((prev) => !prev)}
        label={checked ? '접기' : options.folder.extra}
        size="small"
        icon={<ExpandMore />}
      />
      <Collapse in={checked}>{children}</Collapse>
    </Box>
  )

  const components = {
    info: { on: info, off: null },
    secret: { on: secret, off: null },
    folder: { on: folder, off: children },
  }

  return (
    <>
      {components.info[options.info.activate]}
      {components.secret[options.secret.activate]}
      {components.folder[options.folder.activate]}
    </>
  )
}
