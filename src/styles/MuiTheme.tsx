'use client'

import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
   palette: {
      primary: {
         main: '#333',
      },
   },
   breakpoints: {
      values: {
         xs: 0,
         sm: 500,
         md: 700,
         lg: 900,
         xl: 1200,
      },
   },

   components: {
      MuiInputBase: {
         styleOverrides: {
            root: {
               fontFamily: 'var(--font-noto-sans)',
            },
         },
      },
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
