import 'next-auth'

declare module 'next-auth' {
  interface Profile {
    id?: number
    sub?: string
    response?: { id: string }
  }

  interface Session {
    user: {
      id: number
      name?: string | null
      image?: string | unknown
      userNum?: number | unknown
    }
  }

  interface DefaultUser {
    id: number
    name?: string
    image?: string
    userNum?: number | unknown
  }
}
