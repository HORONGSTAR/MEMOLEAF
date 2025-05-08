'use client'
import { CSSProperties, InputBase, InputBaseProps, useTheme } from '@mui/material'

interface Props extends InputBaseProps {
  fontSize?: string
}

export default function InputText(props: Props) {
  const theme = useTheme()
  const { fontSize } = props
  const inputBaseProps = { ...props }

  const typography: { [key: string]: CSSProperties } = {
    body1: theme.typography.body1,
    body2: theme.typography.body2,
  }

  return (
    <>
      <InputBase {...inputBaseProps} inputProps={{ sx: { ...typography[fontSize || 'body2'] } }} />
    </>
  )
}
