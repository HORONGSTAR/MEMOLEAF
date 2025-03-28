'use client'

import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
   palette: {
      primary: {
         main: '#009688',
      },
   },

   components: {
      MuiButton: {
         styleOverrides: {
            root: {
               variants: [
                  {
                     props: { variant: 'contained' },
                     style: {
                        boxShadow: 'none',
                        '&:hover': { boxShadow: 'none' },
                     },
                  },
               ],
            },
         },
      },
   },
})
