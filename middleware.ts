// middleware.ts
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // API 라우트 보호
    if (pathname.startsWith('/api/protected')) {
      if (!token) {
        return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
      }

      // 역할 기반 API 접근 제어
      if (pathname.startsWith('/api/protected/admin') && token.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
      }
    }

    // 페이지 라우트 보호
    if (pathname.startsWith('/dashboard') && !token) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // API 라우트는 미들웨어 함수에서 처리
        if (pathname.startsWith('/api/protected')) {
          return true // 미들웨어 함수가 실행되도록 허용
        }

        // 공개 API는 토큰 체크 안함
        if (pathname.startsWith('/api/public')) {
          return true
        }

        // 보호된 페이지는 토큰 필요
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
          return !!token
        }

        return true
      },
    },
  }
)

export const config = {
  matcher: [
    // API 라우트
    '/api/protected/:path*',
    // 보호된 페이지
    '/dashboard/:path*',
    '/admin/:path*',
    '/profile/:path*',
    // 기타 보호가 필요한 경로들
    '/((?!api/auth|api/public|_next/static|_next/image|favicon.ico|login|register).*)',
  ],
}
