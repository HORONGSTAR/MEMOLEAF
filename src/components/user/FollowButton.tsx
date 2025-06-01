'use client'
import { followUser, unfollowUser } from '@/shared/fetch/usersApi'
import { Button } from '@mui/material'
import { useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  followingId: number
  followingName: string
  state: string
}

export default function FollowButton(props: Props) {
  const [state, setState] = useState(props.state || 'follow')
  const { followingId, followingName } = props
  const dispatch = useAppDispatch()

  const handleFollow = () => {
    followUser(followingId)
      .then(() => {
        setState('follow')
        dispatch(
          openAlert({
            message: followingName + '님을 팔로우 했습니다.',
          })
        )
      })
      .catch(({ message }) => {
        dispatch(openAlert({ message, severity: 'error' }))
      })
  }

  const handleUnFollow = () => {
    unfollowUser(followingId)
      .then(() => {
        setState('unfollow')
        dispatch(
          openAlert({
            message: followingName + '님을 언팔로우 했습니다.',
          })
        )
      })
      .catch(({ message }) => {
        dispatch(openAlert({ message, severity: 'error' }))
      })
  }

  const followButton = {
    unfollow: <Button onClick={handleFollow}>팔로우</Button>,
    follow: <Button onClick={handleUnFollow}>언팔로우</Button>,
    none: null,
  }[state]

  return followButton
}
