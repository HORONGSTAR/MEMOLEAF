'use client'
import { useState } from 'react'
import { Button } from '@mui/material'
import { useSession, signOut } from 'next-auth/react'
import { LoginBox, Dialog, Menu, Avatar } from '@/components'
import { useRouter } from 'next/navigation'
import { Logout, PersonOutlineOutlined, SettingsOutlined } from '@mui/icons-material'
import { useAppSelector } from '@/store/hooks'

export default function Account() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { profile } = useAppSelector((state) => state.profile)
  const { data: session } = useSession()
  const myId = session?.user.id

  const dialogProps = {
    open,
    title: '소셜 로그인',
    onClose: () => setOpen(false),
  }

  if (!myId)
    return (
      <>
        <Button onClick={() => setOpen(true)}>로그인</Button>
        <Dialog {...dialogProps}>
          <LoginBox />
        </Dialog>
      </>
    )

  const meunItems = [
    {
      label: '내 계정',
      icon: <PersonOutlineOutlined fontSize="small" />,
      onClick: () => router.push(`/page/my/${myId}`),
    },
    {
      label: '설정',
      icon: <SettingsOutlined fontSize="small" />,
      onClick: () => router.push('/setting'),
    },
    {
      label: '로그아웃',
      icon: <Logout fontSize="small" />,
      onClick: () => signOut(),
    },
  ]

  return <Menu icon={<Avatar user={profile} />} label={`${profile?.name}님의 계정`} items={meunItems} />
}
