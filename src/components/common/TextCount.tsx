import { Typography } from '@mui/material'

interface Props {
  text: string
  max: number
}

export default function TextCount(props: Props) {
  const { text, max } = props

  return (
    <Typography
      {...{
        color: 'textSecondary',
        align: 'right',
        mr: 1,
        variant: 'caption',
        whiteSpace: 'nowrap',
      }}
    >
      {text?.length || 0} / {max}
    </Typography>
  )
}
