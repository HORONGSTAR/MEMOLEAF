'use client'
import { createBookmark, deleteBookmark } from '@/shared/fetch/feedbackApi'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useCallback, useState } from 'react'

interface Props {
  id: number
  checked: 'on' | 'off' | string
  update: (value: { id: number } | undefined, action: 'add' | 'remove') => void
}

export default function BookmarkToggle(props: Props) {
  const [id, setId] = useState(props.id)
  const [checked, setChecked] = useState(props.checked)
  const [loading, setLoading] = useState(false)
  const { update } = props

  const handleCreateBookmark = useCallback(() => {
    setLoading(true)
    createBookmark(id)
      .then((result) => {
        setId(result)
        update({ id: result }, 'add')
        setChecked('on')
      })
      .catch()
      .finally(() => {
        setLoading(false)
      })
  }, [id, update])

  const handleDeleteBookmark = useCallback(() => {
    setLoading(true)
    deleteBookmark(id)
      .then((result) => {
        setId(result)
        update(undefined, 'remove')
        setChecked('off')
      })
      .catch()
      .finally(() => {
        setLoading(false)
      })
  }, [id, update])

  const button = {
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
        aria-label="북마크 추가"
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

  return button
}
