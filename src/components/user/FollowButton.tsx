'use client'
import { followUser } from '@/lib/fetch/userApi'
import { OnOffItem } from '@/lib/types'
import { Button } from '@mui/material'
import { useState } from 'react'

interface Props {
  toUserId: number
  state: string
}

export default function FollowButton(props: Props) {
  const [state, setState] = useState(props.state || 'follow')
  const { toUserId } = props

  const handleFollow = (action: string) => {
    followUser({ toUserId, action })
    setState(action)
  }

  const followButton: OnOffItem = {
    unfollow: <Button onClick={() => handleFollow('follow')}>팔로우</Button>,
    follow: <Button onClick={() => handleFollow('unfollow')}>언팔로우</Button>,
    none: null,
  }

  return followButton[state]
}
