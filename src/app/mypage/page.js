"use client";
import { useRecoilState, useRecoilValue } from "recoil";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import {
  catColorState,
  userBookListState,
  userBookMarkListState,
  userDataState,
} from "@/components/recoil/atom";
import { Avatar, Button, Tooltip } from "@mui/material";
import UserBookDonutChart from "@/components/charts/UserBookDonutChart";
import { useLayoutEffect, useState } from "react";
import CatSelectModal from "@/components/modal/CatSelectModal";

export default function MyPage() {
  const [userData, setUserData] = useRecoilState(userDataState);
  const [bookList, setBookList] = useRecoilState(userBookListState);
  const [bookMarkList, setBookMarkList] = useRecoilState(userBookMarkListState);
  const catColor = useRecoilValue(catColorState);

  // 고양이 선택 모달
  const [catSelectModalOpen, setCatSelectModalOpen] = useState(false);

  useLayoutEffect(() => {
    if (Object.keys(userData).length === 0 || bookList.length === 0) {
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/userInfo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
        }
      );
      const resJson = await res.json();
      console.log(resJson);
      let tempUserData = {};
      if (resJson.result === "success") {
        console.log("USER", resJson.user);
        tempUserData = {
          ...tempUserData,
          ...resJson.user,
        };
        setUserData(tempUserData);
        setBookList(resJson.book_list);
      } else {
      }
    } catch (err) {
      return;
    }
  };

  const favGenre = () => {
    const genreList = bookList?.map((book) => book.genre);
    const genreCount = genreList?.reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});

    console.log("GENRE", genreCount);

    if (genreCount === undefined) return "";

    if (Object.keys(genreCount)?.length > 0) {
      const maxGenre = Object.keys(genreCount)?.reduce((a, b) =>
        genreCount[a] > genreCount[b] ? a : b
      );
      return maxGenre;
    }
    return "";
  };

  const genreChartLabel = () => {
    const genreList = bookList?.map((book) => book.genre);
    const genreCount = genreList?.reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});

    return genreCount;
  };

  const genreChartPercentageLabel = () => {
    const genreList = genreChartLabel();
    if (genreList === undefined) return [];
    if (Object.values(genreList)?.length === 0) return [];
    const genreTotal = Object.values(genreList)?.reduce((a, b) => a + b);
    const genreKey = Object.keys(genreList);
    const genrePercentage = Object.values(genreList)?.map(
      (genre) => (genre / genreTotal) * 100
    );

    const genrePercentageLabel = genreKey?.map((genre, index) => {
      return { [genre]: genrePercentage[index] };
    });

    return genrePercentageLabel;
  };

  const catTitle = () => {
    if (bookMarkList.length < 3) {
      return `Lv.1 ${catColor}`;
    } else if (bookMarkList.length < 9) {
      return `Lv.2 ${catColor}`;
    } else if (bookMarkList.length < 15) {
      return `Lv.3 ${catColor}`;
    }
    return `Lv.4 ${catColor}`;
  };

  const bookMarkLevel = () => {
    if (bookMarkList.length < 3) {
      return 1;
    } else if (bookMarkList.length < 9) {
      return 2;
    } else if (bookMarkList.length < 15) {
      return 3;
    }
    return 4;
  };

  return (
    <div className={styles.container}>
      <CatSelectModal
        open={catSelectModalOpen}
        onClose={() => setCatSelectModalOpen(false)}
      />
      <div className={styles.userInfoContainer}>
        <div className={styles.userIcon}>
          <Avatar
            sx={{
              backgroundColor: "third.main",
              width: "55px",
              height: "55px",
            }}
          />
        </div>
        <div className={styles.userInfo}>
          <div className={styles.infoContainer}>
            <span>닉네임</span>
            <span className={styles.infoLabel}>{userData?.name}</span>
          </div>
          <div className={styles.infoContainer}>
            <span>레벨</span>
            <span className={styles.infoLabel}>
              {userData?.level || "초보독자"}
            </span>
          </div>
          <div className={styles.infoContainer}>
            <span>가입일</span>
            <span className={styles.infoLabel}>
              {userData?.createdAt?.split("T")[0]}
            </span>
          </div>
        </div>
      </div>
      <div className={styles.bookInfo}>
        <div className={styles.bookInfoContainer}>
          <span>전체 독서량</span>
          <span className={styles.bookInfoLabel}>{bookList?.length}</span>
        </div>
        <div className={styles.bookInfoContainer}>
          <span>최애 장르</span>
          <span className={styles.bookInfoLabel}>{favGenre()}</span>
        </div>
      </div>
      <div className={styles.catInfo}>
        {catColor !== "" ? (
          <>
            <span>책냥이 키우기</span>
            <div className={styles.catContainer}>
              <div
                className={styles.catIcon}
                style={{
                  marginLeft: `${(bookMarkList.length / 20) * 100}%`,
                }}
              >
                <Avatar
                  src={`./${catColor}${bookMarkLevel()}.webp`}
                  sx={{
                    backgroundColor: "third.main",
                    width: "50px",
                    height: "50px",
                    my: "4px",
                  }}
                />
                <span>{catTitle()}</span>
              </div>
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBar}
                  style={{ width: `${(bookMarkList.length / 20) * 100}%` }}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <span>책냥이 키우기</span>
            <div className={styles.voidContainer}>
              <span>아직 책냥이를 고르지 않았어요.</span>
              <Button
                fullWidth
                sx={{
                  fontSize: "1.25rem",
                  color: "#ffffff",
                  backgroundColor: "secondary.main",
                  "&:hover": {
                    backgroundColor: "secondary.dark",
                  },
                }}
                onClick={() => setCatSelectModalOpen(true)}
              >
                책냥이 고르기
              </Button>
            </div>
          </>
        )}
      </div>
      <div className={styles.genreInfo}>
        {bookList.length > 0 ? (
          <>
            <span>나의 장르</span>
            <div className={styles.genreChartContainer}>
              <div className={styles.genreChart}>
                <UserBookDonutChart />
              </div>
              <div className={styles.genreChartLabel}>
                {genreChartPercentageLabel()?.map((genre) => (
                  <div className={styles.genreChartLabelContainer} key={genre}>
                    <span>{Object.keys(genre)[0]}</span>
                    <span>{Math.round(Object.values(genre)[0])}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <span>나의 장르</span>
            <div className={styles.voidContainer}>
              <span>등록된 도서가 없습니다.</span>
            </div>
          </>
        )}
      </div>

      <Button
        fullWidth
        sx={{
          fontSize: "1.25rem",
          color: "#ffffff",
          backgroundColor: "third.main",
          "&:hover": {
            backgroundColor: "third.dark",
          },
        }}
      >
        SNS 공유하기
      </Button>
      <Navigation value={4} />
    </div>
  );
}
