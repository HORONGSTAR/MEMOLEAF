'use client'
import { Collapse, Button, List, Divider, Typography, Box, ListItem, ButtonProps } from '@mui/material'
import { ImgGrid, MemoBox, MemoFooter, MemoHeader } from '@/components'
import { ReactNode, useCallback, useState } from 'react'
import { Memo, ActiveNode } from '@/lib/types'
import { grey } from '@mui/material/colors'
import { getMemos } from '@/lib/api/memoApi'
import { addImagePath, swapOnOff } from '@/lib/utills'

interface Props {
  count: number
  children?: ReactNode
  id: number
}

export default function MemoThread(props: Props) {
  const [leafs, setLeafs] = useState<Memo[]>([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(1)
  const [open, setOpen] = useState('off')
  const { id, count } = props

  const handleGetMemos = useCallback(() => {
    setOpen('on')
    getMemos({ page, limit: 5, parentId: id }).then((result) => {
      setLeafs((prev) => [...prev, ...result.memos])
      setTotal(result.total)
      setPage((prev) => prev + 1)
    })
  }, [id, page])

  const loadButton: ActiveNode = {
    off: <LoadButton onClick={handleGetMemos}>메모 타래 펼치기</LoadButton>,
    on: <LoadButton onClick={() => setOpen('off')}>메모 타래 접기</LoadButton>,
  }

  if (!count) return null

  const thread = leafs.map((leaf) => (
    <Box key={leaf.id}>
      <MemoBox {...leaf} setLeafs={setLeafs} header={<MemoHeader {...leaf} variant="list" />} footer={<MemoFooter {...leaf} />}>
        <ListItem>{leaf.content}</ListItem>
        <ImgGrid images={addImagePath(leaf.images)} />
      </MemoBox>
      <Divider />
    </Box>
  ))

  return (
    <>
      {loadButton[open]}
      <Collapse in={swapOnOff[open].bool}>
        <List dense>{thread}</List>
        <Divider sx={{ my: 4 }} variant="middle">
          {page - 1 !== total ? (
            <Button onClick={handleGetMemos}>{`더 보기 (${page}/${total})`}</Button>
          ) : (
            <Typography variant="caption" color="textDisabled">
              더 이상 표시할 콘텐츠가 없습니다
            </Typography>
          )}
        </Divider>
      </Collapse>
    </>
  )
}

function LoadButton(props: ButtonProps) {
  return <Button fullWidth sx={{ color: grey[500], bgcolor: grey[100] }} size="small" variant="contained" {...props} />
}
