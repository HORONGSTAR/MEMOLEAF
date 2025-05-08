'use client'
import { Checkbox, Stack } from '@mui/material'
import { Dispatch, SetStateAction, useCallback } from 'react'
import { Lock, LockOutlined, SubtitlesOutlined, Subtitles, DevicesFoldOutlined, DevicesFold } from '@mui/icons-material'
import { swapOnOff } from '@/lib/utills'
import { Option } from '@/lib/types'

interface Props {
  option: Option
  setOption: Dispatch<SetStateAction<Option>>
}

export default function ToolMenuItem(props: Props) {
  const { option, setOption } = props

  const handleChange = useCallback(
    (field: string) => {
      setOption((prev) => ({
        ...prev,
        [field]: { activate: swapOnOff[option[field].activate].next, extra: prev[field].extra },
      }))
    },
    [setOption, option]
  )

  const formItems = [
    {
      field: 'subtext',
      label: '덧붙임',
      checked: swapOnOff[option.subtext.activate].bool,
      icon: <SubtitlesOutlined />,
      checkedIcon: <Subtitles />,
    },
    {
      field: 'folder',
      label: '접힌 글',
      checked: swapOnOff[option.folder.activate].bool,
      icon: <DevicesFoldOutlined />,
      checkedIcon: <DevicesFold />,
    },
    {
      field: 'secret',
      label: '감추기',
      checked: swapOnOff[option.secret.activate].bool,
      icon: <LockOutlined />,
      checkedIcon: <Lock />,
    },
  ]

  return (
    <Stack direction="row" alignItems="center">
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
  )
}
