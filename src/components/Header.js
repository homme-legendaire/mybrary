"use client";
import { AppBar, Menu, MenuItem, Toolbar } from "@mui/material";
import styles from "./Header.module.css";
import Link from "next/link";
import { Menu as MenuIcon } from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  console.log(open);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    setAnchorEl(null);
    router.push("/");
  };

  return (
    <AppBar
      sx={{
        boxShadow: "0px 5px 5px 0px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#ebe3cb",
          minHeight: "48px !important",
          alignItems: "center",
          justifyContent:
            pathname !== "/" &&
            pathname !== "/findpassword" &&
            pathname !== "/signup"
              ? "space-between"
              : "center",
        }}
      >
        <Link
          href={
            pathname !== "/" &&
            pathname !== "/findpassword" &&
            pathname !== "/signup"
              ? "/main"
              : "/"
          }
        >
          <div className={styles.header}>
            <span>Mybrary</span>
          </div>
        </Link>
        {pathname !== "/" &&
          pathname !== "/findpassword" &&
          pathname !== "/signup" && (
            <div className={styles.subHeader}>
              <MenuIcon
                fontSize="large"
                sx={{
                  color: "#212545",
                  alignSelf: "center",
                }}
                onClick={handleClick}
              />
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <Link href="/mypage">
                  <MenuItem onClick={handleClose}>설정</MenuItem>
                </Link>
                <MenuItem onClick={logoutHandler}>로그아웃</MenuItem>
              </Menu>
            </div>
          )}
      </Toolbar>
    </AppBar>
  );
}
