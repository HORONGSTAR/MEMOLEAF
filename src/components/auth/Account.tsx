'use client'
import { useState } from 'react'
import { Button } from '@mui/material'
import { useSession, signOut } from 'next-auth/react'
import { Dialog, Menu } from '@/components/common'

import LoginBox from './LoginBox'
import MyAvatar from './MyAvatar'
import { useRouter } from 'next/navigation'
import { Logout, PersonOutlineOutlined, SettingsOutlined } from '@mui/icons-material'
import { checkCurrentOnOff } from '@/lib/utills'
import { OnOffItem } from '@/lib/types'

export default function Account() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const myId = session?.user.id || 0
  const isNotLogin = checkCurrentOnOff(myId, 0)

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

  const components: OnOffItem = {
    on: (
      <>
        <Button onClick={() => setOpen(true)}>로그인</Button>
        <Dialog {...dialogProps}>
          <LoginBox />
        </Dialog>
      </>
    ),
    off: <Menu icon={<MyAvatar />} label={'내 계정'} items={meunItems} />,
  }

  return components[isNotLogin]
}
