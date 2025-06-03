'use client'
import PostForm from '@/components/memo/sub/PostForm'
import { createMemo } from '@/shared/fetch/memosApi'
import { Backdrop, Paper, useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
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
  const [open, setOpen] = useState(false)

  const handleCreateMemo = useCallback(
    async (params: MemoParams, images: UploadData[]) => {
      if (!profile) return

      try {
        setOpen(true)
        dispatch(openAlert({ message: '메모 업로드 중...', severity: 'info' }))
        const result = await createMemo({ ...params, ...(titleId && { titleId }) })
        add({ ...result, user: profile, images })
        if (images.length > 0) {
          dispatch(openAlert({ message: '이미지 업로드 중...', severity: 'info' }))
          await uploadImages(images, result.id)
        }
        dispatch(openAlert({ message: '메모를 게시했습니다.' }))
      } catch (error) {
        console.error(error)
        dispatch(openAlert({ message: '게시글 업로드 중 문제가 발생했습니다.', severity: 'error' }))
      } finally {
        setOpen(false)
      }
    },
    [profile, titleId, add, dispatch]
  )

  return (
    <Paper variant="outlined" sx={{ bgcolor: theme.palette.secondary.light, p: 1, mb: 2 }}>
      <Backdrop sx={{ zIndex: theme.zIndex.drawer + 1 }} open={open} />
      <PostForm action="create" titleId={null} onSubmint={handleCreateMemo} />
    </Paper>
  )
}
