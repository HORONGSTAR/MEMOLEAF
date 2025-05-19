import { AppBar, Toolbar, Container, IconButton } from '@mui/material'
import { Blank, Account, AlarmBox } from '@/components'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from '@mui/icons-material'

export default function Navbar() {
  return (
    <AppBar sx={{ bgcolor: 'Background', color: 'inherit' }} elevation={1}>
      <Container>
        <Toolbar sx={{ p: 1 }}>
          <Link href={'/'}>
            <Image src={'/memoleaf.svg'} alt="MEMOLEAF" aria-label="메모리프 홈" width={120} height={20} priority />
          </Link>
          <Blank />
          <IconButton component={Link} href="/page/search">
            <Search />
          </IconButton>
          <AlarmBox />
          <Account />
        </Toolbar>
      </Container>
    </AppBar>
  )
}
