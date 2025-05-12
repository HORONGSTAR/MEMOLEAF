import { configureStore } from '@reduxjs/toolkit'
import memoSlice from './slices/memoSlice'
import userSlice from './slices/userSlice'

export const store = configureStore({
  reducer: {
    memo: memoSlice,
    user: userSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
