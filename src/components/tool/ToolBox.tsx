'use client'
import { ToolMenu, ToolMenuItem, ToolBoxItem } from '@/components'
import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { Option, Style } from '@/lib/types'
import { Button } from '@mui/material'

interface Props {
  setStyles: Dispatch<SetStateAction<Style[]>>
}

export default function ToolBox(props: Props) {
  const { setStyles } = props
  const [option, setOption] = useState<Option>({
    subtext: { activate: 'off', extra: '' },
    folder: { activate: 'off', extra: '' },
    secret: { activate: 'off', extra: '' },
  })

  const handleClick = useCallback(() => {
    const keys = Object.keys(option)
    setStyles(keys.map((key) => ({ option: key, extra: option[key].extra })))
  }, [option, setStyles])

  const itemProps = { option, setOption }

  return (
    <>
      <Button onClick={handleClick}>적용하기</Button>
      <ToolMenu>
        <ToolMenuItem {...itemProps} />
      </ToolMenu>
      <ToolBoxItem {...itemProps}></ToolBoxItem>
    </>
  )
}
