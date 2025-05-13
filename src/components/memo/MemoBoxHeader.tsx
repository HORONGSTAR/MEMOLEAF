'use client'
import { ReactNode } from 'react'
import { CardHeader, Typography, ListItem } from '@mui/material'
import { User } from '@/lib/types'
import { Avatar, LinkBox } from '@/components'
import { changeDate } from '@/lib/utills'

interface Props {
  user: User
  variant?: 'card' | 'list'
  action: ReactNode
  createdAt: string
}

type UserInfo = {
  [key: string]: ReactNode
}

export default function MemoBoxHeader(props: Props) {
  const { variant, action, user, createdAt } = props

  const userInfo: UserInfo = {
    card: (
      <CardHeader
        avatar={
          <LinkBox link={`/page/my/${user.id}`}>
            <Avatar user={user} size={36} />
          </LinkBox>
        }
        title={<LinkBox link={`/page/my/${user.id}`}>{user.name}</LinkBox>}
        subheader={changeDate(createdAt)}
        action={action}
      />
    ),
    list: (
      <ListItem sx={{ gap: 0.5, mt: 1 }} secondaryAction={action} dense>
        <LinkBox link={`/page/my/${user.id}`}>{user.name}</LinkBox>
        <Typography variant="body2" color="textSecondary">
          {changeDate(createdAt, 'YYYY.MM.DD')}
        </Typography>
      </ListItem>
    ),
  }

  return <>{userInfo[variant || 'card']}</>
}
