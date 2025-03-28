const URL = process.env.NEXTAPI_URL

type LoginData = {
   email: string
   password: string
}
type SignUpData = LoginData & {
   name: string
   pwConfirm: string
}

export const signupUser = async (data: SignUpData) => {
   const res = await fetch(`${URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
   })
   if (!res.ok) throw new Error('회원가입 중 에러')
   return res.json()
}
