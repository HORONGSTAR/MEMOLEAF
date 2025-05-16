'use client'
import { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { useSession, signOut } from 'next-auth/react'
import { LoginBox, Dialog, Menu, Avatar } from '@/components'
import { useRouter } from 'next/navigation'
import { Logout, PersonOutlineOutlined, SettingsOutlined } from '@mui/icons-material'
import { getUserThunk } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'

export default function Account() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const { data: session } = useSession()
  const auth = session?.user
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (auth) dispatch(getUserThunk(auth.id))
  }, [dispatch, auth])

  const dialogProps = {
    open,
    title: '소셜 로그인',
    onClose: () => setOpen(false),
  }

  if (!auth)
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
      onClick: () => router.push('/my/' + user?.id),
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

  return <Menu icon={<Avatar user={user} />} label={`${user?.name}님의 계정`} items={meunItems} />
}
