"use client";
import { useState, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
// import auth from "@/firebase/fireauth";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
// } from "firebase/auth";
import { useRecoilState } from "recoil";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { userDataState } from "@/components/recoil/atom.js";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingButton } from "@mui/lab";
import Fernet from "fernet";
import styles from "./page.module.css";
import Image from "next/image";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailWarning, setEmailWarning] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [userData, setUserData] = useRecoilState(userDataState);
  const router = useRouter();
  const [loginLoading, setloginLoading] = useState(false);
  // const [couponList, setCouponList] = useRecoilState(couponListState);
  const [saveId, setSaveId] = useState(false);
  const [loginTry, setLoginTry] = useState(0);
  const [countDown, setCountDown] = useState(null);
  const [emailDisabled, setEmailDisabled] = useState(false);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const fernetKey = process.env.FERNET_DECRYPTION_KEY;

  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [snackBarArticle, setSnackBarArticle] = useState("");
  const [snackBarStatus, setSnackBarStatus] = useState("");

  const decryptData = (encryptedData, key) => {
    const secret = new Fernet.Secret(key);
    const token = new Fernet.Token({
      secret: secret,
      token: encryptedData,
      ttl: 0,
    });

    return token.decode();
  };

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      if (localStorage.getItem("email")) {
        setEmail(localStorage.getItem("email"));
      }
      setSaveId(localStorage.getItem("toggle") === "true");
    }
  }, []);

  useEffect(() => {
    if (loginTry / 5 > 1) {
      setCountDown(60);
      setEmailDisabled(true);
      const interval = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
      setTimeout(() => {
        setEmailDisabled(false);
        clearInterval(interval);
        setCountDown(null);
      }, 60 * 1000);
    }
  }, [loginTry]);

  const fetchUserDb = async () => {
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/db/userInfo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
            CSRFToken: parseCookies(null, "CSRFToken").CSRFToken,
          },
        }
      );
      const encryptedData = await res.text();
      const decryptedData = decryptData(encryptedData, fernetKey);
      const resJson = JSON.parse(decryptedData);
      const resp = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/db/coupon`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
            CSRFToken: parseCookies(null, "CSRFToken").CSRFToken,
          },
        }
      );
      const encryptedData2 = await resp.text();
      const decryptedData2 = decryptData(encryptedData2, fernetKey);
      const respJson = JSON.parse(decryptedData2);
      let updatedCouponList = [];
      if (respJson.result === "success") {
        for (let idx in respJson.data) {
          updatedCouponList.push(respJson.data[idx]);
        }
      }
      if (resJson.result === "success") {
        // setUserData({
        //   createdAt: resJson.data.createdAt,
        //   email: resJson.data.email,
        //   name: resJson.data.name,
        //   payment: resJson.data.payment,
        //   paymentNumber: resJson.data.paymentNumber,
        //   phoneNumber: resJson.data.phoneNumber,
        //   referralCode: resJson.data.referralCode,
        //   subscribeAt: resJson.data.subscribeAt,
        //   subscribeEndAt: resJson.data.subscribeEndAt,
        //   subscribe_level: resJson.data.subscribe_level,
        //   termsOfUseCheck: resJson.data.termsOfUseCheck,
        //   point: resJson.data.point,
        //   couponList: updatedCouponList,
        //   extend: resJson.data.extend,
        //   willUsingPoint: resJson.data.willUsingPoint,
        //   prevDeleteUser: resJson.data.prevDeleteUser,
        //   firstPayment: resJson.data.firstPayment,
        //   freeTrial: resJson.data.freeTrial,
        // });
      } else {
        setSnackBarOpen(true);
        setSnackBarStatus("error");
        setSnackBarArticle(
          "사용자 정보 불러오기에 실패했습니다. 새로고침 후 다시 시도해주세요."
        );
      }
    } catch (err) {
      setSnackBarOpen(true);
      setSnackBarStatus("error");
      setSnackBarArticle(
        `오류가 발생했습니다. 새로고침 후 다시 시도해주세요. ${err}`
      );
    }
  };

  // const loginHandler = async (e) => {
  //   e.preventDefault();
  //   setLoginTry(loginTry + 1);
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("toggle", saveId);
  //     if (saveId) {
  //       localStorage.setItem("email", email);
  //     } else {
  //       localStorage.setItem("email", "");
  //     }
  //   }
  //   if (email !== "" && password !== "") {
  //     setloginLoading(true);
  //     // console.log("login!");
  //     let credential;
  //     //  console.log(parseCookies(null, 'token').token);
  //     //   const res = await fetch('http://127.0.0.1:8000/cookietest', {
  //     //     method: 'GET',
  //     //     headers: {
  //     //         'Content-Type': 'application/json',
  //     //         token: parseCookies(null, 'token').token,
  //     //         CSRFToken: parseCookies(null, 'CSRFToken').CSRFToken,
  //     //     },
  //     // });
  //     // const resJson = await res.json();
  //     // console.log(resJson);
  //     try {
  //       credential = await signInWithEmailAndPassword(auth, email, password);
  //     } catch (error) {
  //       if (error.code === "auth/user-not-found") {
  //         setSnackBarOpen(true);
  //         setSnackBarStatus("error");
  //         setSnackBarArticle("존재하지 않는 아이디입니다.");
  //         setloginLoading(false);
  //       }
  //       if (error.code === "auth/wrong-password") {
  //         setSnackBarOpen(true);
  //         setSnackBarStatus("error");
  //         setSnackBarArticle("비밀번호가 일치하지 않습니다.");
  //         setloginLoading(false);
  //       }
  //       return;
  //     }
  //     const idToken = await credential.user.getIdToken();
  //     // console.log(idToken);
  //     const session = await fetch(
  //       `${process.env.PRODUCTION_SERVER_HOST}/login`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           token: idToken,
  //         },
  //       }
  //     );
  //     const encryptedData = await session.text();
  //     const decryptedData = decryptData(encryptedData, fernetKey);
  //     const sessionJson = JSON.parse(decryptedData);
  //     // console.log(sessionJson);
  //     // console.log(session.status);
  //     if (session.status === 200) {
  //       // console.log("login success!");
  //       destroyCookie(null, "CSRFToken");
  //       setCookie(null, "CSRFToken", sessionJson.csrf_token, {
  //         maxAge: 5 * 24 * 60 * 60,
  //         path: "/",
  //         secure: true,
  //       });
  //       //nookies 라이브러리를 사용하여 쿠키를 생성합니다.
  //       destroyCookie(null, "token");
  //       setCookie(null, "token", sessionJson.session_cookie, {
  //         maxAge: 5 * 24 * 60 * 60,
  //         path: "/",
  //         secure: true,
  //       });
  //       await fetchUserDb();
  //       setUserState(true);
  //       // 홈으로 주소 이동
  //       console.log(redirect);
  //       router.push(`${redirect ? redirect : "/"}`);
  //     }
  //   } else {
  //     if (email === "") {
  //       setEmailWarning("이메일을 입력해주세요.");
  //     } else if (!email.includes("@") || !email.includes(".")) {
  //       setEmailWarning("이메일 형식으로 입력해주세요. ex)@naver.com");
  //     } else {
  //       setEmailWarning("");
  //     }

  //     if (password === "") {
  //       setPasswordWarning("비밀번호를 입력해주세요.");
  //     } else {
  //       setPasswordWarning("");
  //     }
  //   }
  // };

  const loginHandler = (e) => {
    e.preventDefault();
  };

  const inputBlurHandler = (e) => {
    if (e.target.id === "email") {
      if (e.target.value === "") {
        setEmailWarning("이메일을 입력해주세요.");
      } else if (
        !e.target.value.includes("@") ||
        !e.target.value.includes(".")
      ) {
        setEmailWarning("이메일 형식으로 입력해주세요. ex)@naver.com");
      } else {
        setEmailWarning("");
      }
    } else if (e.target.id === "password") {
      if (e.target.value === "") {
        setPasswordWarning("비밀번호를 입력해주세요.");
      } else {
        setPasswordWarning("");
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
        }}
        maxWidth="xs"
      >
        <div className={styles.header}>
          <span>Mybrary</span>
        </div>
        <Box
          component="form"
          onSubmit={loginHandler}
          sx={{ mt: 1, display: "flex", flexDirection: "column", width: 350 }}
        >
          <TextField
            error={emailWarning !== ""}
            margin="dense"
            name="email"
            id="email"
            label="이메일"
            type="email"
            autoComplete="email"
            color="secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={inputBlurHandler}
            helperText={emailWarning}
          />
          {countDown > 0 && emailDisabled ? (
            <Typography
              sx={{
                fontSize: "0.75rem",
                mx: "14px",
              }}
            >
              로그인 시도 횟수를 초과하였어요. 😭 {countDown}초 후에 재시도 가능
            </Typography>
          ) : null}
          <FormControl
            variant="outlined"
            sx={{ mt: 1 }}
            color="secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordWarning !== ""}
          >
            <InputLabel>비밀번호</InputLabel>
            <OutlinedInput
              margin="dense"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="비밀번호"
              onBlur={inputBlurHandler}
              helperText={passwordWarning}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setShowPassword(!showPassword);
                    }}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText>{passwordWarning}</FormHelperText>
          </FormControl>
          <Grid
            item
            xs
            my={1}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  disableRipple
                  checked={saveId}
                  onClick={(e) => {
                    setSaveId(e.target.checked);
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="아이디 기억하기"
            />
            <Button
              disableRipple
              sx={{
                color: "primary.main",
                backgroundColor: "inherit",
                fontSize: "1rem",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              <Link href="/findPassword">비밀번호 찾기</Link>
            </Button>
          </Grid>
          {loginLoading ? (
            <LoadingButton
              loading
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
              로그인
            </LoadingButton>
          ) : (
            <Button
              type="submit"
              disableRipple
              fullWidth
              sx={{
                fontSize: "1.25rem",
                color: "#ffffff",
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              disabled={emailDisabled}
            >
              로그인
            </Button>
          )}
          <Grid
            mt={2}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              disableRipple
              my={15}
              sx={{
                color: "primary.main",
                backgroundColor: "inherit",
                width: "100%",
                fontSize: "1.25rem",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
              onClick={() =>
                router.push(`/signUp${redirect ? `?redirect=${redirect}` : ""}`)
              }
            >
              회원가입
            </Button>
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
