'use client'
import { MemoBox, MemoForm, MemoList } from '@/components/memo'
import { createMemo, updateMemo } from '@/shared/fetch/memosApi'
import { Button, Container, Paper, Skeleton, useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { MemoParams } from '@/shared/types/api'
import ArrowBack from '@mui/icons-material/ArrowBack'
import { MemoData } from '@/shared/types/client'
import DetailContainer from '@/components/container/DetailContainer'

interface Props {
  nextCursor: number
  firstLoadMemos: MemoData[]
  myId?: number
}

export default function HomeContainer({ nextCursor, firstLoadMemos, myId }: Props) {
  const { profile } = useAppSelector((state) => state.profile)
  const [memos, setMemos] = useState<MemoData[]>(firstLoadMemos || [])
  const [detailItem, setDetailItem] = useState<MemoData | undefined>(undefined)
  const [editId, setEdit] = useState(0)
  const theme = useTheme()

  const addMemoList = useCallback((values: MemoData[]) => {
    setMemos((prev) => [...prev, ...values])
  }, [])

  const handleCreateMemo = useCallback(
    (params: MemoParams) => {
      if (!profile) return
      createMemo(params)
        .then((result) =>
          setMemos((prev) => {
            return [{ ...result, user: profile, bookmarks: [] }, ...prev]
          })
        )
        .catch()
        .finally()
    },
    [profile]
  )

  const handleUpdateMemo = useCallback(
    (params: MemoParams) => {
      if (!profile) return
      setEdit(0)
      updateMemo(params)
        .then((result) =>
          setMemos((prev) =>
            prev.map((p) => {
              return p.id !== editId ? p : { ...p, ...result }
            })
          )
        )
        .catch()
    },
    [editId, profile]
  )

  const MemoListItem = (memo: MemoData) => {
    const item = (
      <MemoBox
        memo={memo}
        myId={myId}
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

  const loadingBox = [1, 2, 3].map((el) => <Skeleton variant="rounded" height={120} key={'loading' + el} />)

  return (
    <>
      {detailItem ? (
        <DetailContainer myId={myId} firstLoadParent={detailItem}>
          <Button startIcon={<ArrowBack />} onClick={() => setDetailItem(undefined)}>
            목록으로 돌아가기
          </Button>
        </DetailContainer>
      ) : (
        <Container sx={{ mb: 4, minHeight: '100vh' }}>
          <Paper variant="outlined" sx={{ bgcolor: theme.palette.secondary.light, p: 1, mb: 2 }}>
            <MemoForm action="create" parentId={null} onSubmint={handleCreateMemo} />
          </Paper>
          <MemoList loadingBox={loadingBox} aria="home" addMemoList={addMemoList} nextCursor={nextCursor}>
            {memos.map((memo: MemoData) => (
              <Paper variant="outlined" key={'home-memo' + memo.id} onClick={() => handleClick(memo)}>
                <MemoListItem {...memo} />
              </Paper>
            ))}
          </MemoList>
        </Container>
      )}
    </>
  )
}
