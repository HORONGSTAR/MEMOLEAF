// store.ts
import { configureStore } from '@reduxjs/toolkit'
import { memoSlice } from './slices/postSlice'

// store 만들기
export const store = configureStore({
  reducer: {
    memo: memoSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
