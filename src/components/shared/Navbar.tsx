import { AppBar, Toolbar, Container } from '@mui/material'
import { Stack2, Blank } from '@/styles/BaseStyles'
import { AccountMenu } from './Account'
import Link from 'next/link'
import Image from 'next/image'

export const NavBar = () => {
   return (
      <>
         <AppBar sx={{ bgcolor: 'Background', color: 'inherit' }} elevation={1}>
            <Container>
               <Toolbar>
                  <Link href={'/'}>
                     <Stack2 spacing={1}>
                        <Image src={'/memoleaf.svg'} alt="MEMOLEAF" width={120} height={20} style={{ width: 126, height: 21 }} priority={true} />
                     </Stack2>
                  </Link>
                  <Blank />

                  <AccountMenu />
               </Toolbar>
            </Container>
         </AppBar>
         <Toolbar />
      </>
   )
}
