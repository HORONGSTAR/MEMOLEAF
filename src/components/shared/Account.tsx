'use client'
import * as React from 'react'
import { MenuItem } from '@mui/material'
import { ModalBox, MenuBox, UserAvatar } from '@/styles/BaseStyles'
import { useSession, signOut } from 'next-auth/react'
import { LoginBox } from '../auth/Login'
import Link from 'next/link'

export const AccountMenu = () => {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <>
      {user ? (
        <MenuBox icon={<UserAvatar user={user} />} label={'account-menu'}>
          <Link href={`/page/my/${user?.id}`}>
            <MenuItem>내 계정</MenuItem>
          </Link>
          <Link href={'/page/setting'}>
            <MenuItem>설정</MenuItem>
          </Link>
          <MenuItem onClick={() => signOut()}>로그아웃</MenuItem>
        </MenuBox>
      ) : (
        <ModalBox label="로그인" title="소셜 로그인">
          <LoginBox />
        </ModalBox>
      )}
    </>
  )
}
