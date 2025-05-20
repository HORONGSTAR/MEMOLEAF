'use client'
import { IconButton, Menu as MuiMenu, MenuItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material'
import { ReactNode, useState } from 'react'
import { BasicProps, OnOff } from '@/lib/types'

interface ItmeProps extends BasicProps {
  active?: OnOff
  onClick: () => void
}

interface Props {
  items: ItmeProps[]
  label: string
  icon: ReactNode
}

export default function Menu(props: Props) {
  const { label, icon, items } = props
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  return (
    <>
      <Tooltip title={label}>
        <IconButton
          size="small"
          aria-label={label}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-controls={open ? label : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          {icon}
        </IconButton>
      </Tooltip>
      <MuiMenu
        id={label}
        anchorEl={anchorEl}
        open={open}
        onClick={() => setAnchorEl(null)}
        slotProps={{
          paper: { elevation: 3 },
          list: { 'aria-labelledby': label },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {items.map(
          (item) =>
            ({
              on: (
                <MenuItem key={item.label} onClick={item.onClick}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText>{item.label}</ListItemText>
                </MenuItem>
              ),
              off: null,
            }[item.active || 'on'])
        )}
      </MuiMenu>
    </>
  )
}
