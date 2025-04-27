import { createTheme } from "@mui/material/styles";
import palette from "./palette";

const theme = createTheme({
  palette: {
    mode: "light",
    common: palette.common,
    primary: palette.primary,
    secondary: palette.secondary,
    error: palette.error,
    warning: palette.warning,
    info: palette.info,
    background: palette.background,
  },
  typography: {
    htmlFontSize: 16,
    h1: {
      fontSize: "2.5rem",
    },
    h2: {
      fontSize: "2rem",
    },
    h3: {
      fontSize: "1.5rem",
    },
    h4: {
      fontSize: "1.375rem",
    },
    h5: {
      fontSize: "1.25rem",
    },
    h6: {
      fontSize: "1.125rem",
    },
    button: {
      textTransform: "unset",
    },
  },
});

export default theme;
