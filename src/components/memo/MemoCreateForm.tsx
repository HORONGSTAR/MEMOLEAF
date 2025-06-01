'use client'
import PostForm from '@/components/memo/sub/PostForm'
import { createMemo } from '@/shared/fetch/memosApi'
import { Paper, useTheme } from '@mui/material'
import { useCallback } from 'react'
import { useAppSelector } from '@/store/hooks'
import { MemoParams } from '@/shared/types/api'
import { MemoData, UploadData } from '@/shared/types/client'
import { uploadImages } from '@/shared/fetch/uploadApi'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  titleId?: number
  add: (memo: MemoData) => void
}

export default function MemoCreateForm({ titleId, add }: Props) {
  const { profile } = useAppSelector((state) => state.profile)
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const handleCreateMemo = useCallback(
    (params: MemoParams, images: UploadData[]) => {
      if (!profile) return
      dispatch(openAlert({ message: '메모 업로드 중...', severity: 'info' }))
      createMemo({ ...params, ...(titleId && { titleId }) })
        .then((result) => {
          uploadImages(images, result.id)
          add({ ...result, user: profile, images })
          dispatch(openAlert({ message: '메모를 게시했습니다.' }))
        })
        .catch(({ message }) => {
          dispatch(openAlert({ message, severity: 'error' }))
        })
    },
    [profile, titleId, add, dispatch]
  )

  return (
    <Paper variant="outlined" sx={{ bgcolor: theme.palette.secondary.light, p: 1, mb: 2 }}>
      <PostForm action="create" titleId={null} onSubmint={handleCreateMemo} />
    </Paper>
  )
}
