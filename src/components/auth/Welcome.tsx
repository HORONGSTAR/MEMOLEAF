import { Button, Divider, Stack, Typography } from '@mui/material'
import { green, grey } from '@mui/material/colors'
import LoginBanner from './LoginBanner'
import Image from 'next/image'
import { signIn } from 'next-auth/react'

export default function Welcome() {
  const banner1 = (
    <Stack
      direction={{ sm: 'row', xs: 'column' }}
      sx={{ bgcolor: grey[50], borderRadius: 1, p: 2, mb: 4 }}
      justifyContent="space-around"
      alignItems="center"
      spacing={2}
    >
      <Image src={'/undraw_development_s4gv.svg'} alt="의견을 게시하는 사람들" width={250} height={120} priority />
      <Stack maxWidth={320} spacing={2} alignItems="center">
        <Stack alignItems="center">
          <Typography color="textSecondary" variant="h6">
            메모리프에 오신 걸 환영합니다!
          </Typography>
          <Typography color="textSecondary" variant="body2">
            메모리프는 공용 테이블에 펼쳐진 낙서장 같은 공간이에요. 일상적인 기록을 남기고, 다른 사람의 기록도 구경하세요.
          </Typography>
        </Stack>
        <Divider flexItem>
          <Typography variant="caption" color="textSecondary">
            소셜 로그인
          </Typography>
        </Divider>
        <LoginBanner />
      </Stack>
    </Stack>
  )

  const banner2 = (
    <Stack
      direction={{ sm: 'row-reverse', xs: 'column' }}
      sx={{ bgcolor: green[50], borderRadius: 1, p: 2, mb: 4 }}
      justifyContent="space-around"
      alignItems="center"
      spacing={2}
    >
      <Image src={'/undraw_data-reports_l2u3.svg'} alt="의견을 게시하는 사람들" width={200} height={120} priority />
      <Stack maxWidth={320} spacing={2} alignItems="center">
        <Stack alignItems="center">
          <Typography color="primary" variant="h6">
            포트폴리오 열람으로 방문하셨나요?
          </Typography>
          <Typography color="primary" variant="body2">
            귀한 시간 내주셔서 감사합니다! 데모 계정을 이용하시면 소셜 로그인을 거치지 않고 바로 포트폴리오를 확인하실 수 있습니다.
          </Typography>
        </Stack>
        <Button fullWidth size="large" variant="contained" onClick={() => signIn('credentials', { password: 'demo_account' })}>
          데모 계정 이용하기
        </Button>
      </Stack>
    </Stack>
  )
  return (
    <>
      {banner1}
      {banner2}
    </>
  )
}
