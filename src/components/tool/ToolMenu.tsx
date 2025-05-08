'use client'
import { Stack as MuiStack, IconButton, Collapse, StackProps } from '@mui/material'
import { AddCircle, AddCircleOutline } from '@mui/icons-material'
import { ReactNode, useState } from 'react'
import { BasicProps } from '@/lib/types'
import { swapOnOff } from '@/lib/utills'

type Tool = { [key: string]: { sx: string[]; bool: boolean; icon: ReactNode } }

export default function ToolMenu(props: BasicProps) {
  const { children } = props
  const [extend, setExtend] = useState<string>('off')

  const tool: Tool = {
    on: { sx: ['#eee', '45deg'], bool: true, icon: <AddCircle /> },
    off: { sx: ['none', '0deg'], bool: false, icon: <AddCircleOutline /> },
  }

  return (
    <Stack sx={{ bgcolor: tool[extend].sx[0], borderRadius: 10 }}>
      <IconButton
        size="small"
        sx={{
          transform: `rotate(${tool[extend].sx[1]})`,
          transition: 'transform 0.3s ease',
        }}
        onClick={() => setExtend(swapOnOff[extend].next)}
      >
        {tool[extend].icon}
      </IconButton>
      <Collapse orientation="horizontal" in={tool[extend].bool}>
        <Stack>{children}</Stack>
      </Collapse>
    </Stack>
  )
}

function Stack(props: StackProps) {
  return <MuiStack {...props} direction="row" alignItems="center" />
}
