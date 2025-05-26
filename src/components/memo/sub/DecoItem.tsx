'use client'
import { Collapse, Typography, Chip, Box, Paper, Stack, Divider, Button } from '@mui/material'
import { ReactNode, useState } from 'react'
import { ExpandMore } from '@mui/icons-material'
import { InputText } from '@/components/common'
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

  const transform = { on: '-180deg', off: '0deg' }[checked]
  const chipLabel = { on: '내용 접기', off: extra || '내용 열기' }[checked]

  const handleChange = (value: string) => {
    setPassword(value)
  }

  const secretBox = {
    on: <Box>{children}</Box>,
    off: (
      <Stack alignItems="center" spacing={1}>
        <Typography variant="body2">비공개 글입니다.</Typography>
        <Typography variant="body2">열람 비밀번호가 필요합니다.</Typography>
        <Paper variant="outlined" sx={{ px: 1, maxWidth: 120 }}>
          <InputText fontSize="body2" value={password} onChange={(e) => handleChange(e.target.value)} placeholder="비밀번호 입력" />
        </Paper>
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
          label={chipLabel}
          size="small"
          icon={<ExpandMore sx={{ transform: `rotate(${transform})`, transition: 'transform 0.3s ease' }} />}
        />
        <Collapse in={swapOnOff[checked].bool}>{children}</Collapse>
      </Box>
    ),
    secret: secretBox,
  }[kind]

  return <>{component}</>
}
