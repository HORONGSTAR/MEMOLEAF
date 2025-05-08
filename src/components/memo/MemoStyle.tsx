'use client'
import { ReactNode } from 'react'
import { MemoOption } from '@/components'
import { Style, Option } from '@/lib/types'

interface Props {
  children: ReactNode
  styles: Style[]
}

type Component = { [key: string]: ReactNode }

export default function MemoStyle(props: Props) {
  const { styles, children } = props
  const option: Option = {
    subtext: { activate: 'off', extra: '' },
    folder: { activate: 'off', extra: '' },
    secret: { activate: 'off', extra: '' },
  }

  styles.forEach((style) => (option[style.option] = { activate: 'on', extra: style.extra }))

  const subtext: Component = {
    on: <MemoOption option="subtext" extra={option.subtext.extra} />,
    off: null,
  }

  const folder: Component = {
    on: (
      <MemoOption option="folder" extra={option.folder.extra}>
        {children}
      </MemoOption>
    ),
    off: children,
  }

  const secret: Component = {
    on: (
      <MemoOption option="secret" extra={option.secret.extra}>
        {subtext[option.subtext.activate]}
        {folder[option.folder.activate]}
      </MemoOption>
    ),
    off: (
      <>
        {subtext[option.subtext.activate]}
        {folder[option.folder.activate]}
      </>
    ),
  }

  return <>{secret[option.secret.activate]}</>
}
