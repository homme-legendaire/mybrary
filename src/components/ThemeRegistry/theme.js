import { Inter } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const inter = Inter({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 650,
      md: 1100,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    mode: "light",
    // mode: "dark",
    primary: {
      main: "#7c3f34",
      dark: "#6b332b",
      bright: "rgba(124, 63, 52, 0.7)",
      light: "rgba(124, 63, 52, 0.04)",
    },
    secondary: {
      main: "#d39f94",
      dark: "#c37b6a",
      bright: "rgba(211, 159, 148, 0.7)",
      light: "rgba(211, 159, 148, 0.04)",
    },
    mybraryPink: {
      main: "#CF9084",
      dark: "#bb6856",
      bright: "rgba(207, 144, 132, 0.7)",
      light: "rgba(207, 144, 132, 0.04)",
    },
    gray: {
      main: "#979797",
    },
    indicator: {
      veryGood: "#2A7EFC",
      good: "#26C522",
      normal: "#FF7C02",
      bad: "#FF1102",
      veryBad: "#9C0000",
      number: "#666",
    },
  },
  typography: {
    fontWeight: 700,
  },
  components: {
    MuiPaper: {
      variants: [
        {
          props: { variant: "border" },
          style: {
            boxShadow: "none",
            borderRadius: "4px",
            border: "1px solid #e7e8ef",
          },
        },
      ],
    },
    MuiTableCell: {
      variants: [
        {
          props: { variant: "border" },
          style: {
            border: "1px solid #E0E0E0",
          },
        },
      ],
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "gray" },
          style: {
            color: "#242424",
            backgroundColor: "#f9fafc",
          },
        },
        {
          props: { variant: "grayText" },
          style: {
            color: "rgba(0,0,0,0.48)",
            background: "none",
            fontSize: "14px",
            fontWeight: 500,
            "&:hover": {
              color: "rgba(0,0,0,0.87)",
              background: "none",
            },
          },
        },
        {
          props: { variant: "bar" },
          style: {
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#262626",
            backgroundColor: "#FFF",
            padding: "6px 8px",
            "&:hover": {
              backgroundColor: "rgba(9,30,66,0.06)",
            },
          },
        },
      ],
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backdropFilter: "none",
          // backgroundColor: "rgba(0,0,0,0.1)",
        },
      },
    },
    MuiSelect: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
  },
});

export default theme;
