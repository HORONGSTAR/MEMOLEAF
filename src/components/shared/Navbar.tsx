'use client'
import { AppBar, Toolbar, Container, Box, IconButton } from '@mui/material'
import Account from '@/components/auth/Account'
import Image from 'next/image'
import { Search } from '@mui/icons-material'
import AlarmBox from './AlarmBox'
import Link from 'next/link'
import { AlarmData } from '@/shared/types/client'

export default function Navbar({ alarms }: AlarmData) {
  return (
    <>
      <AppBar sx={{ bgcolor: 'Background', color: 'inherit' }} elevation={1}>
        <Container aria-label="헤더">
          <Toolbar sx={{ p: 1 }}>
            <Link href={'/'}>
              <Image src={'/memoleaf.svg'} alt="MEMOLEAF" width={120} height={20} />
            </Link>{' '}
            <Box flexGrow={1} />
            <IconButton aria-label="검색 페이지" component={Link} href="/page/search">
              <Search />
            </IconButton>
            <AlarmBox alarms={alarms} />
            <Account />
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar sx={{ mb: 4 }} />
    </>
  )
}
