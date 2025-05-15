'use client'
import { Card, ImgGrid, LoginBox, MemoBox, MemoFooter, MemoForm, MemoHeader, MemoLink } from '@/components'
import { createMemo, getMemos } from '@/lib/api/memoApi'
import { ActiveNode, Memo, MemoParams } from '@/lib/types'
import { addImagePath } from '@/lib/utills'
import { useAppSelector } from '@/store/hooks'
import { Box, Button, CardContent, Divider, Typography } from '@mui/material'
import { useCallback, useMemo, useState } from 'react'

interface Props {
  memos: Memo[]
  total: number
}

export default function MemoList(props: Props) {
  const [memos, setMemos] = useState<Memo[]>(props.memos.length > 0 ? props.memos : [])
  const { user } = useAppSelector((state) => state.auth)
  const [page, setPage] = useState(2)
  const [total, setTotal] = useState(props.total || 0)

  const handleGetMemos = useCallback(() => {
    getMemos({ page, limit: 5 }).then((result) => {
      setMemos((prev) => [...prev, ...result.memos])
      setTotal(result.total)
      setPage((prev) => prev + 1)
    })
  }, [page])

  const handleCreateMemo = useCallback(
    (params: Omit<MemoParams, 'id'>) => {
      if (!user) return
      createMemo({ ...params, id: user.id })
        .then((memo) => setMemos((prev) => [{ ...memo, user }, ...prev]))
        .catch((err) => console.error(err))
    },
    [user]
  )

  if (!user)
    <Box sx={{ px: 10 }}>
      <Typography color="primary" variant="h6">
        로그인 후 기록을 남겨보세요!
      </Typography>
      <Typography color="primary" variant="body2">
        소셜로그인으로 간편하게 사용할 수 있어요.
      </Typography>
      <LoginBox />
    </Box>

  const active = useMemo(() => (page - 1 !== total ? 'on' : 'off'), [page, total])

  const pageButton: ActiveNode = {
    on: (
      <Button onClick={handleGetMemos}>
        더 보기{page - 1}/{total}
      </Button>
    ),
    off: (
      <Typography variant="caption" color="textDisabled">
        더 이상 표시할 콘텐츠가 없습니다
      </Typography>
    ),
  }

  return (
    <>
      <Card use="create">
        <MemoForm onSubmit={handleCreateMemo} />
      </Card>
      {memos.map((memo: Memo) => (
        <Card key={memo.id}>
          <MemoBox
            {...memo}
            header={<MemoHeader user={memo.user} createdAt={memo.createdAt} />}
            footer={
              <MemoFooter id={memo.id} _count={memo._count}>
                <MemoLink id={memo.id} />
              </MemoFooter>
            }
          >
            <CardContent>{memo.content}</CardContent>
            <ImgGrid images={addImagePath(memo.images)} />
          </MemoBox>
        </Card>
      ))}
      <Divider sx={{ my: 4 }} variant="middle">
        {pageButton[active]}
      </Divider>
    </>
  )
}
