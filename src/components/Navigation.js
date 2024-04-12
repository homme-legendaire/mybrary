"use client";
import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import {
  Home,
  MenuBook,
  Person,
  ScreenSearchDesktop,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function Navigation({ value }) {
  const router = useRouter();

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "var(--bg)",
      }}
      elevation={4}
    >
      <BottomNavigation
        showLabels
        value={value}
        sx={{
          backgroundColor: "var(--bg)",
        }}
      >
        <BottomNavigationAction
          label="홈"
          icon={<Home fontSize="large" />}
          onClick={() => router.push("/main")}
          sx={{
            "& .MuiBottomNavigationAction-label": {
              fontSize: "1.1rem !important",
            },
          }}
        />
        <BottomNavigationAction
          label="마이브러리"
          icon={<MenuBook fontSize="large" />}
          onClick={() => router.push("/mybrary")}
          sx={{
            "& .MuiBottomNavigationAction-label": {
              fontSize: "1.1rem !important",
            },
          }}
        />
        <BottomNavigationAction
          label="새 책 찾기"
          icon={<ScreenSearchDesktop fontSize="large" />}
          onClick={() => router.push("/find")}
          sx={{
            "& .MuiBottomNavigationAction-label": {
              fontSize: "1.1rem !important",
            },
          }}
        />
        <BottomNavigationAction
          label="내정보"
          icon={<Person fontSize="large" />}
          onClick={() => router.push("/mypage")}
          sx={{
            "& .MuiBottomNavigationAction-label": {
              fontSize: "1.1rem !important",
            },
          }}
        />
      </BottomNavigation>
    </Paper>
  );
}
