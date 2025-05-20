import { AppBar, Toolbar, Container, IconButton } from '@mui/material'
import { Blank, Account, AlarmBox } from '@/components'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from '@mui/icons-material'

export default function Navbar() {
  return (
    <AppBar sx={{ bgcolor: 'Background', color: 'inherit' }} elevation={1}>
      <Container aria-label="헤더">
        <Toolbar sx={{ p: 1 }}>
          <Link href={'/'} aria-label="MEMOLEAF">
            <Image src={'/memoleaf.svg'} alt="MEMOLEAF" width={120} height={20} priority />
          </Link>
          <Blank />
          <IconButton aria-label="검색 페이지" component={Link} href="/page/search">
            <Search />
          </IconButton>
          <AlarmBox />
          <Account />
        </Toolbar>
      </Container>
    </AppBar>
  )
}
