'use client'
import { Logout, PersonOutlineOutlined, SettingsOutlined } from '@mui/icons-material'
import { useSession, signOut } from 'next-auth/react'
import { LoginBox, MyAvatar } from '@/components/auth'
import { Dialog, Menu } from '@/components/common'
import { checkOnOff } from '@/shared/utils/common'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@mui/material'

export default function Account() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const myId = session?.user.id || 0
  const isNotLogin = checkOnOff(myId, 0)

  const dialogProps = {
    open,
    title: '소셜 로그인',
    onClose: () => setOpen(false),
    closeLabel: '닫기',
  }
  const meunItems = [
    {
      label: '마이 페이지',
      icon: <PersonOutlineOutlined fontSize="small" />,
      onClick: () => router.push(`/page/my/${myId}`),
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

  const components = {
    on: (
      <>
        <Button onClick={() => setOpen(true)}>로그인</Button>
        <Dialog {...dialogProps}>
          <LoginBox />
        </Dialog>
      </>
    ),
    off: <Menu icon={<MyAvatar />} label={'내 계정'} items={meunItems} />,
  }[isNotLogin]

  return components
}
