'use client'
import { Alert, Snackbar } from '@mui/material'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { useCallback } from 'react'
import { closeAlert } from '@/store/slices/alertSlice'

export default function AlertBox() {
  const { message, severity, open } = useAppSelector((state) => state.alert)

  const dispatch = useAppDispatch()
  const handleClose = useCallback(() => {
    dispatch(closeAlert())
  }, [dispatch])

  return (
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}
