import { imgPath } from '@/shared/utils/common'
import { Avatar as MuiAvatar, AvatarProps } from '@mui/material'

interface Props extends AvatarProps {
  size?: number
  user?: {
    name?: string | null
    image?: string | null
  }
}

export default function Avatar(props: Props) {
  const { variant, size, user } = props
  return <MuiAvatar variant={variant} sx={{ width: size || 32, height: size || 32 }} src={imgPath + user?.image} alt={`${user?.name}프로필 사진`} />
}
