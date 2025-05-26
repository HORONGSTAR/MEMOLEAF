import { AppBar, Toolbar, Container, IconButton, Box } from '@mui/material'
import { Account } from '@/components/auth'
import { Search } from '@mui/icons-material'
import AlarmBox from '@/components/shared/AlarmBox'
import Link from 'next/link'

export default function Navbar() {
  return (
    <AppBar sx={{ bgcolor: 'Background', color: 'inherit' }} elevation={1}>
      <Container aria-label="헤더">
        <Toolbar sx={{ p: 1 }}>
          <Link href={'/'} aria-label="MEMOLEAF">
            <img src={'/memoleaf.svg'} alt="MEMOLEAF" width={120} height={20} />
          </Link>
          <Box flexGrow={1} />
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
