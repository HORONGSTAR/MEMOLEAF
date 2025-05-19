'use client'
import { BookmarkMemo } from '@/lib/fetch/feedbackApi'
import { OnOffItem } from '@/lib/types'
import { Bookmark, BookmarkBorder } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import { useState } from 'react'

interface Props {
  id: number
  state: string
  count: number
}

export default function BookmarkButton(props: Props) {
  const [id, setId] = useState(props.id)
  const [state, setState] = useState(props.state)
  const [count, setCount] = useState(props.count)

  const handleBookmark = (action: 'check' | 'uncheck') => {
    const value = { check: +1, uncheck: -1 }
    BookmarkMemo({ id, action })
      .then((result) => {
        setId(result)
        setCount((prev) => prev + value[action])
      })
      .catch()
    setState(action)
  }

  const followButton: OnOffItem = {
    uncheck: (
      <IconButton onClick={() => handleBookmark('check')} sx={{ position: 'relative' }}>
        <BookmarkBorder fontSize="small" />
        <Typography variant="body2" sx={{ position: 'absolute', right: -2, fontWeight: 'bold' }}>
          {count}
        </Typography>
      </IconButton>
    ),
    check: (
      <IconButton color="primary" onClick={() => handleBookmark('uncheck')} sx={{ position: 'relative' }}>
        <Bookmark fontSize="small" />
        <Typography variant="body2" sx={{ position: 'absolute', right: -2, fontWeight: 'bold' }}>
          {count}
        </Typography>
      </IconButton>
    ),
    none: null,
  }

  return followButton[state]
}
