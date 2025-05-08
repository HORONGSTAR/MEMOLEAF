'use client'
import { ReactNode, useMemo, useState } from 'react'
import { Collapse, Typography, Chip, Box, Paper, Stack, Divider } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import InputText from '../common/InputText'
import { Style } from '@/lib/types'
import { swapOnOff } from '@/lib/utills'

interface Props extends Style {
  children?: ReactNode
  form?: ReactNode
}

type Component = { [key: string]: ReactNode }

export default function MemoOption(props: Props) {
  const { option, extra, children } = props
  const [password, setPassword] = useState('')
  const [checked, setChecked] = useState('off')

  const isUnLock = useMemo(() => (extra !== password ? false : true), [extra, password])
  const transform: { [key: string]: string } = { on: '180deg', off: '0deg' }

  const handleChange = (value: string) => {
    setPassword(value)
  }

  const component: Component = {
    subtext: (
      <Box>
        <Typography variant="body2" color="textSecondary">
          {extra}
        </Typography>
        <Divider sx={{ my: 2 }} />
      </Box>
    ),
    folder: (
      <Box>
        <Chip
          onClick={() => setChecked(swapOnOff[checked].next)}
          label={checked ? '접기' : extra || '더 보기'}
          size="small"
          icon={
            <ExpandMore
              sx={{
                transform: `rotate(${transform[checked]})`,
                transition: 'transform 0.3s ease',
              }}
            />
          }
        />
        <Collapse in={swapOnOff[checked].bool}>{children}</Collapse>
      </Box>
    ),
    secret: (
      <>
        {isUnLock ? (
          <Box>{children}</Box>
        ) : (
          <Stack alignItems="center" spacing={1}>
            <Typography variant="body2">비공개 글입니다.</Typography>
            <Typography variant="body2">열람 비밀번호가 필요합니다.</Typography>
            <Paper variant="outlined" sx={{ px: 1, maxWidth: 120 }}>
              <InputText fontSize="body2" value={password} onChange={(e) => handleChange(e.target.value)} placeholder="비밀번호 입력" />
            </Paper>
          </Stack>
        )}
      </>
    ),
  }

  return <>{component[option]}</>
}
