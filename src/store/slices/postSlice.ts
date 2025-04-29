import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMemos, createMemo, updateMemo, deleteMemo } from '@/lib/api/postApi'
import { uploadImages, removeImages } from '@/lib/api/imgApi'
import { Memo, Params, User } from '@/lib/types'

interface Memos {
  memos: Memo[]
  page: number
  total: number
}

interface PostParams extends Params {
  user: User
}

export const getMemosThunk = createAsyncThunk<Memos, Params>('memo/getMemos', async ({ page }) => {
  try {
    return await getMemos({ page })
  } catch (error) {
    console.error(error || '메모 조회 실패')
  }
})

export const createMemoThunk = createAsyncThunk<Memo, PostParams>('memo/createMemo', async (params) => {
  const { user, content, images, files } = params
  try {
    const memo = await createMemo({ userId: user.id, content, images })
    if (files && files.length > 0) await uploadImages(files)
    memo.user = user
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
  const { id, images } = params
  try {
    if (images && images.length > 0) await removeImages(images)
    return await deleteMemo({ id })
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
