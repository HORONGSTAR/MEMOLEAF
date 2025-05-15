import { configureStore } from '@reduxjs/toolkit'
import memoSlice from './slices/memoSlice'
import authSlice from './slices/authSlice'

export const store = configureStore({
  reducer: {
    memo: memoSlice,
    auth: authSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
