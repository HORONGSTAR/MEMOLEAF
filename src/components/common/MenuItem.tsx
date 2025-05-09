import { ListItemIcon, ListItemText, MenuItem as MuiMenuItem } from '@mui/material'
import { BasicProps } from '@/lib/types'
import { ReactNode } from 'react'

interface Props extends BasicProps {
  active: 'on' | 'off'
  onClick: () => void
}

type Item = { [key: string]: ReactNode }

export default function MenuItem(props: Props) {
  const { active, label, icon, onClick } = props

  const item: Item = {
    on: (
      <MuiMenuItem onClick={onClick}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText>{label}</ListItemText>
      </MuiMenuItem>
    ),
    off: null,
  }

  return item[active]
}
