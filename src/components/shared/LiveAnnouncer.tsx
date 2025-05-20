'use client'

import React, { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'

export type AriaLivePoliteness = 'off' | 'polite' | 'assertive'

export interface LiveAnnouncerProps {
  message: string
  politeness?: AriaLivePoliteness
  announceOnChange?: boolean
  dependencies?: unknown[]
}

export default function LiveAnnouncer(props: LiveAnnouncerProps) {
  const { message, politeness = 'polite', announceOnChange = true, dependencies = [] } = props
  const announcerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!announceOnChange || !announcerRef.current) return

    const element = announcerRef.current
    const originalMessage = element.textContent

    element.textContent = ''

    setTimeout(() => {
      if (element) {
        element.textContent = originalMessage
      }
    }, 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message, announceOnChange, ...dependencies])

  return (
    <Box
      ref={announcerRef}
      aria-live={politeness}
      aria-atomic="true"
      sx={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {message}
    </Box>
  )
}
