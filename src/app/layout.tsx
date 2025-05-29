import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import { ThemeProvider } from '@mui/material'
import { theme } from '@/styles/MuiTheme'
import Providers from '@/lib/Providers'
import SplashScreen from '@/components/shared/SplashScreen'
import './globals.css'

export const notoSans = Noto_Sans_KR({
  variable: '--font-noto-sans',
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MEMOLEAF',
  description: '가볍게 기록하는 공간',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSans.variable} antialiased`}>
        <Providers>
          <ThemeProvider theme={theme}>
            <SplashScreen>{children}</SplashScreen>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
