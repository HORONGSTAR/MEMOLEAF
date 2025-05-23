import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMemos, createMemo, updateMemo, deleteMemo } from '@/lib/fetch/memoApi'
import { MemoParams, MemoData, GetDataParams, UserData, Status } from '@/lib/types'

interface Memos {
  memos: MemoData[]
  searchTotal: number
  nextCursor: number
}

interface CreateMemoParams {
  memo: MemoParams
  user: UserData
}

export const getMemosThunk = createAsyncThunk<Memos, GetDataParams>('memo/getMemos', async (params) => {
  try {
    return await getMemos(params)
  } catch (error) {
    console.error(error || '메모 조회 실패')
  }
})

export const createMemoThunk = createAsyncThunk<MemoData, CreateMemoParams>('memo/createMemo', async (params) => {
  try {
    const { memo, user } = params
    const newMemo = await createMemo(memo)
    return { ...newMemo, user, bookmarks: [] }
  } catch (error) {
    console.error(error || '메모 작성 실패')
  }
})

export const updateMemoThunk = createAsyncThunk<MemoData, MemoParams>('memo/updateMemo', async (params) => {
  try {
    return await updateMemo(params)
  } catch (error) {
    console.error(error || '메모 수정 실패')
  }
})

export const deleteMemoThunk = createAsyncThunk<MemoData, number>('memo/deleteMemo', async (params) => {
  try {
    return await deleteMemo(params)
  } catch (error) {
    console.error(error || '메모 삭제 실패')
  }
})

interface State {
  memos: MemoData[] | []
  searchTotal: number
  beforeCursor?: number
  nextCursor: number
  status: Status
}

const initialState: State = {
  memos: [],
  searchTotal: 10,
  beforeCursor: 0,
  nextCursor: 0,
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
        state.beforeCursor = state.nextCursor
        state.nextCursor = action.payload.nextCursor
        state.memos = action.payload.memos
        state.searchTotal = action.payload.searchTotal
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
        state.searchTotal += 1
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
        state.memos = state.memos.filter((memo) => memo.id !== action.payload.id)
      })
      .addCase(deleteMemoThunk.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default memoSlice.reducer
