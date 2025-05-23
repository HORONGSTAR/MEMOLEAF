'use client'
import { BookmarkMemo } from '@/lib/fetch/feedbackApi'
import { OnOffItem } from '@/lib/types'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import { IconButton, Snackbar } from '@mui/material'
import { useState } from 'react'
import FeedbackCount from './FeedbackCount'

interface Props {
  id: number
  state: string
  count?: number
}

export default function BookmarkButton(props: Props) {
  const [id, setId] = useState(props.id)
  const [state, setState] = useState(props.state)
  const [count, setCount] = useState(props.count || 0)
  const [message, setMessage] = useState('')

  const handleBookmark = (action: 'check' | 'uncheck') => {
    const value = { check: +1, uncheck: -1 }
    BookmarkMemo({ id, action })
      .then((result) => {
        setId(result)
        setCount((prev) => prev + value[action])
        setMessage({ check: '게시글을 북마크 했습니다.', uncheck: '북마크를 해제했습니다.' }[action])
      })
      .catch()
    setState(action)
  }

  const followButton: OnOffItem = {
    uncheck: (
      <FeedbackCount count={count}>
        <IconButton size="small" aria-label="북마크 하기" onClick={() => handleBookmark('check')} sx={{ position: 'relative' }}>
          <BookmarkBorder fontSize="small" />
        </IconButton>
      </FeedbackCount>
    ),
    check: (
      <FeedbackCount color="primary" count={count}>
        <IconButton size="small" aria-label="북마크 취소" color="primary" onClick={() => handleBookmark('uncheck')} sx={{ position: 'relative' }}>
          <Bookmark fontSize="small" />
        </IconButton>
      </FeedbackCount>
    ),
    none: null,
  }

  return (
    <>
      {followButton[state]}
      <Snackbar open={message ? true : false} autoHideDuration={6000} onClose={() => setMessage('')} message={message} />
    </>
  )
}
