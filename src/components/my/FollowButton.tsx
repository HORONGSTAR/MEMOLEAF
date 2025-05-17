'use client'
import { followUser } from '@/lib/api/userApi'
import { ActiveNode, FollowParams } from '@/lib/types'
import { Button } from '@mui/material'
import { useState } from 'react'

export default function FollowButton(props: FollowParams) {
  const [state, setState] = useState(props.action || 'follow')
  const { fromUserId, toUserId } = props

  const handleFollow = (action: string) => {
    followUser({ fromUserId, toUserId, action })
    setState(action)
  }

  const followButton: ActiveNode = {
    unfollow: <Button onClick={() => handleFollow('follow')}>팔로우</Button>,
    follow: <Button onClick={() => handleFollow('unfollow')}>언팔로우</Button>,
    none: null,
  }

  return followButton[state]
}
