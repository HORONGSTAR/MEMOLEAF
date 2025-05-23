'use client'
import { ReactNode } from 'react'
import DecoItem from './DecoItem'
import { Deco, EditDeco } from '@/lib/types'
import { Box } from '@mui/material'

interface Props {
  children: ReactNode
  decos: Deco[]
}

type Component = { [key: string]: ReactNode }

export default function DecoBox(props: Props) {
  const { decos, children } = props
  const kind: EditDeco = {
    subtext: { active: 'off', extra: '' },
    folder: { active: 'off', extra: '' },
    secret: { active: 'off', extra: '' },
  }

  decos.forEach((style) => (kind[style.kind] = { active: 'on', extra: style.extra }))

  const subtext: Component = {
    on: <DecoItem kind="subtext" extra={kind.subtext.extra} />,
    off: null,
  }

  const folder: Component = {
    on: (
      <DecoItem kind="folder" extra={kind.folder.extra}>
        {children}
      </DecoItem>
    ),
    off: children,
  }

  const secret: Component = {
    on: (
      <DecoItem kind="secret" extra={kind.secret.extra}>
        {subtext[kind.subtext.active]}
        {folder[kind.folder.active]}
      </DecoItem>
    ),
    off: (
      <>
        {subtext[kind.subtext.active]}
        {folder[kind.folder.active]}
      </>
    ),
  }

  return <Box whiteSpace="pre-line">{secret[kind.secret.active]}</Box>
}
