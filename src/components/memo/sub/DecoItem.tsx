'use client'
import { Collapse, Typography, Chip, Box, Stack, Divider, Button, TextField } from '@mui/material'
import { ReactNode, useState } from 'react'
import { ExpandMore } from '@mui/icons-material'
import { swapOnOff } from '@/shared/utils/common'

interface Props {
  kind: string
  extra: string
  children?: ReactNode
  form?: ReactNode
}

export default function DecoItem(props: Props) {
  const { kind, extra, children } = props
  const [password, setPassword] = useState('')
  const [checked, setChecked] = useState('off')
  const [unLock, setUnLock] = useState('off')

  const handleChange = (value: string) => {
    setPassword(value)
  }

  const secretBox = {
    on: children,
    off: (
      <Stack alignItems="center" spacing={1}>
        <Typography variant="body2">비공개 글입니다.</Typography>
        <Typography variant="body2">열람 비밀번호가 필요합니다.</Typography>
        <TextField label="비밀번호 입력" value={password} onChange={(e) => handleChange(e.target.value)} />
        <Button
          onClick={(e) => {
            e.stopPropagation()
            setUnLock(password === extra ? 'on' : 'off')
          }}
        >
          확인
        </Button>
      </Stack>
    ),
  }[unLock]

  const component = {
    subtext: (
      <Box sx={{ mx: 2 }}>
        <Typography variant="body2" color="textSecondary">
          {extra}
        </Typography>
        <Divider sx={{ my: 1 }} />
      </Box>
    ),

    folder: (
      <Box>
        <Chip
          sx={{ mx: 2, my: 1 }}
          onClick={() => setChecked(swapOnOff[checked].next)}
          label={{ on: '내용 접기', off: extra || '내용 열기' }[checked]}
          size="small"
          icon={<ExpandMore sx={{ transform: `rotate(${{ on: '-180deg', off: '0deg' }[checked]})`, transition: 'transform 0.3s ease' }} />}
        />
        <Collapse in={swapOnOff[checked].bool}>{children}</Collapse>
      </Box>
    ),
    secret: secretBox,
  }[kind]

  return <>{component}</>
}
