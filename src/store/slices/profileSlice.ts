import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getProfile, updateProfile } from '@/lib/api/userApi'
import { User, UserParams } from '@/lib/types'

export const getProfileThunk = createAsyncThunk<User, number>('user/getProfile', async (id) => {
  try {
    return await getProfile(id)
  } catch (error) {
    console.error(error || '유저 조회 실패')
  }
})

export const updateProfileThunk = createAsyncThunk<User, UserParams>('user/updateProfile', async (params) => {
  try {
    return await updateProfile(params)
  } catch (error) {
    console.error(error || '유저 정보 수정 실패')
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

export const authSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfileThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.profile = action.payload
      })
      .addCase(getProfileThunk.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(updateProfileThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.profile = action.payload
      })
      .addCase(updateProfileThunk.rejected, (state) => {
        state.status = 'failed'
      })
  },
})

export default authSlice.reducer
