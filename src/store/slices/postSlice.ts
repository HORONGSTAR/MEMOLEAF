import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMemo, createMemo, updateMemo, deleteMemo } from '@/lib/fetchData'
import { Memo } from '@/lib/types'

export const getMemoThunk = createAsyncThunk<Memo[], { page: string; limit: string }>(
  'memo/getMemo',
  async ({ page, limit }) => {
    try {
      return await getMemo(page, limit)
    } catch (error) {
      console.error(error || '게시글 가져오기 실패')
    }
  }
)

export const createMemoThunk = createAsyncThunk<Memo, { userId: number; content: string }>(
  'memo/createMemo',
  async ({ userId, content }) => {
    try {
      return await createMemo(userId, content)
    } catch (error) {
      console.error(error || '게시글 가져오기 실패')
    }
  }
)

export const updateMemoThunk = createAsyncThunk<Memo, { memoId: number; content: string }>(
  'memo/updateMemo',
  async ({ memoId, content }) => {
    try {
      return await updateMemo(memoId, content)
    } catch (error) {
      console.error(error || '게시글 가져오기 실패')
    }
  }
)

export const deleteMemoThunk = createAsyncThunk<Memo, { memoId: number }>('memo/deleteMemo', async ({ memoId }) => {
  try {
    return await deleteMemo(memoId)
  } catch (error) {
    console.error(error || '게시글 가져오기 실패')
  }
})

interface State {
  memos: Memo[] | []
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: State = {
  memos: [],
  status: 'idle',
}

export const memoSlice = createSlice({
  name: 'memo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getMemoThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getMemoThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.memos = action.payload
      })
      .addCase(getMemoThunk.rejected, (state) => {
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
