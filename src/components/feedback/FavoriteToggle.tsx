'use client'
import { createFavorite, deleteFavorite } from '@/shared/fetch/feedbackApi'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useCallback, useState } from 'react'
import { useAppDispatch } from '@/store/hooks'
import { openAlert } from '@/store/slices/alertSlice'

interface Props {
  id: number
  checked: 'on' | 'off' | string
  update: (value: { id: number } | undefined, action: 'add' | 'remove') => void
}

export default function FavoriteToggle(props: Props) {
  const [id, setId] = useState(props.id)
  const [checked, setChecked] = useState(props.checked)
  const [loading, setLoading] = useState(false)
  const { update } = props
  const dispatch = useAppDispatch()

  const handleCreateFavorite = useCallback(() => {
    setLoading(true)
    createFavorite(id)
      .then((result) => {
        setId(result)
        update({ id: result }, 'add')
        setChecked('on')
        dispatch(openAlert({ message: '좋아요를 추가했습니다.' }))
      })
      .catch(({ message }) => {
        dispatch(openAlert({ message, severity: 'error' }))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [dispatch, id, update])

  const handleDeleteFavorite = useCallback(() => {
    setLoading(true)
    deleteFavorite(id)
      .then((result) => {
        setId(result)
        update(undefined, 'remove')
        setChecked('off')
        dispatch(openAlert({ message: '좋아요를 취소했습니다.' }))
      })
      .catch(({ message }) => {
        dispatch(openAlert({ message, severity: 'error' }))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [dispatch, id, update])

  const button = {
    on: (
      <IconButton
        disabled={loading}
        size="small"
        aria-label="좋아요 취소"
        onClick={(e) => {
          e.stopPropagation()
          handleDeleteFavorite()
        }}
        sx={{ position: 'relative' }}
      >
        <Favorite sx={{ fontSize: 18 }} />
      </IconButton>
    ),
    off: (
      <IconButton
        disabled={loading}
        size="small"
        aria-label="좋아요 추가"
        onClick={(e) => {
          e.stopPropagation()
          handleCreateFavorite()
        }}
        sx={{ position: 'relative' }}
      >
        <FavoriteBorder sx={{ fontSize: 18 }} />
      </IconButton>
    ),
  }[checked]

  return button
}
