'use client'
import { IconButton, Menu as MuiMenu, MenuItem, ListItemIcon, ListItemText } from '@mui/material'
import { useState } from 'react'
import { BasicProps } from '@/lib/types'

interface ItmeProps extends BasicProps {
  isBlind?: boolean
  onClick: () => void
}

interface Props extends BasicProps {
  items: ItmeProps[]
}

export default function Menu(props: Props) {
  const { label, icon, items } = props
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

      <MuiMenu
        id={label}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: { elevation: 3 },
          list: { 'aria-labelledby': label },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {items.map((item) =>
          item.isBlind ? null : (
            <MenuItem key={item.label} onClick={item.onClick}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </MenuItem>
          )
        )}
      </MuiMenu>
    </>
  )
}
