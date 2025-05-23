import { imgPath } from '@/lib/utills'
import { useAppSelector } from '@/store/hooks'
import { Avatar as MuiAvatar, AvatarProps } from '@mui/material'

interface Props extends AvatarProps {
  size?: number
  user?: {
    name?: string | null
    image?: string | null
  }
}

export default function Avatar(props: Props) {
  const { variant, size } = props
  const { profile: user } = useAppSelector((state) => state.profile)

  return <MuiAvatar variant={variant} sx={{ width: size || 32, height: size || 32 }} src={imgPath + user?.image} alt={`${user?.name}프로필 사진`} />
}
