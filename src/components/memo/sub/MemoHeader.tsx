'use client'
import { CardHeader, Typography, ListItem } from '@mui/material'
import { User, ActiveNode } from '@/lib/types'
import { Avatar, LinkBox } from '@/components'
import { changeDate } from '@/lib/utills'

interface Props {
  user: User
  variant?: 'card' | 'list'
  createdAt: string
}

export default function MemoHeader(props: Props) {
  const { variant, user, createdAt } = props

  const userInfo: ActiveNode = {
    card: (
      <CardHeader
        avatar={
          <LinkBox link={`/page/my/${user.id}`}>
            <Avatar user={user} size={36} />
          </LinkBox>
        }
        title={<LinkBox link={`/page/my/${user.id}`}>{user.name}</LinkBox>}
        subheader={changeDate(createdAt)}
      />
    ),
    list: (
      <ListItem sx={{ gap: 0.5, mt: 1, pr: 0 }} dense>
        <LinkBox link={`/page/my/${user.id}`} noWrap>
          {user.name}
        </LinkBox>
        <Typography variant="body2" color="textSecondary">
          {changeDate(createdAt, 'YYYY.MM.DD')}
        </Typography>
      </ListItem>
    ),
  }

  return <>{userInfo[variant || 'card']}</>
}
