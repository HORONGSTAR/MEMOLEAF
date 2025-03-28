'use client'
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@mui/material'

type Props = {
   post: { title?: string; content?: string; imgUrl?: string }
}

export const PostCard = (props: Props) => {
   const { post } = props
   return (
      <Card sx={{ maxWidth: 345 }}>
         <CardContent>
            {post.imgUrl && <CardMedia src={post.imgUrl} />}
            <Typography gutterBottom variant="h5" component="div">
               {post.title}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
               {post.content}
            </Typography>
         </CardContent>
         <CardActions>
            <Button size="small">수정</Button>
            <Button size="small">삭제</Button>
         </CardActions>
      </Card>
   )
}
