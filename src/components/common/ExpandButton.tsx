'use client'
import { Button, ButtonProps } from '@mui/material'

export default function ExpandButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      sx={{
        borderRadius: 20,
        minWidth: 40,
        minHeight: 40,
        px: 1.5,
        whiteSpace: 'nowrap',
        '& .label': { opacity: 0, width: 0, transition: 'all 0.2s ease' },
        '&:hover .label': { opacity: 1, width: 'auto', marginLeft: 1 },
      }}
    />
  )
}
