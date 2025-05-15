import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUser } from '@/lib/api/userApi'
import { User } from '@/lib/types'

export const getUserThunk = createAsyncThunk<User, number>('user/getUser', async (id) => {
  try {
    return await getUser(id)
  } catch (error) {
    console.error(error || '유저 조회 실패')
  }
})

interface State {
  user?: User
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: State = {
  user: undefined,
  status: 'idle',
}

export const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default authSlice.reducer
