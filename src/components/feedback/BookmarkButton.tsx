'use client'
import { createBookmark, deleteBookmark } from '@/shared/fetch/bookmarksApi'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import { IconButton, Snackbar } from '@mui/material'
import { useCallback, useState } from 'react'
import FeedbackCount from './FeedbackCount'

interface Props {
  id: number
  checked: 'on' | 'off'
  count?: number
}

export default function BookmarkButton(props: Props) {
  const [id, setId] = useState(props.id)
  const [checked, setChecked] = useState(props.checked)
  const [count, setCount] = useState(props.count || 0)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateBookmark = useCallback(() => {
    setLoading(true)
    createBookmark(id)
      .then((result) => {
        setId(result)
        setCount((prev) => prev + 1)
        setMessage('게시글을 북마크 했습니다.')
      })
      .catch(() => setMessage('북마크 중 문제가 발생했습니다. 새로고침 후 다시 시도해주세요.'))
      .finally(() => {
        setChecked('on')
        setLoading(false)
      })
  }, [id])

  const handleDeleteBookmark = useCallback(() => {
    setLoading(true)
    deleteBookmark(id)
      .then((result) => {
        setId(result)
        setCount((prev) => prev - 1)
        setMessage('북마크를 해제했습니다.')
      })
      .catch(() => setMessage('북마크 해제 중 문제가 발생했습니다. 새로고침 후 다시 시도해주세요.'))
      .finally(() => {
        setChecked('off')
        setLoading(false)
      })
  }, [id])

  const followButton = (
    <FeedbackCount count={count}>
      {
        {
          on: (
            <IconButton
              disabled={loading}
              size="small"
              aria-label="북마크 취소"
              onClick={(e) => {
                e.stopPropagation()
                handleDeleteBookmark()
              }}
              sx={{ position: 'relative' }}
            >
              <Bookmark sx={{ fontSize: 18 }} />
            </IconButton>
          ),
          off: (
            <IconButton
              disabled={loading}
              size="small"
              aria-label="북마크 하기"
              onClick={(e) => {
                e.stopPropagation()
                handleCreateBookmark()
              }}
              sx={{ position: 'relative' }}
            >
              <BookmarkBorder sx={{ fontSize: 18 }} />
            </IconButton>
          ),
        }[checked]
      }
    </FeedbackCount>
  )

  return (
    <>
      {followButton}
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
