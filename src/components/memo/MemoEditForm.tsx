'use client'
import { PostForm } from '@/components/memo/sub'
import { updateMemo } from '@/shared/fetch/memosApi'
import { Button } from '@mui/material'
import { useCallback } from 'react'
import { MemoParams } from '@/shared/types/api'
import { MemoData, UploadData } from '@/shared/types/client'
import { uploadImages } from '@/shared/fetch/uploadApi'

interface Props {
  memo: MemoData
  add: (item: MemoData) => void
  close: () => void
  alert: (text: string) => void
}

export default function MemoEditForm({ memo, add, close, alert }: Props) {
  const handleUpdateMemo = useCallback(
    (params: MemoParams, images: UploadData[]) => {
      updateMemo(params)
        .then((result) => {
          alert('메모를 수정했습니다.')
          uploadImages(images, result.id)
          add({ ...result, images })
          close()
        })
        .catch(() => alert('메모 수정 중 문제가 발생했습니다.'))
    },
    [add, close, alert]
  )

  return (
    <PostForm action="update" {...memo} onSubmint={handleUpdateMemo}>
      <Button color="error" onClick={close}>
        취소
      </Button>
    </PostForm>
  )
}
