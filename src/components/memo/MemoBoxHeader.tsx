'use client'
import { ReactNode } from 'react'
import { CardHeader, Typography, ListItem } from '@mui/material'
import { Memo } from '@/lib/types'
import { Avatar, LinkBox } from '@/components'
import { changeDate } from '@/lib/utills'

interface Props extends Memo {
  headerStyle?: 'card' | 'list'
  action: ReactNode
}

type UserInfo = {
  [key: string]: ReactNode
}

export default function MemoBoxHeader(props: Props) {
  const { headerStyle, action, user, createdAt } = props

  const userInfo: UserInfo = {
    card: (
      <CardHeader
        avatar={
          <LinkBox link={`/page/my/${user.id}`}>
            <Avatar user={user} size={36} />
          </LinkBox>
        }
        title={
          <LinkBox link={`/page/my/${user.id}`}>
            <Typography component="span" variant="body2" fontWeight={500}>
              {user.name}
            </Typography>
          </LinkBox>
        }
        subheader={changeDate(createdAt)}
        action={action}
      />
    ),
    list: (
      <ListItem sx={{ gap: 0.5, mt: 1 }} secondaryAction={action}>
        <LinkBox link={`/page/my/${user.id}`}>
          <Typography variant="body2" color="primary">
            {user.name}
          </Typography>
        </LinkBox>
        <Typography variant="caption" color="textSecondary">
          {changeDate(createdAt, 'YYYY.MM.DD')}
        </Typography>
      </ListItem>
    ),
  }

  return <>{userInfo[headerStyle || 'card']}</>
}
