'use client'
import { AddCircle, AddCircleOutline, Lock, LockOutlined, SubtitlesOutlined, Subtitles, DevicesFoldOutlined, DevicesFold } from '@mui/icons-material'
import { Stack as MuiStack, IconButton, Collapse, StackProps, Checkbox, Tooltip } from '@mui/material'
import { useState, Dispatch, SetStateAction, useCallback } from 'react'
import { swapOnOff } from '@/shared/utils/common'
import { DecoData } from '@/shared/types/client'
import LiveAnnouncer from '@/components/common/LiveAnnouncer'

interface Props {
  decos: DecoData
  setDecos: Dispatch<SetStateAction<DecoData>>
}

export default function ToolBox(props: Props) {
  const { decos, setDecos } = props
  const [extend, setExtend] = useState<'on' | 'off'>('off')
  const [readToolInfo, setReadToolInfo] = useState('off')

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

  const tool = {
    on: { bgcolor: '#d4e4d1', rotate: '45deg', bool: true, icon: <AddCircle /> },
    off: { bgcolor: 'none', rotate: '0deg', bool: false, icon: <AddCircleOutline /> },
  }[extend]

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
    <Stack sx={{ bgcolor: tool.bgcolor, borderRadius: 10 }}>
      <IconButton
        aria-label="추가 기능 열기"
        color="primary"
        size="small"
        sx={{
          transform: `rotate(${tool.rotate})`,
          transition: 'transform 0.3s ease',
        }}
        onClick={() => setExtend(swapOnOff[extend].next)}
      >
        {tool.icon}
      </IconButton>
      <button aria-label="추가 기능 설명 듣기" onClick={() => setReadToolInfo((prev) => swapOnOff[prev].next)} aria-describedby="description-on" />
      <Collapse orientation="horizontal" in={tool.bool}>
        <Stack>
          {formItems.map((item) => (
            <Tooltip key={item.field} title={item.label}>
              <Checkbox
                slotProps={{ input: { 'aria-label': item.label } }}
                icon={item.icon}
                checkedIcon={item.checkedIcon}
                onChange={() => handleChange(item.field)}
                checked={item.checked}
                size="small"
              />
            </Tooltip>
          ))}
        </Stack>
      </Collapse>
      <LiveAnnouncer message={readToolInfo ? toolInfo : toolInfo + ' '} />
      <LiveAnnouncer message={extend ? '추가 기능창이 열렸습니다.' : '추가 기능창이 닫혔습니다.'} />
    </Stack>
  )
}

function Stack(props: StackProps) {
  return <MuiStack {...props} direction="row" alignItems="center" />
}

export const toolInfo =
  '추가 기능은 3개가 있습니다. 덧붙임 기능은 메모 상단에 짧은 부연설명을 적을 수 있는 입력창을 제공합니다. 접힌글 기능은 메모 안에 버튼을 추가합니다. 이 버튼으로 메모의 내용을 열거나 접을 수 있습니다. 접힌글 활성화시 접힌 상태를 기본으로 게시되며, 덧붙임 기능의 부연설명은 접힌내용에 포함되지 않습니다. 감추기 기능은 메모에 비밀번호를 설정하여 공개범위를 제한할 수 있습니다. 추가 기능은 체크 박스를 선택하면 메모 입력창에 추가되는 방식입니다. 모든 기능을 선택했다고 가정했을 때 배치 순서는 1번 감추기 기능 비밀글 설정버튼, 2번 부연설명 덧붙임 입력창, 3번 접힌글 버튼 문구 편집창, 마지막으로 기존의 메모 입력창입니다.'
