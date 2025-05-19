'use client'

import { ReactNode, useCallback, useState } from 'react'
import { Popover, IconButton, Box, Dialog, useMediaQuery, AppBar, Toolbar, Typography } from '@mui/material'
import { theme } from '@/styles/MuiTheme'
import { Close } from '@mui/icons-material'
import { Blank } from '@/components'

interface Props {
  icon: ReactNode
  children: ReactNode
  addEvent?: () => void
  label: string
}

export default function CommentPopover({ children, icon, label, addEvent }: Props) {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
      if (addEvent) addEvent()
    },
    [addEvent]
  )
  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const itemId = open ? label + '열기' : undefined

  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <>
      <IconButton onClick={handleClick} aria-describedby={itemId} sx={{ position: 'relative' }}>
        {icon}
      </IconButton>

      {isMobile ? (
        <Dialog open={open} onClose={handleClose} fullScreen>
          <AppBar position="static" color="secondary">
            <Toolbar>
              <Typography variant="h6" color="primary">
                {label}
              </Typography>
              <Blank />
              <IconButton edge="end" color="primary" onClick={handleClose}>
                <Close />
              </IconButton>
            </Toolbar>
          </AppBar>
          {children}
        </Dialog>
      ) : (
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          sx={{
            '& .MuiPaper-root': {
              p: 1,
              borderRadius: 2,
              minWidth: 320,
              maxWidth: 380,
              maxHeight: 480,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <Box sx={{ overflow: 'auto', flex: 1, height: 300 }}>{children}</Box>
        </Popover>
      )}
    </>
  )
}
