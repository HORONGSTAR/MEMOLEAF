import { AppBar, Toolbar, Container, Box } from '@mui/material'
import Account from '@/components/auth/Account'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function Navbar({ children }: { children?: ReactNode }) {
  return (
    <>
      <AppBar sx={{ bgcolor: 'Background', color: 'inherit' }} elevation={1}>
        <Container aria-label="헤더">
          <Toolbar sx={{ p: 1 }}>
            <Link href={'/'} aria-label="MEMOLEAF">
              <img src={'/memoleaf.svg'} alt="MEMOLEAF" width={120} height={20} />
            </Link>
            <Box flexGrow={1} />
            {children}
            <Account />
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar sx={{ mb: 4 }} />
    </>
  )
}
