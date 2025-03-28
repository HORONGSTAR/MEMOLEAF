import { SignUpForm } from '@/components/auth/Forms'
import { Wrap } from '@/styles/BaseStyles'
import { Box, Paper } from '@mui/material'

function SignUpPage() {
   return (
      <Box className="box-background">
         <Wrap maxWidth="xs">
            <Paper sx={{ p: 4 }}>
               <SignUpForm />
            </Paper>
         </Wrap>
      </Box>
   )
}

export default SignUpPage
