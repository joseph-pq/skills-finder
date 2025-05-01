import { createTheme } from "@mui/material/styles";

const themeOptions = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#D9D137",
    },
    secondary: {
      main: "#60BAD4",
    },
    text: {
      primary: "#D9D137",
    },
    background: {
      default: "#030001",
      paper: "#030001",
    },
    info: {
      main: "#262730",
    },
    error: {
      main: "#D33F49",
    },
    warning: {
      main: "#ffa726",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "3px solid #D9D137", // Uses primary color for border
          borderRadius: "8px", // Optional: rounded corners
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: "3px solid #D9D137", // Border for tables
          borderRadius: "8px", // Optional
        },
      },
    },
  },
});

export default themeOptions;
