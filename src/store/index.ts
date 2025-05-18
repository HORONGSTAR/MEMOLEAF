import { configureStore } from '@reduxjs/toolkit'
import profileSlice from './slices/profileSlice'
import memoSlice from './slices/memoSlice'

export const store = configureStore({
  reducer: {
    profile: profileSlice,
    memo: memoSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
