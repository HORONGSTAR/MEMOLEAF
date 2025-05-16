import { Paper as MuiPaper, PaperProps } from '@mui/material'
import { useTheme } from '@mui/material/styles'

interface Props extends PaperProps {
  use?: 'create' | 'edit'
  kind?: 'card' | 'list'
}

export default function Paper(props: Props) {
  const { use, kind, children } = props
  const theme = useTheme()
  const kindSx = { card: '1px solid', list: 'none' }[kind || 'card']

  const box = {
    basic: (
      <MuiPaper variant="outlined" {...props}>
        {children}
      </MuiPaper>
    ),
    create: (
      <MuiPaper
        variant="outlined"
        sx={{ backgroundColor: theme.palette.secondary.light, border: kindSx, borderColor: theme.palette.secondary.main, p: 1 }}
      >
        {children}
      </MuiPaper>
    ),
    edit: (
      <MuiPaper variant="outlined" sx={{ backgroundColor: theme.palette.grey[100], border: kindSx, borderColor: theme.palette.grey[300], p: 1 }}>
        {children}
      </MuiPaper>
    ),
  }
  return box[use || 'basic']
}
