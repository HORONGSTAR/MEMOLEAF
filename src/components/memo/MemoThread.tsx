'use client'
import { getMemos } from '@/lib/fetch/memoApi'
import { MemoData } from '@/lib/types'
import { checkCurrentOnOff, swapOnOff } from '@/lib/utills'
import { Box, Button, Chip, Collapse, List, Skeleton, Stack } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useCallback, useMemo, useState } from 'react'
import MemoThreadBox from './MemoThreadBox'

interface Props {
  id: number
  count: number
}

export default function MemoThread({ id, count }: Props) {
  const [memos, setMemos] = useState<MemoData[]>([])
  const [loading, setLoading] = useState('off')
  const [open, setOpen] = useState('off')
  const [cursor, setCursor] = useState(0)
  const limit = 2
  const isLast = checkCurrentOnOff(count, memos.length)

  const handleGetMemos = useCallback(() => {
    setLoading('on')
    const params = {
      category: { thread: id },
      pagination: { ...(cursor && { cursor }), limit },
    }
    getMemos(params)
      .then((result) => {
        setMemos((prev) => [...prev, ...result.memos])
        setCursor(result.nextCursor)
      })
      .catch()
      .finally(() => setLoading('off'))
  }, [cursor, id])

  const handleOpen = useCallback(() => {
    if (cursor === 0) handleGetMemos()
    setOpen((prev) => swapOnOff[prev].next)
  }, [cursor, handleGetMemos])

  const pageButton = {
    on: null,
    off: (
      <Button fullWidth sx={{ my: 1 }} onClick={handleGetMemos}>
        더 보기
      </Button>
    ),
  }[isLast]

  const OpemButton = {
    [count]: (
      <Button fullWidth sx={{ color: grey[600], bgcolor: grey[100] }} onClick={handleOpen}>
        {{ off: `${count}개의 스레드 보기`, on: '스레드 접기' }[open]}
      </Button>
    ),
    0: null,
  }[count]

  const threadTotalDigit = useMemo(() => count.toString().length, [count])

  const components = {
    off: (
      <List disablePadding>
        <Collapse in={swapOnOff[open].bool}>
          {memos.map((memo: MemoData, index) => (
            <MemoThreadBox memo={memo} key={'first-memothread' + memo.id}>
              <Chip size="small" label={(index + 1).toString().padStart(threadTotalDigit, '0')} />
            </MemoThreadBox>
          ))}
          {pageButton}
        </Collapse>
      </List>
    ),
    on: (
      <Stack py={2} spacing={1}>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Stack>
    ),
  }[loading]

  return (
    <Box>
      {OpemButton}
      {components}
    </Box>
  )
}
