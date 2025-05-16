import { Stack, Box, Typography, TypographyProps } from '@mui/material'
import { grey } from '@mui/material/colors'

function Footer() {
  const links = ['공지사항', '서비스 소개', '이용약관']
  const contents = [{ label: '관리자 이메일', value: 'ho_rong@naver.com' }]

  const Spen = (props: TypographyProps) => <Typography variant="body2" component="span" ml={0.6} {...props} />

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: grey[100],
        py: 2,
        textAlign: 'center',
      }}
    >
      <Stack direction="row" justifyContent="center" spacing={2} mb={1}>
        {links.map((link) => (
          <Typography key={link} variant="body2" fontWeight={500}>
            {link}
          </Typography>
        ))}
      </Stack>
      <Stack direction="row" justifyContent="center" spacing={2}>
        {contents.map((content) => (
          <Stack key={content.label}>
            <Typography variant="body2" fontWeight={500}>
              {content.label}
              <Spen>{content.value}</Spen>
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Typography variant="caption" color="textSecondary">
        copyrightc 2025 All rights reserved by MEMOLEAF
      </Typography>
    </Box>
  )
}

export default Footer
