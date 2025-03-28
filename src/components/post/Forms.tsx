'use client'
import { TextField, Button, Stack } from '@mui/material'
import { Blank, Stack2 } from '@/styles/BaseStyles'
import { useMemo } from 'react'
import { signupUser, loginUser } from '@/lib/fetchData'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

type LoginData = { email: string; password: string }
type SignUpData = LoginData & { name: string; pwConfirm: string }
type memoData = { content: string }

const loginSchema = z.object({
   email: z.string().email('올바른 이메일 형식이 아닙니다.'),
   password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
})

const signUpSchema = z
   .object({
      name: z.string().max(12, '이름은 최대 12자까지 입력할 수 있습니다.'),
      email: z.string().email('올바른 이메일 형식이 아닙니다.'),
      password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다.'),
      pwConfirm: z.string(),
   })
   .refine((data) => data.password === data.pwConfirm, {
      message: '비밀번호가 일치하지 않습니다.',
      path: ['pwConfirm'],
   })

const memoSchema = z.object({
   content: z.string(),
})

export const LoginForm = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginData>({ resolver: zodResolver(loginSchema) })

   const props = useMemo(
      () => ({
         email: { error: errors.email && true, helperText: errors.email?.message || ' ' },
         password: { error: errors.password && true, helperText: errors.password?.message || ' ' },
      }),
      [errors]
   )

   const onSubmit = (data: LoginData) => {
      loginUser(data)
   }

   return (
      <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
         <TextField {...register('email')} label="이메일" {...props.email} />
         <TextField {...register('password')} label="비밀번호" type="password" {...props.password} />
         <Stack2>
            <Blank />
            <Button variant="contained" type="submit">
               로그인
            </Button>
         </Stack2>
      </Stack>
   )
}

export const SignUpForm = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<SignUpData>({
      resolver: zodResolver(signUpSchema),
   })

   const onSubmit = (data: SignUpData) => {
      signupUser(data)
   }

   const props = useMemo(
      () => ({
         name: { error: errors.name && true, helperText: errors.name?.message || ' ' },
         email: { error: errors.email && true, helperText: errors.email?.message || ' ' },
         password: { error: errors.password && true, helperText: errors.password?.message || ' ' },
         pwConfirm: { error: errors.pwConfirm && true, helperText: errors.pwConfirm?.message || ' ' },
      }),
      [errors]
   )

   return (
      <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
         <TextField {...register('name')} label="이름" {...props.name} />
         <TextField {...register('email')} label="이메일" {...props.email} />
         <TextField {...register('password')} label="비밀번호" type="password" {...props.password} />
         <TextField {...register('pwConfirm')} label="비밀번호 확인" type="password" {...props.pwConfirm} />
         <Stack2>
            <Blank />
            <Button variant="contained" type="submit">
               회원가입
            </Button>
         </Stack2>
      </Stack>
   )
}

export const PostForm = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<memoData>({ resolver: zodResolver(memoSchema) })

   const onSubmit = (data: memoData) => {
      console.log('메모 등록:', data)
   }

   const props = useMemo(
      () => ({
         content: { error: errors.content && true, helperText: errors.content?.message || ' ' },
      }),
      [errors]
   )

   return (
      <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
         <TextField {...register('content')} label="내용" {...props.content} />
         <Stack2>
            <Blank />
            <Button variant="contained" type="submit">
               작성
            </Button>
         </Stack2>
      </Stack>
   )
}
