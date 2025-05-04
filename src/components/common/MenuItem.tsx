'use client'
import { ListItemIcon, MenuItem as MuiMenuItem } from '@mui/material'
import { BasicProps } from '@/lib/types'

interface Props extends BasicProps {
  isBlind?: boolean
  onClick: () => void
}

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
