'use client'
import { PostForm } from '@/components/memo/sub'
import { updateMemo } from '@/shared/fetch/memosApi'
import { Backdrop, Button, useTheme } from '@mui/material'
import { useCallback, useState } from 'react'
import { MemoParams } from '@/shared/types/api'
import { MemoData, UploadData } from '@/shared/types/client'
import { uploadImages } from '@/shared/fetch/uploadApi'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  memo: MemoData
  updateItem: (item: MemoData) => void
  close: () => void
}

export default function MemoEditForm({ memo, updateItem, close }: Props) {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const handleUpdateMemo = useCallback(
    async (params: MemoParams, images: UploadData[]) => {
      try {
        close()
        setOpen(true)
        dispatch(openAlert({ message: '메모 수정 중...', severity: 'info' }))
        const result = await updateMemo(params)
        updateItem({ ...result, images })
        if (images.length > 0) {
          console.log(images)
          dispatch(openAlert({ message: '이미지 수정 중...', severity: 'info' }))
          await uploadImages(images, result.id)
        }
        dispatch(openAlert({ message: '메모를 수정했습니다.' }))
      } catch (error) {
        console.error(error)
        dispatch(openAlert({ message: '게시글 수정 중 문제가 발생했습니다.', severity: 'error' }))
      } finally {
        setOpen(false)
      }
    },
    [dispatch, updateItem, close]
  )

  return (
    <PostForm action="update" {...memo} onSubmint={handleUpdateMemo}>
      <Backdrop sx={{ zIndex: theme.zIndex.drawer + 1 }} open={open} />
      <Button color="error" onClick={close}>
        취소
      </Button>
    </PostForm>
  )
}
