'use client'
import {
  Container,
  Stack,
  StackProps,
  Box,
  BoxProps,
  Button,
  IconButton,
  Menu,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import { useState } from 'react'
import { Props } from '@/lib/types'
import { ReactNode } from 'react'

export const UserAvatar = (props: Props) => {
  return (
    <Avatar
      variant={props.variant}
      sx={{ width: props.size || 32, height: props.size || 32 }}
      src={`${process.env.NEXT_PUBLIC_IMG_URL}/uploads${props.user?.image || ''}`}
      alt={`${props.user?.name}프로필 사진`}
    />
  )
}

interface ReturnBoxProps {
  state: 'idle' | 'loading' | 'succeeded' | 'failed'
  component: ReactNode
}

export const ReturnBox = (props: ReturnBoxProps) => {
  const components = { idle: null, loading: <CircularProgress />, succeeded: props.component, failed: null }
  return components[props.state]
}

export const Wrap = (props: Props) => {
  return (
    <Container maxWidth={props.maxWidth} sx={{ p: 2 }}>
      <Stack spacing={props.spacing}>{props.children}</Stack>
    </Container>
  )
}

export const Stack2 = (props: StackProps) => {
  return <Stack {...props} direction={'row'} />
}

export const Blank = (props: BoxProps) => {
  return <Box {...props} flexGrow={1} />
}

export const ModalBox = ({ label, title, children }: Props) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <Dialog open={open}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>취소</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export const MenuBox = ({ label, icon, children }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{ ml: 2 }}
        aria-controls={open ? label : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        {icon}
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id={label}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 3,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {children}
      </Menu>
    </>
  )
}
