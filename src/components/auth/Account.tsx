'use client'
import { Menu, MenuItem, ListItemIcon, Button, Tooltip, IconButton, Avatar } from '@mui/material'
import { Logout, PersonOutlineOutlined, SettingsOutlined } from '@mui/icons-material'
import { useSession, signOut } from 'next-auth/react'
import { checkOnOff, imgPath } from '@/shared/utils/common'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DialogBox from '@/components/common/DialogBox'
import LoginBox from '@/components/auth/LoginBox'
import { useAppSelector } from '@/store/hooks'

export default function Account() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: session } = useSession()
  const myId = session?.user.id || 0
  const { profile } = useAppSelector((state) => state.profile)

  const isNotLogin = checkOnOff(myId, 0)
  const menuOpen = Boolean(anchorEl)

  const dialogProps = {
    open: dialogOpen,
    title: '소셜 로그인',
    onClose: () => setDialogOpen(false),
    closeLabel: '닫기',
  }

  const label = '내 계정'

  const loginButton = (
    <>
      <Button onClick={() => setDialogOpen(true)}>로그인</Button>
      <DialogBox {...dialogProps}>
        <LoginBox />
      </DialogBox>
    </>
  )

  const myMeunButton = (
    <Tooltip title={label}>
      <IconButton
        size="small"
        aria-label={label}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-controls={menuOpen ? label : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
      >
        <Avatar sx={{ width: 32, height: 32 }} src={imgPath + profile?.image} alt={`${profile?.name}의 계정`} />
      </IconButton>
    </Tooltip>
  )

  const myMeun = (
    <>
      {myMeunButton}
      <Menu
        id={label}
        anchorEl={anchorEl}
        open={menuOpen}
        onClick={() => setAnchorEl(null)}
        slotProps={{
          paper: { elevation: 3 },
          list: { 'aria-labelledby': label },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem dense onClick={() => router.push(`/page/profile/${myId}`)}>
          <ListItemIcon>
            <PersonOutlineOutlined fontSize="small" />
          </ListItemIcon>
          마이페이지
        </MenuItem>
        <MenuItem dense onClick={() => router.push('/page/setting')}>
          <ListItemIcon>
            <SettingsOutlined fontSize="small" />
          </ListItemIcon>
          설정
        </MenuItem>
        <MenuItem dense onClick={() => signOut()}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          로그아웃
        </MenuItem>
      </Menu>
    </>
  )

  return { on: loginButton, off: <>{myMeun}</> }[isNotLogin]
}
