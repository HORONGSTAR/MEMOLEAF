import { configureStore } from '@reduxjs/toolkit'
import profileSlice from './slices/profileSlice'
import alertSlice from './slices/alertSlice'

export const store = configureStore({
  reducer: {
    profile: profileSlice,
    alert: alertSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
