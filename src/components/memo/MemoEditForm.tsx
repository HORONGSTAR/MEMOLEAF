'use client'
import { PostForm } from '@/components/memo/sub'
import { updateMemo } from '@/shared/fetch/memosApi'
import { Button } from '@mui/material'
import { useCallback } from 'react'
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

  const handleUpdateMemo = useCallback(
    (params: MemoParams, images: UploadData[]) => {
      updateMemo(params)
        .then((result) => {
          dispatch(openAlert({ message: '메모를 수정했습니다.' }))
          uploadImages(images, result.id)
          updateItem({ ...result, images })
          close()
        })
        .catch(({ message }) => {
          dispatch(openAlert({ message, severity: 'error' }))
        })
    },
    [dispatch, updateItem, close]
  )

  return (
    <PostForm action="update" {...memo} onSubmint={handleUpdateMemo}>
      <Button color="error" onClick={close}>
        취소
      </Button>
    </PostForm>
  )
}
