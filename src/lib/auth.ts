import GoogleProvider from 'next-auth/providers/google'
import KakaoProvider from 'next-auth/providers/kakao'
import NaverProvider from 'next-auth/providers/naver'
import CredentialsProvider from 'next-auth/providers/credentials'
import { generateRandomProfile, generateUserNum } from '@/shared/utils/create'
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
    CredentialsProvider({
      credentials: {
        password: {
          label: '열람 인증',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (credentials?.password === 'demo_account') {
          return {
            id: 'demo_portfolio',
          }
        }
        return null
      },
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
        credentials: 'demo_portfolio',
      }[key]

      if (credit) {
        const user = await prisma.user.findUnique({ where: { credit } })
        if (!user) {
          const { name, image } = generateRandomProfile()
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
            userNum: newUser.userNum,
          }
        } else {
          token = {
            id: user.id,
            name: user.name,
            image: user.image,
            userNum: user.userNum,
          }
        }
      }
      return token
    },
    async session({ session, token }) {
      if (typeof token.id === 'number') {
        session.user.id = token.id
        session.user.name = token.name
        session.user.image = token.image
        session.user.userNum = token.userNum
      }

      return session
    },
  },
}
