import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { ReactNode } from 'react'
import { BasicProps } from '@/lib/types'

interface Props extends BasicProps {
  open: boolean
  actions?: ReactNode
}

export default function Dialog(props: Props) {
  const { open, actions, children, label } = props

  return (
    <>
      <MuiDialog open={open}>
        <DialogTitle>{label}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>{actions}</DialogActions>
      </MuiDialog>
    </>
  )
}
