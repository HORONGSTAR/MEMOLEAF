'use client'
import { MemoBox, MemoForm, MemoList } from '@/components/memo'
import { updateMemo } from '@/shared/fetch/memosApi'
import { Button, Paper, Skeleton, Snackbar } from '@mui/material'
import { Dispatch, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { MemoParams, MemosAria } from '@/shared/types/api'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { MemoData } from '@/shared/types/client'
import DetailContainer from '@/components/container/DetailContainer'
import { useSession } from 'next-auth/react'

interface Props {
  memos: MemoData[]
  query: {
    aria: MemosAria
    id?: number
    keyword?: string
    filter?: string
  }
  children?: ReactNode
  setMemos: Dispatch<SetStateAction<MemoData[]>>
}

export default function MemoConnector(props: Props) {
  const { memos, children, query, setMemos } = props
  const { profile } = useAppSelector((state) => state.profile)
  const [detailItem, setDetailItem] = useState<MemoData | undefined>(undefined)
  const [editId, setEdit] = useState(0)
  const [message, setMessage] = useState('')
  const { data: session } = useSession()
  const myId = session?.user.id

  const addMemoList = useCallback(
    (values: MemoData[]) => {
      setMemos((prev) => [...prev, ...values])
    },
    [setMemos]
  )

  const handleUpdateMemo = useCallback(
    (params: MemoParams) => {
      if (!profile) return
      setEdit(0)
      updateMemo(params)
        .then((result) => {
          setMemos((prev) =>
            prev.map((p) => {
              return p.id !== editId ? p : { ...p, ...result }
            })
          )
          setMessage('메모를 수정했습니다.')
        })
        .catch(() => setMessage('메모 수정 중 문제가 발생했습니다.'))
    },
    [editId, profile, setMemos]
  )

  const MemoListItem = (memo: MemoData) => {
    const item = (
      <MemoBox
        myId={myId || 0}
        memo={memo}
        removeItem={() => setMemos((prev) => prev.filter((p) => p.id !== memo.id))}
        editItem={() => setEdit(memo.id)}
      />
    )
    const editform = (
      <MemoForm action="update" {...memo} onSubmint={handleUpdateMemo}>
        <Button
          color="error"
          onClick={(e) => {
            setEdit(0)
            e.stopPropagation()
          }}
        >
          취소
        </Button>
      </MemoForm>
    )
    return { [memo.id]: item, [editId]: editform }[memo.id]
  }

  const handleClick = (memo: MemoData) => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      return
    }
    setDetailItem(memo)
  }

  const loadingBox = [1, 2, 3].map((el) => <Skeleton variant="rounded" sx={{ mb: 2 }} height={120} key={'loading' + el} />)
  const nextCursor = useMemo(() => memos[9]?.id || undefined, [memos])

  return (
    <>
      {detailItem ? (
        <DetailContainer myId={myId} firstLoadParent={detailItem}>
          <Button startIcon={<ArrowBack />} onClick={() => setDetailItem(undefined)}>
            목록으로 돌아가기
          </Button>
        </DetailContainer>
      ) : (
        <>
          {children}
          <MemoList {...{ nextCursor, loadingBox, addMemoList, query }}>
            {memos.map((memo: MemoData) => (
              <Paper sx={{ p: { sm: 1, xs: 0 } }} key={'memo' + memo.id} variant="outlined" onClick={() => handleClick(memo)}>
                <MemoListItem {...memo} />
              </Paper>
            ))}
          </MemoList>
        </>
      )}
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
