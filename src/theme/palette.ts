import { PaletteOptions } from "@mui/material/styles";

const palette: PaletteOptions = {
  common: {
    white: "#fff",
    black: "#000",
  },
  primary: {
    main: "#47575c", // --palette-color-primary-8
    light: "#506267", // --palette-color-primary-7
    dark: "#344043", // --palette-color-primary-9
    contrastText: "#fff",
  },
  secondary: {
    main: "#120045",
    light: "#8F4BAF",
    dark: "#000000",
    contrastText: "#fff",
  },
  error: {
    main: "#BB0202",
    light: "#D15555",
    dark: "#850101",
    contrastText: "#fff",
  },
  warning: {
    main: "#FF9218",
    light: "#FFB664",
    dark: "#B56811",
    contrastText: "#000",
  },
  success: {
    main: "#008481",
    light: "#54ADAB",
    dark: "#005E5C",
    contrastText: "#fff",
  },
  info: {
    main: "#00338D",
    light: "#5476B3",
    dark: "#002464",
    contrastText: "#fff",
  },
  background: {
    default: "var(--component-color-bg)",
  },
};

export default palette;
