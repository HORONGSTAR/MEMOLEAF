'use client'
import * as React from 'react'
import { MenuItem } from '@mui/material'
import { useSession, signOut } from 'next-auth/react'
import { LoginBox, Modal, Menu, Avatar } from '@/components'
import Link from 'next/link'

export default function Account() {
  const { data: session } = useSession()
  const user = session?.user

  return (
    <>
      {user ? (
        <Menu icon={<Avatar user={user} />} label={'account-menu'}>
          <Link href={`/page/my/${user?.id}`}>
            <MenuItem>내 계정</MenuItem>
          </Link>
          <Link href={'/page/setting'}>
            <MenuItem>설정</MenuItem>
          </Link>
          <MenuItem onClick={() => signOut()}>로그아웃</MenuItem>
        </Menu>
      ) : (
        <Modal label="로그인" title="소셜 로그인">
          <LoginBox />
        </Modal>
      )}
    </>
  )
}
