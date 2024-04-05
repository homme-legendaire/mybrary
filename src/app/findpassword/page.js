"use client";
import { useState } from "react";
import firebase from "firebase/app";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  Grid,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
// import auth from "@/firebase/fireauth.js";
// import { sendPasswordResetEmail } from "firebase/auth";
import styles from "./page.module.css";
export default function FindPassword() {
  const router = useRouter();
  const [emailWarning, setEmailWarning] = useState("");
  const [phoneNumberWarning, setPhoneNumberWarning] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  //   const findPasswordHandler = async (e) => {
  //     e.preventDefault();
  //     // console.log("find!");
  //     if (email !== "" && phoneNumber !== "") {
  //       const res = await fetch(
  //         `${process.env.PRODUCTION_SERVER_HOST}/login/passwordReset`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             email: email,
  //             phoneNumber: phoneNumber,
  //           },
  //         }
  //       );
  //       const resJson = await res.json();
  //       if (resJson.result === "success") {
  //         // console.log("success");
  //         sendPasswordResetEmail(auth, email)
  //           .then(() => {
  //             alert("이메일을 확인해주세요.");
  //             router.push("/login");
  //           })
  //           .catch((error) => {
  //             alert(error.message);
  //           });

  //         // auth
  //         //   .sendPasswordResetEmail(email)
  //         //   .then(() => {
  //         //     alert("이메일을 확인해주세요.");
  //         //   })
  //         //   .catch((error) => {
  //         //     alert(error.message);
  //         //   });
  //       } else if (resJson.result === "fail") {
  //         alert("입력하신 정보와 일치하는 회원이 없습니다.");
  //       }
  //     } else {
  //       if (email === "") {
  //         setEmailWarning("아이디(이메일)를 입력해주세요.");
  //       } else if (!email.includes("@") || !email.includes(".")) {
  //         setEmailWarning("이메일 형식이 올바르지 않습니다.");
  //       } else {
  //         setEmailWarning("");
  //       }
  //       if (phoneNumber === "") {
  //         setPhoneNumberWarning("전화번호를 입력해주세요.");
  //       } else {
  //         setPhoneNumberWarning("");
  //       }
  //     }
  //   };

  const findPasswordHandler = async (e) => {
    e.preventDefault();
  };

  const inputBlurHandler = (e) => {
    if (e.target.id === "email") {
      if (e.target.value === "") {
        setEmailWarning("아이디(이메일)를 입력해주세요.");
      } else if (
        !e.target.value.includes("@") ||
        !e.target.value.includes(".")
      ) {
        setEmailWarning("이메일 형식이 올바르지 않습니다.");
      } else {
        setEmailWarning("");
      }
    } else if (e.target.id === "phoneNumber") {
      if (e.target.value === "") {
        setPhoneNumberWarning("전화번호를 입력해주세요.");
      } else {
        setPhoneNumberWarning("");
      }
    }
  };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "var(--bg)",
        }}
        maxWidth="xs"
      >
        <div className={styles.header}>
          <SvgIcon
            fontSize="large"
            sx={{
              width: "56px",
              height: "56px",
            }}
          >
            <svg
              width="416"
              height="392"
              viewBox="0 0 416 392"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M111.445 332.608H216.643"
                stroke="#7c3f34"
                stroke-width="16"
              />
              <path
                d="M112.322 20.5198H216.643V38.0529M112.322 20.5198H8V74.8722M112.322 20.5198V74.8722M112.322 74.8722H8M112.322 74.8722H216.643M112.322 74.8722V323.841M8 74.8722V323.841M216.643 74.8722V323.841M216.643 74.8722V38.0529M112.322 323.841V381.7M112.322 323.841H8M112.322 381.7H8V323.841M112.322 381.7H216.643V323.841M216.643 323.841V38.0529M216.643 38.0529L314.828 10L329.411 64.3524M216.643 38.0529L232.423 92.4053M232.423 92.4053L298.347 323.841M232.423 92.4053L329.411 64.3524M391.974 297.542L298.347 323.841M391.974 297.542L406 351.894L314.828 381.7L298.347 323.841M391.974 297.542L329.411 64.3524"
                stroke="#7c3f34"
                stroke-width="16"
              />
            </svg>
          </SvgIcon>
          <span className={styles.title}>Mybrary</span>
        </div>
        <Typography
          component="h1"
          variant="h5"
          sx={{
            my: 1,
            fontSize: "1.25rem",
            fontWeight: 500,
          }}
        >
          비밀번호 찾기
        </Typography>
        <Box
          component="form"
          onSubmit={findPasswordHandler}
          sx={{
            mt: 1,
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            padding: "0 16px",
          }}
        >
          <Typography
            sx={{
              fontSize: "0.8rem",
            }}
          >
            비밀번호는 <b>암호화 저장</b>되어 분실 시 찾아드릴 수 없는 정보
            입니다.
          </Typography>
          <Typography
            sx={{
              fontSize: "0.8rem",
            }}
          >
            <b>본인 확인</b>을 통해 비밀번호를 재설정 하실 수 있습니다.
          </Typography>
          <TextField
            error={emailWarning !== ""}
            margin="dense"
            name="email"
            id="email"
            label="아이디(이메일)"
            type="email"
            autoComplete="email"
            color="secondary"
            onBlur={inputBlurHandler}
            helperText={emailWarning}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            error={phoneNumberWarning !== ""}
            margin="dense"
            name="phoneNumber"
            id="phoneNumber"
            label="전화번호"
            type="tel"
            color="secondary"
            onBlur={inputBlurHandler}
            helperText={phoneNumberWarning}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Grid mt={1}>
            <Button
              type="submit"
              fullWidth
              sx={{
                fontSize: "1.25rem",
                color: "#ffffff",
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              비밀번호 재설정
            </Button>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
