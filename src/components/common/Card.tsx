import { Paper as MuiPaper, CardProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ReactNode } from 'react'

interface Props extends CardProps {
  use?: 'create' | 'edit'
  children: ReactNode
}

export default function Card(props: Props) {
  const { use, children } = props
  const theme = useTheme()

  const box = {
    basic: (
      <MuiPaper variant="outlined" {...props}>
        {children}
      </MuiPaper>
    ),
    create: (
      <MuiPaper
        variant="outlined"
        sx={{ backgroundColor: theme.palette.secondary.light, border: '1px solid', borderColor: theme.palette.secondary.main, p: 1 }}
      >
        {children}
      </MuiPaper>
    ),
    edit: (
      <MuiPaper variant="outlined" sx={{ backgroundColor: theme.palette.grey[100], border: '1px solid', borderColor: theme.palette.grey[300], p: 1 }}>
        {children}
      </MuiPaper>
    ),
  }
  return box[use || 'basic']
}
