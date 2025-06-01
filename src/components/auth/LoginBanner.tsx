import { IconButton, Stack, SvgIcon } from '@mui/material'
import { googleIcon, kakaoIcon, naverIcon } from '@/styles/Icons'
import { signIn } from 'next-auth/react'

export default function LoginBox() {
  return (
    <Stack spacing={2} direction="row">
      <IconButton
        aria-label="Google로 시작하기"
        sx={{ bgcolor: '#fff', color: '#222', '&:hover': { bgcolor: '#B5C9B2' } }}
        onClick={() => signIn('google')}
      >
        <SvgIcon fontSize="small">{googleIcon}</SvgIcon>
      </IconButton>
      <IconButton
        aria-label="카카오로 시작하기"
        sx={{ bgcolor: '#FEE500', color: '#191919', '&:hover': { bgcolor: '#B5C9B2' } }}
        onClick={() => signIn('kakao')}
      >
        <SvgIcon fontSize="small">{kakaoIcon}</SvgIcon>
      </IconButton>

      <IconButton
        aria-label="네이버로 시작하기"
        sx={{ bgcolor: '#2DB400', color: '#ffffff', '&:hover': { bgcolor: '#B5C9B2' } }}
        onClick={() => signIn('naver')}
      >
        <SvgIcon fontSize="small">{naverIcon}</SvgIcon>
      </IconButton>
    </Stack>
  )
}
