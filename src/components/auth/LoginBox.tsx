import { googleIcon, kakaoIcon, naverIcon } from '@/styles/Icons'
import { Button, Stack, SvgIcon } from '@mui/material'
import { signIn } from 'next-auth/react'

export default function LoginBox() {
  return (
    <Stack spacing={2}>
      <Button
        color="inherit"
        sx={{ textTransform: 'none', bgcolor: '#fff', color: '#222', border: '1px solid #222' }}
        size="large"
        startIcon={<SvgIcon>{googleIcon}</SvgIcon>}
        variant="contained"
        onClick={() => signIn('google')}
      >
        Google로 시작하기
      </Button>
      <Button
        sx={{ bgcolor: '#FEE500', color: '#191919' }}
        size="large"
        startIcon={<SvgIcon>{kakaoIcon}</SvgIcon>}
        variant="contained"
        onClick={() => signIn('kakao')}
      >
        카카오로 시작하기
      </Button>
      <Button
        sx={{ bgcolor: '#2DB400', color: '#ffffff' }}
        size="large"
        startIcon={<SvgIcon>{naverIcon}</SvgIcon>}
        variant="contained"
        onClick={() => signIn('naver')}
      >
        네이버로 시작하기
      </Button>
    </Stack>
  )
}
