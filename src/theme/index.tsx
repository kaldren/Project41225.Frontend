import { PropsWithChildren } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";

const Theme: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>{children}</CssBaseline>
    </ThemeProvider>
  );
};

export default Theme;
