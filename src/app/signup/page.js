"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Modal,
  OutlinedInput,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { useRecoilCallback, useRecoilState } from "recoil";
import theme from "@/components/ThemeRegistry/theme.js";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { setCookie, parseCookies, destroyCookie } from "nookies";
// import auth from "@/firebase/fireauth.js";
// import { loginState, userDataState } from "@/components/recoil/atom.js";
import { useRouter, useSearchParams } from "next/navigation.js";
import { LoadingButton } from "@mui/lab";
import Fernet from "fernet";
import styles from "./page.module.css";

export default function SignUp() {
  const router = useRouter();

  //   const [loginUser, setLoginUser] = useRecoilState(loginState);
  const [emailWarning, setEmailWarning] = useState("");
  const [passwordWarning, setPasswordWarning] = useState("");
  const [passwordCheckWarning, setPasswordCheckWarning] = useState("");
  const [nameWarning, setNameWarning] = useState("");
  const [phoneNumberWarning, setPhoneNumberWarning] = useState("");
  const [emailCertWarning, setEmailCertWarning] = useState("");
  const [privacyPolicyModalOpened, setPrivacyPolicyModalOpened] =
    useState(false);
  const [termsOfUseModalOpened, setTermsOfUseModalOpened] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // 초대 링크에서 추천인코드 가져오기
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [termsOfUseCheck, setTermsOfUseCheck] = useState(false);
  // 이메일 인증
  const [emailCertCode, setEmailCertCode] = useState("");
  const [emailCertCheck, setEmailCertCheck] = useState(true);
  const [emailCertDisable, setEmailCertDisable] = useState(false);
  const [emailCerted, setEmailCerted] = useState(false);
  const [realEmailCertCode, setRealEmailCertCode] = useState("");
  const [countDown, setCountDown] = useState(null);

  const [signUpLoading, setSignUpLoading] = useState(false);

  const fernetKey = process.env.FERNET_DECRYPTION_KEY;

  const decryptData = (encryptedData, key) => {
    const secret = new Fernet.Secret(key);
    const token = new Fernet.Token({
      secret: secret,
      token: encryptedData,
      ttl: 0,
    });

    return token.decode();
  };

  useEffect(() => {
    if (emailCertCheck) {
      const interval = setInterval(() => {
        setCountDown((prev) => prev - 1);
      }, 1000);
      setTimeout(() => {
        setEmailCertDisable(false);
        setEmailCertCheck(false);
        clearInterval(interval);
        setCountDown(null);
      }, 60 * 1000);
    }
  }, [emailCertCheck]);

  const updateUserDataAndRedirect = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        let today = new Date();
        let year = today.getFullYear();
        let month = (today.getMonth() + 1).toString().padStart(2, "0");
        let day = today.getDate().toString().padStart(2, "0");
        let createdDate = `${year}-${month}-${day}`;

        set(userDataState, {
          createdAt: createdDate,
          email: email,
          name: name,
          payment: "",
          paymentNumber: "",
          phoneNumber: phoneNumber,
          subscribeAt: "",
          subscribeEndAt: "",
          subscribe_level: 0,
          termsOfUseCheck: termsOfUseCheck,
          point: 0,
          firstPayment: false,
        });

        // 홈으로 주소 이동
        router.push(`/${redirect ? redirect.split("/")[1] : ""}`);
      }
  );

  //   const signUpHandler = async (e) => {
  //     e.preventDefault();
  //     setSignUpLoading(true);
  //     const credential = await createUserWithEmailAndPassword(
  //       auth,
  //       email,
  //       password
  //     );
  //     const user = credential.user;
  //     // console.log(user);
  //     const idToken = await credential.user.getIdToken();
  //     const session = await fetch(`${process.env.PRODUCTION_SERVER_HOST}/login`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         token: idToken,
  //       },
  //     });
  //     const encryptedData = await session.text();
  //     const decryptedData = decryptData(encryptedData, fernetKey);
  //     const sessionJson = JSON.parse(decryptedData);
  //     // console.log("SESSION", sessionJson);
  //     console.log(session.status);
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
  //       const updatedoc = await fetch(
  //         `${process.env.PRODUCTION_SERVER_HOST}/signup`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //             token: parseCookies(null, "token").token,
  //             CSRFToken: parseCookies(null, "CSRFToken").CSRFToken,
  //           },
  //           body: JSON.stringify({
  //             email: email,
  //             name: name,
  //             phoneNumber: phoneNumber,
  //           }),
  //         }
  //       );
  //       updateUserDataAndRedirect();
  //     }
  //   };

  const signUpHandler = async (e) => {
    e.preventDefault();
    if (
      emailWarning !== "" ||
      passwordWarning !== "" ||
      passwordCheckWarning !== "" ||
      nameWarning !== "" ||
      phoneNumberWarning !== "" ||
      email === "" ||
      password === "" ||
      passwordCheck !== password ||
      name === "" ||
      phoneNumber === ""
    ) {
      alert("입력값을 확인해주세요.");
      return;
    }
  };

  const inputBlurHandler = async (e) => {
    if (e.target.id === "email") {
      if (e.target.value === "") {
        setEmailWarning("이메일을 입력해주세요.");
      } else if (
        !e.target.value.includes("@") ||
        !e.target.value.includes(".")
      ) {
        setEmailWarning("이메일 형식이 올바르지 않습니다.");
      } else {
        setEmailWarning("");
      }
    } else if (e.target.id === "password") {
      if (e.target.value === "") {
        setPasswordWarning("비밀번호를 입력해주세요.");
      } else {
        setPasswordWarning("");
      }
    } else if (e.target.id === "passwordCheck") {
      if (e.target.value === "") {
        setPasswordCheckWarning("비밀번호를 입력해주세요.");
      } else if (e.target.value !== password) {
        setPasswordCheckWarning("비밀번호가 일치하지 않습니다.");
      } else {
        setPasswordCheckWarning("");
      }
    } else if (e.target.id === "name") {
      if (e.target.value === "") {
        setNameWarning("닉네임을 입력해주세요.");
      } else {
        setNameWarning("");
      }
    } else if (e.target.id === "phoneNumber") {
      if (e.target.value === "") {
        setPhoneNumberWarning("전화번호를 입력해주세요.");
      } else {
        setPhoneNumberWarning("");
      }
    } else if (e.target.id === "emailCertCode") {
      if (e.target.value === "") {
        setEmailCertWarning("인증코드를 입력해주세요.");
      } else if (e.target.value !== realEmailCertCode) {
        setEmailCertWarning("인증코드가 일치하지 않습니다.");
      } else {
        setEmailCertWarning("");
      }
    }
  };

  const emailCertificationHandler = async () => {
    if (email === "") {
      setEmailWarning("이메일을 입력해주세요.");
    } else if (!email.includes("@") || !email.includes(".")) {
      setEmailWarning("이메일 형식이 올바르지 않습니다.");
    } else {
      const emailCheck = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/signup/emailCheck`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );
      const emailCheckJson = await emailCheck.json();
      // console.log(emailCheckJson);
      if (emailCheckJson.result === "duplicated") {
        setEmailWarning("이미 가입된 이메일입니다.");
        return;
      }
      setEmailWarning("...");
      fetch("/api/emailCertification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message?.includes("failed")) {
            setEmailWarning("에러가 발생하였습니다. 이메일을 확인해주세요.");
            setCountDown(null);
            setEmailCertCheck(false);
            setEmailCertDisable(false);
          } else {
            setRealEmailCertCode(data.verificationCode);
            setEmailCertCheck(true);
            setEmailCertDisable(true);
            setCountDown(60);
            setEmailWarning(
              "인증 메일이 발송되었습니다. 이메일을 확인해 주세요."
            );
          }
        })
        .catch((err) => {
          console.log("ERROR!", err);
        });
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
        <Box
          component="form"
          onSubmit={signUpHandler}
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
              fontWeight: "bold",
              marginLeft: "5px",
              mb: 1,
            }}
          >
            회원정보를 입력해주세요
          </Typography>
          <FormControl
            variant="outlined"
            sx={{ mt: 1 }}
            color="secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailWarning !== ""}
            // disabled={emailCerted}
          >
            <InputLabel>이메일</InputLabel>
            <OutlinedInput
              margin="dense"
              id="email"
              name="email"
              type="email"
              label="이메일"
              onBlur={inputBlurHandler}
              helperText={passwordWarning}
              //   endAdornment={
              //     <InputAdornment position="end">
              //       <Button
              //
              //         aria-label="email certification"
              //         onClick={emailCertificationHandler}
              //         edge="end"
              //         sx={{
              //           fontSize: "0.85rem",
              //           color: "primary.main",
              //           backgroundColor: "inherit",
              //           "&:hover": {
              //             backgroundColor: "primary.light",
              //           },
              //           "&:disabled": {
              //             color: "rgba(0,0,0,0.12)",
              //             backgroundColor: "inherit",
              //           },
              //         }}
              //         disabled={emailCertDisable || emailCerted}
              //       >
              //         이메일 인증
              //       </Button>
              //     </InputAdornment>
              //   }
            />
            <FormHelperText>{emailWarning}</FormHelperText>
          </FormControl>
          {/* {emailCertCheck ? (
            <TextField
              error={emailCertWarning !== ""}
              margin="dense"
              id="emailCertCode"
              name="emailCertCode"
              type="text"
              size="small"
              label="이메일 인증 코드"
              color="secondary"
              value={emailCertCode}
              onChange={(e) => {
                setEmailCertCode(e.target.value);
                if (e.target.value === realEmailCertCode) {
                  setEmailCertWarning("");
                  setEmailWarning("");
                  setEmailCerted(true);
                } else {
                  setEmailCerted(false);
                }
              }}
              onBlur={inputBlurHandler}
              helperText={emailCertWarning}
              disabled={emailCerted}
              sx={{
                mt: 2,
              }}
            />
          ) : null} */}
          {/* {countDown > 0 && !emailCerted ? (
            <Typography
              sx={{
                fontSize: "0.75rem",
                mx: "14px",
              }}
            >
              이메일이 도착하지 않았나요? {countDown}초 후에 재전송 가능
            </Typography>
          ) : null} */}
          {/* {emailCerted ? (
            <Typography
              sx={{
                fontSize: "0.75rem",
                mx: "14px",
                color: theme.palette.secondary.main,
              }}
            >
              인증 성공
            </Typography>
          ) : null} */}
          <TextField
            error={passwordWarning !== ""}
            margin="dense"
            name="password"
            id="password"
            label="비밀번호"
            type="password"
            color="secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={inputBlurHandler}
            helperText={passwordWarning}
          />
          {password.length > 0 ? (
            <div>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  mx: "8px",
                  color:
                    password.length < 8 || password.length > 16
                      ? theme.palette.primary.main
                      : "rgba(0, 0, 0, 0.87)",
                }}
              >
                v 8문자 이상, 16문자 이하
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  mx: "8px",
                  color: /[0-9]/.test(password)
                    ? "rgba(0, 0, 0, 0.87)"
                    : theme.palette.primary.main,
                }}
              >
                v 숫자 포함
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  mx: "8px",
                  color: /[a-z]/.test(password)
                    ? "rgba(0, 0, 0, 0.87)"
                    : theme.palette.primary.main,
                }}
              >
                v 영(소문자) 포함
              </Typography>
            </div>
          ) : null}
          <TextField
            error={passwordCheckWarning !== ""}
            margin="dense"
            name="passwordCheck"
            id="passwordCheck"
            label="비밀번호 확인"
            type="password"
            color="secondary"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            onBlur={inputBlurHandler}
            helperText={passwordCheckWarning}
            disabled={
              password.length < 8 ||
              password.length > 16 ||
              !/[0-9]/.test(password) ||
              !/[a-z]/.test(password)
            }
          />
          <TextField
            error={nameWarning !== ""}
            margin="dense"
            name="name"
            id="name"
            label="닉네임"
            type="text"
            color="secondary"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={inputBlurHandler}
            helperText={nameWarning}
          />
          <TextField
            error={phoneNumberWarning !== ""}
            margin="dense"
            name="phoneNumber"
            id="phoneNumber"
            label="휴대폰 번호"
            type="tel"
            color="secondary"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onBlur={inputBlurHandler}
            helperText={phoneNumberWarning}
          />
          <Grid item xs mt={1}>
            {signUpLoading ? (
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
                회원가입 완료
              </LoadingButton>
            ) : (
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
                onSubmit={signUpHandler}
              >
                회원가입 완료
                {/* <Link href="/login">회원가입 완료</Link> */}
              </Button>
            )}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}
