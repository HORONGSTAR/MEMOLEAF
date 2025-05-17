'use client'
import { ReactNode } from 'react'
import { LinkBox, CommentButton, Paper, ExpandButton, MemoThread } from '@/components'
import { MemoDeco, Avatar } from '@/components'

import { Box, ListItem, ListItemText } from '@mui/material'
import { CardContent, CardHeader, CardActions } from '@mui/material'
import { Layout, ActiveNode, Memo } from '@/lib/types'
import { changeDate } from '@/lib/utills'
import { AutoStoriesOutlined } from '@mui/icons-material'
import Link from 'next/link'

interface Props {
  memo: Memo
  memu: ReactNode
  children: ReactNode
  layout: Layout
}

export default function MemoContent(props: Props) {
  const { memo, memu, children, layout } = props

  const avatar = (
    <LinkBox link={`/my/${memo.user.id}`}>
      <Avatar user={memo.user} size={36} />
    </LinkBox>
  )

  const name = <LinkBox link={`/my/${memo.user.id}`}>{memo.user.name}</LinkBox>

  const date = changeDate(memo.createdAt)

  const comment = <CommentButton id={memo.id} count={memo._count.comments} user={memo.user} />

  const detailLink = (
    <ExpandButton component={Link} href={`/page/memo/${memo.id}`}>
      <AutoStoriesOutlined fontSize="small" />
      <span className="label">페이지</span>
    </ExpandButton>
  )

  const leafCount = memo._count.leafs
  const thread = { [leafCount]: <MemoThread formActive="off" id={memo.id} total={memo._count.leafs} userId={memo.user.id} />, 0: null }[leafCount]
  const cardContent = (
    <>
      <CardHeader avatar={avatar} title={name} subheader={date} action={memu} />
      <MemoDeco decos={memo.decos}>
        <CardContent>
          {memo.content}
          {children}
        </CardContent>
      </MemoDeco>
    </>
  )

  const layoutBox: ActiveNode = {
    list: (
      <>
        <ListItem secondaryAction={memu} dense>
          <ListItemText primary={name} secondary={date} />
        </ListItem>
        <ListItem dense>
          <MemoDeco decos={memo.decos}>
            <ListItemText>
              {memo.content}
              {children}
            </ListItemText>
          </MemoDeco>
        </ListItem>
        <ListItem divider>
          {comment}
          {detailLink}
        </ListItem>
      </>
    ),
    card: (
      <Paper>
        {cardContent}
        <CardActions>
          {comment}
          {detailLink}
        </CardActions>
        {thread}
      </Paper>
    ),
    detail: (
      <Box>
        {cardContent}
        <CardActions>{comment}</CardActions>
        {thread}
      </Box>
    ),
  }

  return layoutBox[layout]
}
