'use client'
import { AppBar, Toolbar, Container, Box, IconButton, Badge } from '@mui/material'
import Account from '@/components/auth/Account'
import Image from 'next/image'
import { Notifications, Search } from '@mui/icons-material'
import Link from 'next/link'

export default function Navbar({ count }: { count: number }) {
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
            <IconButton aria-label="알림 페이지" component={Link} href="/page/notifications">
              <Badge aria-controls="" badgeContent={count} color="primary" max={99}>
                <Notifications />
              </Badge>
            </IconButton>
            <Account />
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar sx={{ mb: 4 }} />
    </>
  )
}
