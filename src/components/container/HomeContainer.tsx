'use client'
import { MemoForm } from '@/components/memo'
import { createMemo } from '@/shared/fetch/memosApi'
import { Paper, Snackbar, useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { MemoParams } from '@/shared/types/api'
import { MemoData } from '@/shared/types/client'
import MemoConnector from './sub/MemoConnector'

interface Props {
  firstLoadMemos: MemoData[]
  myId: number
}

export default function HomeContainer({ firstLoadMemos }: Props) {
  const { profile } = useAppSelector((state) => state.profile)
  const [memos, setMemos] = useState<MemoData[]>(firstLoadMemos || [])
  const [message, setMessage] = useState('')
  const theme = useTheme()

  const handleCreateMemo = useCallback(
    (params: MemoParams) => {
      if (!profile) return
      createMemo(params)
        .then((result) => {
          setMemos((prev) => {
            return [{ ...result, user: profile, bookmarks: [] }, ...prev]
          })
          setMessage('메모를 게시했습니다.')
        })
        .catch(() => setMessage('메모 작성 중 문제가 발생했습니다.'))
    },
    [profile]
  )

  return (
    <>
      <MemoConnector {...{ memos, setMemos, query: { aria: 'home' } }}>
        <Paper variant="outlined" sx={{ bgcolor: theme.palette.secondary.light, p: 1, mb: 2 }}>
          <MemoForm action="create" parentId={null} onSubmint={handleCreateMemo} />
        </Paper>
      </MemoConnector>
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
