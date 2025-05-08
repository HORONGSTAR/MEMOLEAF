'use client'
import { useState } from 'react'
import { Button } from '@mui/material'
import { useSession, signOut } from 'next-auth/react'
import { LoginBox, Dialog, Menu, Avatar } from '@/components'
import { useRouter } from 'next/navigation'
import { Logout, PersonOutlineOutlined, SettingsOutlined } from '@mui/icons-material'

export default function Account() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

  const dialogProps = {
    open,
    actions: <Button onClick={() => setOpen(false)}>닫기</Button>,
    label: '소셜 로그인',
  }

  const meunItems = [
    {
      label: '내 계정',
      icon: <PersonOutlineOutlined fontSize="small" />,
      onClick: () => router.push('/page/my/' + user?.id),
    },
    {
      label: '설정',
      icon: <SettingsOutlined fontSize="small" />,
      onClick: () => router.push('/page/setting'),
    },
    {
      label: '로그아웃',
      icon: <Logout fontSize="small" />,
      onClick: () => signOut(),
    },
  ]

  return (
    <>
      {user ? <Menu icon={<Avatar user={user} />} label={'계정 메뉴'} items={meunItems} /> : <Button>로그인</Button>}
      <Dialog {...dialogProps}>
        <LoginBox />
      </Dialog>
    </>
  )
}
