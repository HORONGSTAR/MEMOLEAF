'use client'
import { Stack as MuiStack, IconButton, Collapse, StackProps, Checkbox } from '@mui/material'
import { AddCircle, AddCircleOutline, Lock, LockOutlined, SubtitlesOutlined, Subtitles, DevicesFoldOutlined, DevicesFold } from '@mui/icons-material'
import { ReactNode, useState, Dispatch, SetStateAction, useCallback } from 'react'
import { EditDeco } from '@/lib/types'
import { swapOnOff } from '@/lib/utills'

interface Props {
  decos: EditDeco
  setDecos: Dispatch<SetStateAction<EditDeco>>
}

type Tool = {
  [key: string]: {
    bgcolor: string
    rotate: string
    bool: boolean
    icon: ReactNode
  }
}

export default function MemoTool(props: Props) {
  const { decos, setDecos } = props
  const [extend, setExtend] = useState<string>('off')

  const handleChange = useCallback(
    (field: string) => {
      const active = decos[field].active
      setDecos((prev) => ({
        ...prev,
        [field]: { ...prev[field], active: swapOnOff[active].next },
      }))
    },
    [setDecos, decos]
  )

  const tool: Tool = {
    on: { bgcolor: '#eee', rotate: '45deg', bool: true, icon: <AddCircle /> },
    off: { bgcolor: 'none', rotate: '0deg', bool: false, icon: <AddCircleOutline /> },
  }

  const formItems = [
    {
      field: 'subtext',
      label: '덧붙임',
      checked: swapOnOff[decos.subtext.active].bool,
      icon: <SubtitlesOutlined />,
      checkedIcon: <Subtitles />,
    },
    {
      field: 'folder',
      label: '접힌 글',
      checked: swapOnOff[decos.folder.active].bool,
      icon: <DevicesFoldOutlined />,
      checkedIcon: <DevicesFold />,
    },
    {
      field: 'secret',
      label: '감추기',
      checked: swapOnOff[decos.secret.active].bool,
      icon: <LockOutlined />,
      checkedIcon: <Lock />,
    },
  ]

  return (
    <Stack sx={{ bgcolor: tool[extend].bgcolor, borderRadius: 10 }}>
      <IconButton
        size="small"
        sx={{
          transform: `rotate(${tool[extend].rotate})`,
          transition: 'transform 0.3s ease',
        }}
        onClick={() => setExtend(swapOnOff[extend].next)}
      >
        {tool[extend].icon}
      </IconButton>
      <Collapse orientation="horizontal" in={tool[extend].bool}>
        <Stack>
          {formItems.map((item) => (
            <Checkbox
              key={item.field}
              icon={item.icon}
              checkedIcon={item.checkedIcon}
              onChange={() => handleChange(item.field)}
              checked={item.checked}
              size="small"
            />
          ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

function Stack(props: StackProps) {
  return <MuiStack {...props} direction="row" alignItems="center" />
}
