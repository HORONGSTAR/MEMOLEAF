import { AppBar, Toolbar, Container, Stack } from '@mui/material'
import { Blank, Account } from '@/components'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  return (
    <AppBar sx={{ bgcolor: 'Background', color: 'inherit' }} elevation={1}>
      <Container>
        <Toolbar>
          <Link href={'/'}>
            <Stack direction="row" spacing={1}>
              <Image
                src={'/memoleaf.svg'}
                alt="MEMOLEAF"
                width={120}
                height={20}
                style={{ width: 126, height: 21 }}
                priority={true}
              />
            </Stack>
          </Link>
          <Blank />
          <Account />
        </Toolbar>
      </Container>
    </AppBar>
  )
}
