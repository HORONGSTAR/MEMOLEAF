'use client'
import { ReactNode, useMemo } from 'react'
import { LinkBox, CommentButton, Paper, ExpandButton, MemoThread, BookmarkButton } from '@/components'
import { MemoDeco, Avatar } from '@/components'

import { Box, ListItem, ListItemAvatar, ListItemBaseProps, ListItemText } from '@mui/material'
import { CardActions } from '@mui/material'
import { Layout, OnOffItem, MemoData } from '@/lib/types'
import { changeDate } from '@/lib/utills'
import { AutoStoriesOutlined } from '@mui/icons-material'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Props {
  memo: MemoData
  memu: ReactNode
  children: ReactNode
  layout: Layout
}

export default function MemoContent(props: Props) {
  const { memo, memu, children, layout } = props
  const { data: session } = useSession()
  const userId = session?.user.id

  const nameLink = <LinkBox link={`/page/my/${memo.user.id}`}>{memo.user.name}</LinkBox>
  const date = changeDate(memo.createdAt)

  const leafCount = memo._count.leafs

  const bookmarkProps = useMemo(() => {
    const isMine = memo.bookmarks.filter((bookmark) => bookmark.userId === userId)
    if (isMine.length > 0) {
      return { id: isMine[0].id, state: 'check' }
    }
    return { id: memo.id, state: 'uncheck' }
  }, [memo, userId])

  const comment = <CommentButton id={memo.id} count={memo._count.comments} user={memo.user} />

  const bookmarkButton = <BookmarkButton {...bookmarkProps} count={memo._count.bookmarks} />

  const thredProps = { id: memo.id, count: leafCount, userId: memo.user.id }

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

  const CommonContent = (props: ListItemBaseProps) => (
    <>
      <MemoDeco decos={memo.decos} {...props}>
        <ListItem>
          {memo.content}
          {children}
        </ListItem>
      </MemoDeco>
    </>
  )

  const MemoListItme = () => {
    return (
      <Box ml={3}>
        <ListItem secondaryAction={memu} dense>
          <UserInfo />
        </ListItem>
        <CommonContent dense />
        <CardActions>
          {bookmarkButton}
          <DetailPageLink />
        </CardActions>
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
        {{ [leafCount]: <MemoThread {...thredProps} />, 0: null }[leafCount]}
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
        <MemoThread formActive="on" {...thredProps} />
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
