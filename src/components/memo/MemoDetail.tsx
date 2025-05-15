'use client'
import { BackButton, MemoBox, ImgModal, MemoForm, Card, MemoHeader, MemoFooter, ImgGrid, ExpandButton } from '@/components'
import { useCallback, useEffect, useState } from 'react'
import { CardContent, ImageList, ImageListItem, ListItem } from '@mui/material'
import { Memo, MemoParams } from '@/lib/types'
import { addImagePath } from '@/lib/utills'
import { useSession } from 'next-auth/react'
import { createMemo, getMemos } from '@/lib/api/memoApi'
import { AutoStoriesOutlined } from '@mui/icons-material'
import Link from 'next/link'

interface Props {
  memo: Memo
}
export default function MemoDetail(props: Props) {
  const [memo, setMemo] = useState(props.memo)
  const [leafs, setLeafs] = useState<Memo[]>([])
  const { data: session } = useSession()
  const user = session?.user

  useEffect(() => {
    if (!memo) return
    getMemos({ page: 1, parentId: memo.id }).then((result) => setLeafs(result.memos))
  }, [memo])

  const handleCreateMemo = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      if (!user) return
      createMemo({ ...params, id: user.id, parentId: memo.id })
        .then((result) => setLeafs((prev) => [result, ...prev]))
        .catch()
    },
    [user, memo]
  )

  if (!memo) return null

  const images = addImagePath(memo.images)
  const count = memo.images.length
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

  return (
    <>
      <Card sx={{ border: 'none', boxShadow: 'none' }}>
        <BackButton />
        <MemoBox {...memo} header={<MemoHeader {...memo} />} footer={<MemoFooter id={memo.id} _count={memo._count} />} setMemo={setMemo}>
          <CardContent>{memo.content}</CardContent>
          <ImageList cols={cols[count]} sx={{ mt: 2 }}>
            {imgListRow1}
            {imgListRow2}
          </ImageList>
        </MemoBox>
      </Card>
      {memo.parentId === null && memo.user.id === user?.id && (
        <Card use="create">
          <MemoForm onSubmit={handleCreateMemo} placeholder="메모 타래 추가하기" />
        </Card>
      )}
      {leafs.map((leaf) => (
        <Card key={leaf.id}>
          <MemoBox
            {...leaf}
            setLeafs={setLeafs}
            header={<MemoHeader {...leaf} variant="list" />}
            footer={
              <MemoFooter id={leaf.id} _count={leaf._count}>
                <ExpandButton component={Link} href={`/memo/${leaf.id}`}>
                  <AutoStoriesOutlined fontSize="small" />
                  <span className="label">페이지</span>
                </ExpandButton>
              </MemoFooter>
            }
          >
            <ListItem>{leaf.content}</ListItem>
            <ImgGrid images={addImagePath(leaf.images)} />
          </MemoBox>
        </Card>
      ))}
    </>
  )
}
