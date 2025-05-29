import { Dialog, DialogTitle, DialogContent, DialogActions, Button, DialogProps } from '@mui/material'

import { ReactNode } from 'react'

interface Props extends DialogProps {
  open: boolean
  title: string
  closeLabel?: string
  actionLabel?: string
  onClose?: () => void
  onAction?: () => void
  children?: ReactNode
}

export default function DialogBox(props: Props) {
  const { open, closeLabel, actionLabel, onClose, onAction, children, title } = props

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {closeLabel && <Button onClick={onClose}>{closeLabel}</Button>}
        {actionLabel && (
          <Button color="error" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
