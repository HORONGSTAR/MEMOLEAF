'use client'
import { ReactNode } from 'react'
import { MemoDecoItem } from '@/components'
import { Deco, EditDeco } from '@/lib/types'

interface Props {
  children: ReactNode
  decos: Deco[]
}

type Component = { [key: string]: ReactNode }

export default function MemoDeco(props: Props) {
  const { decos, children } = props
  const kind: EditDeco = {
    subtext: { active: 'off', extra: '' },
    folder: { active: 'off', extra: '' },
    secret: { active: 'off', extra: '' },
  }

  decos.forEach((style) => (kind[style.kind] = { active: 'on', extra: style.extra }))

  const subtext: Component = {
    on: <MemoDecoItem kind="subtext" extra={kind.subtext.extra} />,
    off: null,
  }

  const folder: Component = {
    on: (
      <MemoDecoItem kind="folder" extra={kind.folder.extra}>
        {children}
      </MemoDecoItem>
    ),
    off: children,
  }

  const secret: Component = {
    on: (
      <MemoDecoItem kind="secret" extra={kind.secret.extra}>
        {subtext[kind.subtext.active]}
        {folder[kind.folder.active]}
      </MemoDecoItem>
    ),
    off: (
      <>
        {subtext[kind.subtext.active]}
        {folder[kind.folder.active]}
      </>
    ),
  }

  return <>{secret[kind.secret.active]}</>
}
