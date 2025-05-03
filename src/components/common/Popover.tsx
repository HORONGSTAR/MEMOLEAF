'use client'
import { Props } from '@/lib/types'
import { Popover as MuiPopover, IconButton } from '@mui/material'
import { useState } from 'react'

export default function Popover(props: Props) {
  const { label, children, icon } = props
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? label : undefined

  return (
    <div>
      <IconButton aria-describedby={id} onClick={handleClick}>
        {icon}
      </IconButton>
      <MuiPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {children}
      </MuiPopover>
    </div>
  )
}
