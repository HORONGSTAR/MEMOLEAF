'use client'
import { Box, Button, Divider, Paper, Skeleton, Stack, Tab, Tabs } from '@mui/material'
import { useCallback, useState } from 'react'
import { BasicBox, MemoList } from '@/components/memo'
import { MemoData, UserData } from '@/shared/types/client'
import { ArrowBack } from '@mui/icons-material'
import DetailContainer from './DetailContainer'
import { UserList } from '@/components/user'

interface Props {
  lastMemoId?: number
  id?: number
  name?: string
}

export default function MyContainer({ id, name, lastMemoId }: Props) {
  const [memos, setMemos] = useState<MemoData[]>([])
  const [users, setUsers] = useState<UserData[]>([])
  const [value, setValue] = useState(0)
  const [detailItem, setDetailItem] = useState<MemoData | undefined>(undefined)

  const addMemoList = useCallback((values: MemoData[]) => {
    setMemos((prev) => [...prev, ...values])
  }, [])

  const addUserList = useCallback((values: UserData[]) => {
    setUsers((prev) => [...prev, ...values])
  }, [])

  const handleClick = (memo: MemoData) => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
      return
    }
    setDetailItem(memo)
  }

  const loadingBox = [1, 2, 3].map((el) => <Skeleton variant="rounded" height={120} key={'loading' + el} />)

  const labels = ['게시글', '팔로우', '북마크']

  const mypost = detailItem ? (
    <DetailContainer myId={id} firstLoadParent={detailItem}>
      <Button startIcon={<ArrowBack />} onClick={() => setDetailItem(undefined)}>
        목록으로 돌아가기
      </Button>
    </DetailContainer>
  ) : (
    <>
      <MemoList loadingBox={loadingBox} aria="mypost" id={id} addMemoList={addMemoList} nextCursor={lastMemoId || 0}>
        {memos.map((memo: MemoData) => (
          <Paper variant="outlined" key={'home-memo' + memo.id} onClick={() => handleClick(memo)}>
            <BasicBox memo={memo} />
          </Paper>
        ))}
      </MemoList>
    </>
  )

  const bookmark = detailItem ? (
    <DetailContainer myId={id} firstLoadParent={detailItem}>
      <Button startIcon={<ArrowBack />} onClick={() => setDetailItem(undefined)}>
        목록으로 돌아가기
      </Button>
    </DetailContainer>
  ) : (
    <>
      <MemoList loadingBox={loadingBox} aria="bookmark" addMemoList={addMemoList} nextCursor={lastMemoId || 0}>
        {memos.map((memo: MemoData) => (
          <Paper variant="outlined" key={'my-memo' + memo.id} onClick={() => handleClick(memo)}>
            <BasicBox memo={memo} />
          </Paper>
        ))}
      </MemoList>
    </>
  )

  const follow = (
    <UserList user={{ id: id || 0, name: name || '' }} nextCursor={0} loadingBox={undefined} addUserList={addUserList}>
      <></>
    </UserList>
  )

  return (
    <Box sx={{ width: '100%' }}>
      <Box>
        <Tabs value={value} onChange={(_, newValue) => setValue(newValue)} aria-label="모아보기">
          {labels.map((label, i) => (
            <Tab key={`tab${i}`} label={label} id={`tab${i}`} aria-controls={`panel${i}`} />
          ))}
        </Tabs>
      </Box>
      <Divider />
      {labels.map((_, i) => (
        <Box key={`panel${i}`} role={`panel${i}`} id={`panel${i}`} aria-labelledby={`tab${i}`} hidden={value !== i}>
          <Stack spacing={2}>{[mypost, bookmark, follow][i]}</Stack>
        </Box>
      ))}
    </Box>
  )
}
