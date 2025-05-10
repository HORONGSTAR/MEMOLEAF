'use client'
import { ReactNode, useState } from 'react'
import { Collapse, Typography, Chip, Box, Paper, Stack, Divider, Button } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
import InputText from '../common/InputText'
import { Deco } from '@/lib/types'
import { swapOnOff } from '@/lib/utills'

interface Props extends Deco {
  children?: ReactNode
  form?: ReactNode
}

type StringKey = { [key: string]: ReactNode }

export default function MemoDecoItem(props: Props) {
  const { kind, extra, children } = props
  const [password, setPassword] = useState('')
  const [checked, setChecked] = useState('off')
  const [unLock, setUnLock] = useState(false)

  const transform: StringKey = { on: '-180deg', off: '0deg' }
  const chipLabel: StringKey = { on: '접기', off: extra || '더 보기' }

  const handleChange = (value: string) => {
    setPassword(value)
  }

  const component: StringKey = {
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
          onClick={(e) => {
            e.stopPropagation()
            setChecked(swapOnOff[checked].next)
          }}
          label={chipLabel[checked]}
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
        {unLock ? (
          <Box>{children}</Box>
        ) : (
          <Stack alignItems="center" spacing={1}>
            <Typography variant="body2">비공개 글입니다.</Typography>
            <Typography variant="body2">열람 비밀번호가 필요합니다.</Typography>
            <Paper variant="outlined" sx={{ px: 1, maxWidth: 120 }}>
              <InputText fontSize="body2" value={password} onChange={(e) => handleChange(e.target.value)} placeholder="비밀번호 입력" />
            </Paper>
            <Button
              onClick={(e) => {
                e.stopPropagation()
                setUnLock(password === extra ? true : false)
              }}
            >
              확인
            </Button>
          </Stack>
        )}
      </>
    ),
  }

  return <>{component[kind]}</>
}
