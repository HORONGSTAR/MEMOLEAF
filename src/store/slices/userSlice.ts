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
  profile?: User
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
}

const initialState: State = {
  profile: undefined,
  status: 'idle',
}

export const userSlice = createSlice({
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
        state.profile = action.payload
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default userSlice.reducer
