import { configureStore } from '@reduxjs/toolkit'
import memoSlice from './slices/postSlice'

export const store = configureStore({
  reducer: {
    memo: memoSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
