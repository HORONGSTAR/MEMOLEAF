'use client'
import { Logout, PersonOutlineOutlined, SettingsOutlined } from '@mui/icons-material'
import { useSession, signOut } from 'next-auth/react'
import { checkOnOff, imgPath } from '@/shared/utils/common'
import { useState } from 'react'
import { Button, Menu, MenuItem, Tooltip, IconButton, ListItemIcon, ListItemText, Avatar } from '@mui/material'
import Dialog from '@/components/common/Dialog'
import LoginBox from '@/components/auth/LoginBox'
import { useRouter } from 'next/navigation'

export default function Account() {
  const router = useRouter()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { data: session } = useSession()
  const myId = session?.user.id || 0
  const isNotLogin = checkOnOff(myId, 0)

  const menuOpen = Boolean(anchorEl)

  const dialogProps = {
    open: dialogOpen,
    title: '소셜 로그인',
    onClose: () => setDialogOpen(false),
    closeLabel: '닫기',
  }

  const label = '내 계정'

  const components = {
    on: (
      <>
        <Button onClick={() => setDialogOpen(true)}>로그인</Button>
        <Dialog {...dialogProps}>
          <LoginBox />
        </Dialog>
      </>
    ),
    off: (
      <>
        <Tooltip title={label}>
          <IconButton
            size="small"
            aria-label={label}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            aria-controls={menuOpen ? label : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }} src={imgPath + session?.user.image} alt={`${session?.user.name}프로필 사진`} />
          </IconButton>
        </Tooltip>
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
            <ListItemText>마이페이지</ListItemText>
          </MenuItem>
          <MenuItem dense onClick={() => router.push('/page/setting')}>
            <ListItemIcon>
              <SettingsOutlined fontSize="small" />
            </ListItemIcon>
            <ListItemText>설정</ListItemText>
          </MenuItem>
          <MenuItem dense onClick={() => signOut()}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            <ListItemText>로그아웃</ListItemText>
          </MenuItem>
        </Menu>
      </>
    ),
  }[isNotLogin]

  return components
}
