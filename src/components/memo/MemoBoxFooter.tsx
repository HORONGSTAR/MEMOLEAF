'use client'
import { ForumOutlined, BookmarkBorder, AutoStories } from '@mui/icons-material'
import { Typography, CardActions, IconButton, Collapse, Chip } from '@mui/material'
import { Blank, CommentBox, LinkBox } from '@/components'
import { useState } from 'react'
import { Active } from '@/lib/types'
import { swapOnOff } from '@/lib/utills'

interface Props {
  style: 'detail' | 'index'
  count: { comments: number; bookmarks: number }
  id: number
}
export default function MemoBoxFooter(props: Props) {
  const [count, setCount] = useState(props.count || { comments: 0, bookmarks: 0 })
  const [active, setActive] = useState<Active>('off')

  const { id } = props

  return (
    <>
      <CardActions>
        <IconButton sx={{ position: 'relative' }} onClick={() => setActive(swapOnOff[active].next)}>
          <ForumOutlined fontSize="small" />
          <Typography variant="body2" sx={{ position: 'absolute', right: -2, fontWeight: 'bold' }}>
            {count.comments}
          </Typography>
        </IconButton>
        <IconButton sx={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <BookmarkBorder fontSize="small" />
          <Typography variant="body2" sx={{ position: 'absolute', right: -2, fontWeight: 'bold' }}>
            {count.bookmarks}
          </Typography>
        </IconButton>
        <Blank />
        <LinkBox link={`/page/memo/${id}`}>
          <Chip label="타래 추가" sx={{ p: 1 }} icon={<AutoStories fontSize="small" />} color="success" clickable />
        </LinkBox>
      </CardActions>
      <Collapse in={swapOnOff[active].bool}>
        <CommentBox id={id} active={active} setCount={setCount} />
      </Collapse>
    </>
  )
}
