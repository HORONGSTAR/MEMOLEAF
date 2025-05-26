import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchProfile, updateProfile } from '@/shared/fetch/usersApi'
import { UserParams } from '@/shared/types/api'
import { UserData } from '@/shared/types/client'

export const fetchProfileThunk = createAsyncThunk<UserData, number>('user/fetchProfile', async (id) => {
  try {
    return await fetchProfile(id)
  } catch (error) {
    console.error(error || '유저 조회 실패')
  }
})

export const updateProfileThunk = createAsyncThunk<UserData, UserParams>('user/updateProfile', async (params) => {
  try {
    return await updateProfile(params)
  } catch (error) {
    console.error(error || '유저 정보 수정 실패')
  }
})

interface State {
  profile?: UserData
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
      .addCase(fetchProfileThunk.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.profile = action.payload
      })
      .addCase(fetchProfileThunk.rejected, (state) => {
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
