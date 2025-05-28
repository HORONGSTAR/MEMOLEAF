'use client'
import { ReactNode, useState } from 'react'
import { DecoData } from '@/shared/types/client'
import { Box, Button, Chip, Collapse, Divider, TextField, Typography } from '@mui/material'
import { swapOnOff } from '@/shared/utils/common'
import { ExpandMore } from '@mui/icons-material'

interface Props {
  children: ReactNode
  decos: DecoData
}

export default function DecoBox({ decos, children }: Props) {
  const { subtext, folder, secret } = decos
  const [lock, setLock] = useState(secret.active)
  const [checked, setChecked] = useState('off')
  const [password, setPassword] = useState('')

  const subtextBox = (
    <Box sx={{ mx: 2 }}>
      <Typography variant="body2" color="textSecondary">
        {subtext.extra}
      </Typography>
      <Divider sx={{ my: 1 }} />
    </Box>
  )

  const folderBox = (
    <Box>
      <Chip
        sx={{ mx: 2, my: 1 }}
        onClick={(e) => {
          e.stopPropagation()
          setChecked(swapOnOff[checked].next)
        }}
        label={{ on: '내용 접기', off: folder.extra || '내용 열기' }[checked]}
        size="small"
        icon={<ExpandMore sx={{ transform: `rotate(${{ on: '-180deg', off: '0deg' }[checked]})`, transition: 'transform 0.3s ease' }} />}
      />
      <Collapse in={swapOnOff[checked].bool}>{children}</Collapse>
    </Box>
  )

  const secretBox = (
    <Box p={2} onClick={(e) => e.stopPropagation()}>
      <Typography mb={2} color="textDisabled" variant="body2">
        비공개 글입니다.
        <br />
        열람 비밀번호가 필요합니다.
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField sx={{ width: 140 }} size="small" label="비밀번호 입력" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button
          sx={{ minWidth: 50 }}
          onClick={(e) => {
            e.stopPropagation()
            setLock(password !== secret.extra ? 'on' : 'off')
          }}
        >
          확인
        </Button>
      </Box>
    </Box>
  )

  const decoBox = {
    on: secretBox,
    off: (
      <>
        {{ on: subtextBox, off: null }[subtext.active]}
        {{ on: folderBox, off: children }[folder.active]}
      </>
    ),
  }[lock]

  return <Box whiteSpace="pre-line">{decoBox}</Box>
}
