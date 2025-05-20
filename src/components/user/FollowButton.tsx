'use client'
import { followUser } from '@/lib/fetch/userApi'
import { OnOffItem } from '@/lib/types'
import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'

interface Props {
  toUserId: number
  toUserName: string
  state: string
}

export default function FollowButton(props: Props) {
  const [message, setMessage] = useState('')
  const [state, setState] = useState(props.state || 'follow')
  const { toUserId, toUserName } = props

  const handleFollow = (action: string) => {
    followUser({ toUserId, action })
    setState(action)
    setMessage(
      {
        follow: toUserName + '님을 팔로우 했습니다.',
        unfollow: toUserName + '님을 언팔로우 했습니다.',
      }[state] || ''
    )
  }

  const followButton: OnOffItem = {
    unfollow: <Button onClick={() => handleFollow('follow')}>팔로우</Button>,
    follow: <Button onClick={() => handleFollow('unfollow')}>언팔로우</Button>,
    none: null,
  }

  return (
    <>
      {followButton[state]}
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={message ? true : false}
        autoHideDuration={6000}
        onClose={() => setMessage('')}
        message={message}
      />
    </>
  )
}
