'use client'
import { PostForm } from '@/components/memo/sub'
import { createMemo } from '@/shared/fetch/memosApi'
import { Paper, useTheme } from '@mui/material'
import { useCallback } from 'react'
import { useAppSelector } from '@/store/hooks'
import { MemoParams } from '@/shared/types/api'
import { MemoData, UploadData } from '@/shared/types/client'
import { uploadImages } from '@/shared/fetch/uploadApi'

interface Props {
  titleId?: number
  add: (memo: MemoData) => void
  alert: (text: string) => void
}

export default function MemoCreateForm({ titleId, add, alert }: Props) {
  const { profile } = useAppSelector((state) => state.profile)
  const theme = useTheme()

  const handleCreateMemo = useCallback(
    (params: MemoParams, images: UploadData[]) => {
      if (!profile) return
      alert('메모 업로드 중...')
      createMemo({ ...params, ...(titleId && { titleId }) })
        .then((result) => {
          uploadImages(images, result.id)
          add({ ...result, user: profile, images })
          alert('메모를 게시했습니다.')
        })
        .catch(() => alert('메모 작성 중 문제가 발생했습니다.'))
    },
    [add, alert, titleId, profile]
  )

  return (
    <Paper variant="outlined" sx={{ bgcolor: theme.palette.secondary.light, p: 1, mb: 2 }}>
      <PostForm action="create" titleId={null} onSubmint={handleCreateMemo} />
    </Paper>
  )
}
