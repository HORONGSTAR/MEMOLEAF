'use client'
import { Avatar as MuiAvatar } from '@mui/material'
import { Props } from '@/lib/types'

export default function UserAvatar(props: Props) {
  return (
    <MuiAvatar
      variant={props.variant}
      sx={{ width: props.size || 32, height: props.size || 32 }}
      src={`${process.env.NEXT_PUBLIC_IMG_URL}/uploads${props.user?.image || ''}`}
      alt={`${props.user?.name}프로필 사진`}
    />
  )
}
