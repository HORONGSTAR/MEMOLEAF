import { AlertColor, AlertPropsColorOverrides } from '@mui/material'
import { OverridableStringUnion } from '@mui/types'
import { createSlice } from '@reduxjs/toolkit'

interface State {
  message: string
  open?: boolean
  severity?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>
}

const initialState: State = {
  message: '',
  open: false,
  severity: 'success',
}

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    openAlert: (state, action: { payload: State }) => {
      state.message = action.payload.message
      state.severity = action.payload.severity || 'success'
      state.open = true
    },
    closeAlert: (state) => {
      state.open = false
      state.severity = 'success'
      state.message = ''
    },
  },
})

export const { openAlert, closeAlert } = alertSlice.actions
export default alertSlice.reducer
