'use client'
import { Box, Chip, Divider, Tab, Tabs } from '@mui/material'
import { ReactNode, useCallback, useState } from 'react'

interface Props {
  label: string
  reset: () => void
  tabs: {
    label: string
    panel: ReactNode
    categorys: { label: string; value: string }[]
    select?: (category: string) => void
  }[]
}

export default function TabBox({ label, tabs, reset }: Props) {
  const [index, setIndex] = useState(0)
  const [checked, setChecked] = useState({ ...tabs.map((tab) => tab.categorys[0]?.value) })

  const handleClick = useCallback(
    (value: string) => {
      if (checked[index] === value || !tabs[index].select) return
      tabs[index].select(value)
      setChecked((prev) => ({ ...prev, [index]: value }))
      reset()
    },
    [checked, index, reset, tabs]
  )

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <div>
        <Tabs
          value={index}
          onChange={(_, newValue) => {
            setIndex(newValue)
            reset()
          }}
          aria-label={label}
        >
          {tabs.map((tab, i) => (
            <Tab key={`tab${i}`} label={tab.label} id={`tab${i}`} aria-controls={`panel${i}`} />
          ))}
        </Tabs>
      </div>
      <Divider />
      <div role={`panel${index}`} id={`panel${index}`} aria-labelledby={`tab${index}`}>
        {tabs[index].categorys.map((category) => (
          <Chip
            sx={{ mx: { sm: 1, xs: 0.5 }, my: 2 }}
            key={category.value + index}
            color={category.value === checked[index] ? 'primary' : 'default'}
            label={category.label}
            onClick={() => handleClick(category.value)}
          />
        ))}

        {tabs[index].panel}
      </div>
    </Box>
  )
}
