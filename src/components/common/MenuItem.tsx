'use client'
import { ListItemIcon, MenuItem as MuiMenuItem } from '@mui/material'
import { Props } from '@/lib/types'

export default function MenuItem(props: Props) {
  const { isBlind, label, icon, onClick } = props

  const item = (
    <MuiMenuItem onClick={onClick}>
      <ListItemIcon>{icon}</ListItemIcon>
      {label}
    </MuiMenuItem>
  )

  return isBlind ? null : item
}
