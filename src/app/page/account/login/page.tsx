import { LoginForm } from '@/components/auth/Forms'
import { Wrap } from '@/styles/BaseStyles'
import { Paper, Box } from '@mui/material'

function LoginPage() {
   return (
      <Box className="box-background">
         <Wrap maxWidth="xs">
            <Paper sx={{ p: 4 }}>
               <LoginForm />
            </Paper>
         </Wrap>
      </Box>
   )
}

export default LoginPage
