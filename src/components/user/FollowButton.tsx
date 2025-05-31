'use client'
import { followUser, unfollowUser } from '@/shared/fetch/usersApi'
import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'

interface Props {
  followingId: number
  followingName: string
  state: string
}

export default function FollowButton(props: Props) {
  const [message, setMessage] = useState('')
  const [state, setState] = useState(props.state || 'follow')
  const { followingId, followingName } = props

  const handleFollow = () => {
    followUser(followingId)
    setState('follow')
    setMessage(followingName + '님을 팔로우 했습니다.')
  }

  const handleUnFollow = () => {
    unfollowUser(followingId)
    setState('unfollow')
    setMessage(followingName + '님을 언팔로우 했습니다.')
  }

  const followButton = {
    unfollow: <Button onClick={handleFollow}>팔로우</Button>,
    follow: <Button onClick={handleUnFollow}>언팔로우</Button>,
    none: null,
  }[state]

  return (
    <>
      {followButton}
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
