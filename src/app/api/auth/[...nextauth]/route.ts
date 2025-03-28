import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'

const handler = NextAuth({
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID as string,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      }),
      KakaoProvider({
         clientId: process.env.KAKAO_CLIENT_ID as string,
         clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      }),
      CredentialsProvider({
         name: 'Credentials',
         credentials: {
            email: { type: 'text' },
            password: { type: 'password' },
         },
         async authorize(credentials) {
            const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/login`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(credentials),
            })

            const user = await res.json()
            return user || null
         },
      }),
   ],
   pages: { signIn: '/page/account/login' },
})

export { handler as GET, handler as POST }
