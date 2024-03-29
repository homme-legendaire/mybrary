import { AppBar, Toolbar } from "@mui/material";
import styles from "./Header.module.css";
export default function Header() {
  return (
    <AppBar
      sx={{
        boxShadow: "0px 3px 5px 0px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#ebe3cb",
          minHeight: "48px !important",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className={styles.header}>
          <span>Mybrary</span>
        </div>
      </Toolbar>
    </AppBar>
  );
}
