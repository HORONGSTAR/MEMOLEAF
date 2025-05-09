import { Avatar as MuiAvatar } from '@mui/material'

interface Props {
  variant?: 'circular' | 'rounded' | 'square'
  size?: number
  user?: {
    name?: string | null
    image?: string | null
  }
}

export default function UserAvatar(props: Props) {
  const { variant, size, user } = props
  return (
    <MuiAvatar
      variant={variant}
      sx={{ width: size || 32, height: size || 32 }}
      src={`${process.env.NEXT_PUBLIC_IMG_URL}/uploads${user?.image}`}
      alt={`${user?.name}프로필 사진`}
    />
  )
}
