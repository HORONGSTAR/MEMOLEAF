'use client'
import { ReactNode, useMemo } from 'react'
import { LinkBox, CommentButton, Paper, ExpandButton, BookmarkButton, MemoThread } from '@/components'
import { MemoDeco, Avatar } from '@/components'

import { Box, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material'
import { CardActions } from '@mui/material'
import { Layout, OnOffItem, MemoData, OnOff } from '@/lib/types'
import { changeDate, checkCurrentOnOff } from '@/lib/utills'
import { AutoStoriesOutlined } from '@mui/icons-material'
import Link from 'next/link'

interface Props {
  memo: MemoData
  memu: ReactNode
  children: ReactNode
  layout: Layout
}

export default function MemoContent(props: Props) {
  const { memo, memu, children, layout } = props
  const nameLink = <LinkBox link={`/page/my/${memo.user.id}`}>{memo.user.name}</LinkBox>
  const date = changeDate(memo.createdAt)

  const bookmarkProps = useMemo(() => {
    if (!memo.bookmarks) return { id: memo.id, state: 'uncheck' }
    const isMine = checkCurrentOnOff(1, memo.bookmarks.length)
    const id: { [key: OnOff]: number } = { on: memo.bookmarks[0]?.id, off: memo.id }
    const state: { [key: OnOff]: string } = { on: 'check', off: 'uncheck' }
    return { id: id[isMine], state: state[isMine] }
  }, [memo])

  const comment = <CommentButton id={memo.id} count={memo._count?.comments} user={memo.user} />

  const bookmarkButton = <BookmarkButton {...bookmarkProps} count={memo._count?.bookmarks} />

  const DetailPageLink = () => (
    <ExpandButton component={Link} href={`/page/detail/${memo.id}`}>
      <AutoStoriesOutlined fontSize="small" />
      <span className="label">페이지</span>
    </ExpandButton>
  )

  const UserInfo = () => <ListItemText primary={nameLink} secondary={date} />

  const AvatarHeader = () => (
    <ListItem secondaryAction={memu}>
      <ListItemAvatar>
        <LinkBox link={`/page/my/${memo.user.id}`}>
          <Avatar user={memo.user} size={36} />
        </LinkBox>
      </ListItemAvatar>
      <UserInfo />
    </ListItem>
  )

  const CommonContent = () => (
    <>
      <MemoDeco decos={memo.decos}>
        <ListItem>{memo.content}</ListItem>
        <ListItem>{children}</ListItem>
      </MemoDeco>
    </>
  )

  const MemoListItme = () => {
    return (
      <Box>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            {date}
          </Typography>
          {memu}
        </Stack>
        <MemoDeco decos={memo.decos}>
          <Stack>
            {memo.content}
            {children}
          </Stack>
        </MemoDeco>
      </Box>
    )
  }

  const MemoCardItme = () => {
    return (
      <Paper>
        <AvatarHeader />
        <CommonContent />
        <CardActions>
          {comment}
          {bookmarkButton}
          <DetailPageLink />
        </CardActions>
        <MemoThread id={memo.id} count={memo._count?.leafs} />
      </Paper>
    )
  }

  const MemoDeatailItme = () => {
    return (
      <Box>
        <AvatarHeader />
        <CommonContent />
        <CardActions>
          {comment}
          {bookmarkButton}
        </CardActions>
      </Box>
    )
  }

  const layoutBox: OnOffItem = {
    list: <MemoListItme />,
    card: <MemoCardItme />,
    detail: <MemoDeatailItme />,
  }

  return layoutBox[layout]
}
