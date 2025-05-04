'use client'
import { CSSProperties, InputBase, InputBaseProps, useTheme } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

interface Props extends InputBaseProps {
  fontSize?: string
  max: number
  value: string
  setValue?: Dispatch<SetStateAction<string>>
}

export default function InputText(props: Props) {
  const theme = useTheme()
  const { fontSize, value, max, setValue } = props
  const inputBaseProps = { ...props }
  delete inputBaseProps.setValue

  const typography: { [key: string]: CSSProperties } = {
    body1: theme.typography.body1,
    body2: theme.typography.body2,
  }

  const handleChange = (value: string) => {
    if (!setValue || value.length > max) return
    setValue(value)
  }

  return (
    <>
      <InputBase
        {...inputBaseProps}
        autoFocus
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        inputProps={{ sx: { ...typography[fontSize || 'body2'] } }}
      />
    </>
  )
}
