'use client'
import { ForumOutlined, BookmarkBorder } from '@mui/icons-material'
import { Typography, CardActions, IconButton } from '@mui/material'
import { CommentBox, Bubble } from '@/components'
import { ReactNode, useState } from 'react'
import { Active } from '@/lib/types'

interface Props {
  _count: { comments: number; bookmarks: number }
  children?: ReactNode
  id: number
}
export default function MemoFooter(props: Props) {
  const [count, setCount] = useState(props._count || { comments: 0, bookmarks: 0, leafs: 0 })
  const [active, setActive] = useState<Active>('off')
  const { id, children } = props

  return (
    <>
      <CardActions>
        <Bubble
          label="댓글창 열기"
          icon={
            <>
              <ForumOutlined fontSize="small" />
              <Typography variant="body2" sx={{ position: 'absolute', right: -2, fontWeight: 'bold' }}>
                {count.comments}
              </Typography>
            </>
          }
          addEvent={() => setActive('on')}
        >
          <CommentBox id={id} active={active} setCount={setCount} />
        </Bubble>
        {/* <IconButton sx={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
          <BookmarkBorder fontSize="small" />
          <Typography variant="body2" sx={{ position: 'absolute', right: -2, fontWeight: 'bold' }}>
            {count.bookmarks}
          </Typography>
        </IconButton> */}
        {children}
      </CardActions>
    </>
  )
}
