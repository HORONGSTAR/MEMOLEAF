'use client'
import { MemoForm } from '@/components/memo'
import { createMemo } from '@/lib/fetch/memoApi'
import { OnOffItem, MemoData, MemoParams } from '@/lib/types'
import { checkCurrentOnOff } from '@/lib/utills'
import { useAppSelector } from '@/store/hooks'
import { Box, Chip, List, Paper, useTheme } from '@mui/material'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import MemoThreadBox from './MemoThreadBox'

interface Props {
  id: number
  count?: number
  userId?: number
}

export default function MemoThread({ id, userId }: Props) {
  const theme = useTheme()
  const { profile } = useAppSelector((state) => state.profile)
  const [memos, setMemos] = useState<MemoData[]>([])
  const pageRef = useRef<Element>(null)

  const { data: session } = useSession()
  const isMine = checkCurrentOnOff(userId || 0, session?.user.id || 0)

  useEffect(() => {
    if (memos.length > 0 && pageRef.current) {
      pageRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [memos.length])

  const handleCreateMemo = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      if (!profile) return
      createMemo({ ...params, id: profile.id, parentId: id })
        .then((memo) => setMemos((prev) => [...prev, { ...memo, user: profile }]))
        .catch((err) => console.error(err))
    },
    [profile, id]
  )

  const addForm: OnOffItem = {
    on: (
      <Box ref={pageRef}>
        <Paper variant="outlined" sx={{ bgcolor: theme.palette.secondary.light, p: 1 }}>
          <MemoForm onSubmit={handleCreateMemo} placeholder="글 추가하기" />
        </Paper>
      </Box>
    ),
    off: null,
  }

  return (
    <Box>
      <List disablePadding>
        {memos.map((memo: MemoData) => (
          <MemoThreadBox memo={memo} key={'last-memothread' + memo.id}>
            <Chip size="small" color="success" label={'New'} sx={{ my: 1 }} />
          </MemoThreadBox>
        ))}
      </List>
      {addForm[isMine]}
    </Box>
  )
}
