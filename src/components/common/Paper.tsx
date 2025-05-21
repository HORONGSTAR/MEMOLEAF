'use client'

import { Paper as MuiPaper, PaperProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface Props extends PaperProps {
  use?: 'create' | 'edit'
  noBorder?: boolean
}

export default function Paper(props: Props) {
  const { use, noBorder, children } = props
  const theme = useTheme()
  const borderSx = noBorder ? 'none' : '1px solid'

  const box = {
    basic: (
      <MuiPaper variant="outlined" {...props}>
        {children}
      </MuiPaper>
    ),
    create: (
      <MuiPaper
        variant="outlined"
        sx={{ backgroundColor: theme.palette.secondary.light, border: borderSx, borderColor: theme.palette.secondary.main, p: 1 }}
      >
        {children}
      </MuiPaper>
    ),
    edit: (
      <MuiPaper variant="outlined" sx={{ backgroundColor: theme.palette.grey[100], border: borderSx, borderColor: theme.palette.grey[300], p: 1 }}>
        {children}
      </MuiPaper>
    ),
  }
  return box[use || 'basic']
}
