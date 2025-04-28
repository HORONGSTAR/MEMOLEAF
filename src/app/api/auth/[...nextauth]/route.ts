import NextAuth from 'next-auth/next'
import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import { randomProfile } from '@/lib/utills'
import prisma from '@/lib/prisma'

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
      NaverProvider({
         clientId: process.env.NAVER_CLIENT_ID as string,
         clientSecret: process.env.NAVER_CLIENT_SECRET as string,
      }),
   ],
   pages: { signIn: '/page/account/login' },
   callbacks: {
      async redirect({ baseUrl }) {
         return baseUrl
      },
      async jwt({ token, profile, account }) {
         const key = account ? account.provider : 'none'

         const credits = {
            google: 'google' + profile?.sub,
            kakao: 'kakao' + profile?.id,
            naver: 'naver' + profile?.response?.id,
         }[key]

         if (credits) {
            const user = await prisma.user.findUnique({ where: { credits } })
            if (!user) {
               const { name, image } = randomProfile()
               const newUser = await prisma.user.create({ data: { credits, name, image } })
               token = { id: newUser.id, name: newUser.name, image: newUser.image }
            } else {
               token = { id: user.id, name: user.name, image: user.image }
            }
         }

         return token
      },
      async session({ session, token }) {
         if (typeof token.id === 'number') {
            session.user.id = token.id

            session.user.image = `${token.image}`
         }
         return session
      },
   },
})

export { handler as GET, handler as POST }
