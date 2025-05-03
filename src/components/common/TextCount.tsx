import { Typography } from '@mui/material'

export default function TextCount({ text, max }: { text: string; max: number }) {
  return (
    <Typography color="textSecondary" variant="caption" whiteSpace="nowrap">
      {text?.length || 0} / {max}
    </Typography>
  )
}
