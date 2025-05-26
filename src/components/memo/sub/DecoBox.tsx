'use client'
import { ReactNode } from 'react'
import { DecoData } from '@/shared/types/client'
import { Box } from '@mui/material'
import DecoItem from '@/components/memo/sub/DecoItem'

interface Props {
  children: ReactNode
  decos: DecoData
}

export default function DecoBox(props: Props) {
  const { decos, children } = props
  const kind = {
    subtext: { active: 'off', extra: '' },
    folder: { active: 'off', extra: '' },
    secret: { active: 'off', extra: '' },
    ...decos,
  }

  const subtext = {
    on: <DecoItem kind="subtext" extra={kind.subtext.extra} />,
    off: null,
  }[kind.subtext.active]

  const folder = {
    on: (
      <DecoItem kind="folder" extra={kind.folder.extra}>
        {children}
      </DecoItem>
    ),
    off: children,
  }[kind.folder.active]

  const secret = {
    on: (
      <DecoItem kind="secret" extra={kind.secret.extra}>
        {subtext}
        {folder}
      </DecoItem>
    ),
    off: (
      <>
        {subtext}
        {folder}
      </>
    ),
  }[kind.secret.active]

  return <Box whiteSpace="pre-line">{secret}</Box>
}
