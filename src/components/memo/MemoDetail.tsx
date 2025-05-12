'use client'
import { BackButton, MemoBox, ImgModal, MemoForm, ImgGrid, LinkBox } from '@/components'
import { useCallback, useEffect, useState } from 'react'
import { createMemoThunk, getMemosThunk } from '@/store/slices/memoSlice'
import { ImageList, ImageListItem, Card } from '@mui/material'
import { Memo, MemoParams } from '@/lib/types'
import { useAppDispatch } from '@/store/hooks'
import { editImageUrl } from '@/lib/utills'
import { useSession } from 'next-auth/react'

interface Props {
  memo: Memo
}
export default function MemoDetail(props: Props) {
  const dispatch = useAppDispatch()
  const [memo, setMemo] = useState(props.memo)
  const [replies, setReplies] = useState<Memo[]>([])
  const images = editImageUrl(memo.images)
  const count = memo.images.length
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    dispatch(getMemosThunk({ page: 1, parentId: memo.id }))
      .unwrap()
      .then((result) => setReplies(result.memos))
      .catch()
  }, [dispatch, memo])

  const handleCreateMemo = useCallback(
    (params: MemoParams) => {
      if (!user) return
      dispatch(createMemoThunk({ ...params, id: user.id, parentId: memo.id }))
        .unwrap()
        .then((result) => setReplies((prev) => [...prev, result]))
        .catch()
    },
    [dispatch, user, memo]
  )

  const cols: { [key: number]: number } = { 1: 2, 2: 4, 3: 3, 4: 2 }

  const imgListRow1 = images.slice(0, 4 - count).map((img) => (
    <ImageListItem key={img.id} cols={2} rows={2}>
      <ImgModal image={img.url} size={700} />
    </ImageListItem>
  ))

  const imgListRow2 = images.slice(4 - count, count).map((img) => (
    <ImageListItem key={img.id}>
      <ImgModal image={img.url} size={700} />
    </ImageListItem>
  ))

  const thread = replies.map((reply) => (
    <Card variant="outlined" key={reply.id}>
      <LinkBox link={`/page/memo/${reply.id}`}>
        <MemoBox {...reply} setMemo={setMemo} headerStyle="list">
          {reply.content}
          <ImgGrid images={editImageUrl(reply.images)} />
        </MemoBox>
      </LinkBox>
    </Card>
  ))

  return (
    <>
      <Card sx={{ border: 'none', boxShadow: 'none' }}>
        <BackButton />
        <MemoBox {...memo} setMemo={setMemo}>
          {memo.content}
          <ImageList cols={cols[count]} sx={{ mt: 2 }}>
            {imgListRow1}
            {imgListRow2}
          </ImageList>
        </MemoBox>
      </Card>
      <MemoForm onSubmit={handleCreateMemo} placeholder="메모 타래 추가하기" />
      {thread}
    </>
  )
}
