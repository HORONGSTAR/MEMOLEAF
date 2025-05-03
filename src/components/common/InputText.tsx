'use client'
import { CSSProperties, InputBase, InputBaseProps, useTheme } from '@mui/material'
import { Dispatch, SetStateAction } from 'react'

interface Props extends InputBaseProps {
  fullWidth?: boolean
  multiline?: boolean
  minRows?: number
  type?: string
  placeholder: string
  fontSize: string
  value: string
  max: number
  setValue: Dispatch<SetStateAction<string>>
}

export default function InputText(props: Props) {
  const theme = useTheme()
  const { fullWidth, multiline, minRows, type, placeholder, fontSize, value, max, setValue } = props
  const typography: { [key: string]: CSSProperties } = {
    body1: theme.typography.body1,
    body2: theme.typography.body2,
  }

  const handleChange = (value: string) => {
    if (value.length > max) return
    setValue(value)
  }

  return (
    <InputBase
      fullWidth={fullWidth}
      multiline={multiline}
      minRows={minRows}
      type={type}
      placeholder={placeholder}
      autoFocus
      value={value}
      onChange={(e) => handleChange(e.target.value)}
      inputProps={{ sx: { ...typography[fontSize] } }}
    />
  )
}
