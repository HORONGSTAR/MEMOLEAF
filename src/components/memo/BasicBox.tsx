'use client'
import { ListItem, ListItemAvatar, ListItemText, Box } from '@mui/material'
import { convertDate } from '@/shared/utils/common'
import { DecoBox, ImgGrid } from '@/components/memo/sub'
import { Avatar, LinkBox } from '@/components/common'
import { MemoData } from '@/shared/types/client'

interface Props {
  memo: MemoData
}

export default function BasicBox({ memo }: Props) {
  return (
    <Box sx={{ p: 1 }}>
      <DecoBox decos={memo.decos}>
        <ListItem>{memo.content}</ListItem>
        <ImgGrid images={memo.images} />
      </DecoBox>
    </Box>
  )
}
