'use client'
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, timelineItemClasses } from '@mui/lab'
import { Paper, MemoForm, MemoBox, AsyncBox } from '@/components'
import { createMemo, getMemos } from '@/lib/fetch/memoApi'
import { OnOffItem, MemoData, MemoParams, Status } from '@/lib/types'
import { checkCurrentOnOff, swapOnOff } from '@/lib/utills'
import { useAppSelector } from '@/store/hooks'
import { Box, Button, Chip, Collapse } from '@mui/material'
import { grey } from '@mui/material/colors'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  id: number
  count?: number
  userId?: number
}

export default function MemoThread({ id, count, userId }: Props) {
  const { profile } = useAppSelector((state) => state.profile)
  const [memos, setMemos] = useState<MemoData[]>([])
  const [newMemos, setNewMemos] = useState<MemoData[]>([])
  const [status, setStatus] = useState<Status>('idle')

  const [open, setOpen] = useState('off')
  const [total, setTotal] = useState(count || 0)
  const [cursor, setCursor] = useState(0)
  const pageRef = useRef<Element>(null)
  const limit = 10

  const { data: session } = useSession()
  const isMine = checkCurrentOnOff(userId || 0, session?.user.id || 0)
  const isLast = checkCurrentOnOff(total, memos.length)

  useEffect(() => {
    if (memos.length > 0 && pageRef.current) {
      pageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [memos.length])

  const handleGetMemos = useCallback(() => {
    setStatus('loading')
    const params = {
      category: { thread: id },
      pagination: { ...(cursor && { cursor }), limit },
    }
    getMemos(params)
      .then((result) => {
        setMemos((prev) => [...prev, ...result.memos])
        setTotal(result.searchTotal)
        setStatus('succeeded')
        setCursor(result.nextCursor)
      })
      .catch(() => setStatus('failed'))
  }, [cursor, id])

  const handleCreateMemo = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      if (!profile) return
      createMemo({ ...params, id: profile.id, parentId: id })
        .then((memo) => setNewMemos((prev) => [...prev, { ...memo, user: profile }]))
        .catch((err) => console.error(err))
    },
    [profile, id]
  )

  const handleOpen = useCallback(() => {
    if (cursor === 0) handleGetMemos()
    setOpen((prev) => swapOnOff[prev].next)
  }, [cursor, handleGetMemos])

  const pageButton: OnOffItem = {
    on: null,
    off: (
      <Button fullWidth sx={{ my: 1 }} onClick={handleGetMemos}>
        더 보기
      </Button>
    ),
  }

  const addForm: OnOffItem = {
    on: (
      <Box ref={pageRef}>
        <Paper use="create" noBorder>
          <MemoForm onSubmit={handleCreateMemo} placeholder="글 추가하기" />
        </Paper>
      </Box>
    ),
    off: null,
  }

  const layout = 'list'

  const threadTotalDigit = useMemo(() => total.toString().length, [total])
  console.log(threadTotalDigit)

  return (
    <Box>
      {total ? (
        <Button fullWidth sx={{ color: grey[600], bgcolor: grey[100] }} onClick={handleOpen}>
          {{ off: `${total}개의 스레드 보기`, on: '스레드 접기' }[open]}
        </Button>
      ) : null}
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 1,
          },
        }}
      >
        <AsyncBox state={status}>
          <Collapse in={swapOnOff[open].bool}>
            {memos.map((memo: MemoData, index) => (
              <TimelineItem key={'first-memothread' + memo.id}>
                <TimelineSeparator>
                  <Chip size="small" label={(index + 1).toString().padStart(threadTotalDigit, '0')} sx={{ my: 1 }} />
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <MemoBox layout={layout} memo={memo} />
                </TimelineContent>
              </TimelineItem>
            ))}
            {pageButton[isLast]}
          </Collapse>
        </AsyncBox>
        {newMemos.map((memo: MemoData) => (
          <MemoBox layout={layout} key={'last-memothread' + memo.id} memo={memo} />
        ))}
      </Timeline>
      {addForm[isMine]}
    </Box>
  )
}
