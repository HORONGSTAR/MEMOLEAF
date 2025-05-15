import { AppBar, Toolbar, Container, IconButton } from '@mui/material'
import { Blank, Account } from '@/components'
import Link from 'next/link'
import Image from 'next/image'
import { Search } from '@mui/icons-material'

export default function Navbar() {
  return (
    <AppBar sx={{ bgcolor: 'Background', color: 'inherit' }} elevation={1}>
      <Container>
        <Toolbar>
          <Link href={'/'}>
            <Image src={'/memoleaf.svg'} alt="MEMOLEAF" aria-label="메모리프 홈" width={120} height={20} priority />
          </Link>
          <Blank />
          <IconButton size="small" component={Link} href="/search">
            <Search fontSize="small" />
          </IconButton>
          <Account />
        </Toolbar>
      </Container>
    </AppBar>
  )
}
