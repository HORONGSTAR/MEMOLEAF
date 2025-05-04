'use client'

import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2E5E4E',
    },
    secondary: {
      main: '#B5C9B2',
    },
    info: {
      main: '#6A8CA4',
    },
    success: {
      main: '#5D8C63',
    },
    warning: {
      main: '#E1B574',
    },
    error: {
      main: '#C75C5C',
    },
    text: {
      primary: '#333333',
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
