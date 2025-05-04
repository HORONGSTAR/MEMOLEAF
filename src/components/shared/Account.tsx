'use client'
import { useState } from 'react'
import { MenuItem, Button } from '@mui/material'
import { useSession, signOut } from 'next-auth/react'
import { LoginBox, Dialog, Menu, Avatar } from '@/components'
import Link from 'next/link'

export default function Account() {
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

  const dialogProps = {
    open,
    actions: <Button onClick={() => setOpen(false)}>닫기</Button>,
    label: '소셜 로그인',
  }

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
        <Button>로그인</Button>
      )}
      <Dialog {...dialogProps}>
        <LoginBox />
      </Dialog>
    </>
  )
}
