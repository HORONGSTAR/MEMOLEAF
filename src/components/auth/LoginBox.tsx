'use client'
import { Button, Stack, SvgIcon } from '@mui/material'
import { signIn } from 'next-auth/react'
import { googleIcon, kakaoIcon, naverIcon } from '@/styles/Icons'

export default function LoginBox() {
  return (
    <Stack spacing={2}>
      <Button
        sx={{ textTransform: 'none' }}
        size="large"
        startIcon={<SvgIcon>{googleIcon}</SvgIcon>}
        variant="outlined"
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
