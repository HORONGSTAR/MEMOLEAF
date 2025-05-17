import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import { randomProfile, generateUserNum } from '@/lib/utills'
import prisma from '@/lib/prisma'
import { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
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

      const credit = {
        google: 'google' + profile?.sub,
        kakao: 'kakao' + profile?.id,
        naver: 'naver' + profile?.response?.id,
      }[key]

      if (credit) {
        const user = await prisma.user.findUnique({ where: { credit } })
        if (!user) {
          const { name, image } = randomProfile()
          const newUser = await prisma.user.create({ data: { credit, name, image } })

          const userNum = generateUserNum(newUser.id)

          await prisma.user.update({
            where: { id: newUser.id },
            data: { userNum },
          })

          token = {
            id: newUser.id,
            name: newUser.name,
            image: newUser.image,
          }
        } else {
          token = {
            id: user.id,
            name: user.name,
            image: user.image,
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (typeof token.id === 'number') {
        session.user.id = token.id
      }
      return session
    },
  },
}
