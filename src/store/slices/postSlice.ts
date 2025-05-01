import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMemos, createMemo, updateMemo, deleteMemo } from '@/lib/api/postApi'
import { Memo, Params } from '@/lib/types'

interface Memos {
  memos: Memo[]
  page: number
  total: number
}

export const getMemosThunk = createAsyncThunk<Memos, Params>('memo/getMemos', async ({ page }) => {
  try {
    return await getMemos({ page })
  } catch (error) {
    console.error(error || '메모 조회 실패')
  }
})

export const createMemoThunk = createAsyncThunk<Memo, Params>('memo/createMemo', async (params) => {
  try {
    const memo = await createMemo(params)
    return memo
  } catch (error) {
    console.error(error || '메모 작성 실패')
  }
})

export const updateMemoThunk = createAsyncThunk<Memo, Params>('memo/updateMemo', async (params) => {
  try {
    return await updateMemo(params)
  } catch (error) {
    console.error(error || '메모 수정 실패')
  }
})

export const deleteMemoThunk = createAsyncThunk<Memo, Params>('memo/deleteMemo', async (params) => {
  try {
    return await deleteMemo(params)
  } catch (error) {
    console.error(error || '메모 삭제 실패')
  }
})

interface State {
  memos: Memo[] | []
  page: number
  total: number
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: State = {
  memos: [],
  page: 1,
  total: 1,
  status: 'idle',
}

export const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMemosThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getMemosThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.memos = action.payload.memos
        state.page = action.payload.page
        state.total = action.payload.total
      })
      .addCase(getMemosThunk.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(createMemoThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(createMemoThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.memos = [action.payload, ...state.memos]
      })
      .addCase(createMemoThunk.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(updateMemoThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateMemoThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        for (const i in state.memos) {
          if (state.memos[i].id === action.payload.id) {
            console.log(action.payload)
            state.memos[i] = { ...state.memos[i], ...action.payload }
          }
        }
      })
      .addCase(updateMemoThunk.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(deleteMemoThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(deleteMemoThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.memos = state.memos?.filter((memo) => memo.id !== action.payload.id)
      })
      .addCase(deleteMemoThunk.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default memoSlice.reducer
