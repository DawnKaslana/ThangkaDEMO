import { createTheme } from '@mui/material/styles';
import { pink, cyan, purple } from '@mui/material/colors';

export const theme = createTheme({
    palette: {
        primary: pink,
    },
});

export const darkTheme = createTheme({
    palette: {
        primary: {
            main: "#000000"
          },
        secondary: cyan,
    },
});