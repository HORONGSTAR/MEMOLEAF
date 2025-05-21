'use client'
import { Divider, Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'

import { ReactNode, useState } from 'react'
import { MemoList } from '@/components'

interface Props {
  id: number
  children: ReactNode
}

export default function MyPost({ id, children }: Props) {
  const [value, setValue] = useState('myposts')

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  const items: { [key: string]: ReactNode } = {
    myposts: <MemoList path="my" endpoint={{ mypost: id }} />,
    bookmarks: <MemoList path="my" endpoint={{ bookmark: id }} />,
    follows: children,
  }

  return (
    <Box sx={{ width: '100%' }}>
      <TabContext value={value}>
        <TabList onChange={handleChange} aria-label="lab API tabs example">
          <Tab label="게시글" value="myposts" />
          <Tab label="북마크" value="bookmarks" />
          <Tab label="팔로우" value="follows" />
        </TabList>
        <Divider />
        <TabPanel value={value}>{items[value]}</TabPanel>
      </TabContext>
    </Box>
  )
}
