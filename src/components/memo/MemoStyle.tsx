'use client'
import { ReactNode, useState } from 'react'
import { Collapse, Typography, Chip, Box } from '@mui/material'
import { ExpandMore } from '@mui/icons-material'
type Styles = { [key: string]: ReactNode }

interface Props {
  children: ReactNode
  style?: string
}

const CollapseBox = (props: Props) => {
  const [checked, setChecked] = useState(false)
  return (
    <Box>
      <Typography variant="body2" color="textSecondary">
        접혀 있는 메모입니다.
      </Typography>
      <Chip
        sx={{ px: 0.5, my: 1 }}
        onClick={() => setChecked((prev) => !prev)}
        label={checked ? '접기' : '더 보기'}
        size="small"
        icon={<ExpandMore />}
      />
      <Collapse in={checked}>{props.children}</Collapse>
    </Box>
  )
}

export default function MemoStyle(props: Props) {
  const { style, children } = props
  const key = style ? style : 'none'
  const styles: Styles = {
    // none: children,
    none: <CollapseBox>{children}</CollapseBox>,
  }

  return <>{styles[key]}</>
}
