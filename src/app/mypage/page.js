"use client";
import { useRecoilValue } from "recoil";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import { userDataState } from "@/components/recoil/atom";
import { Avatar, Button } from "@mui/material";
import UserBookDonutChart from "@/components/charts/UserBookDonutChart";

export default function Find() {
  const userData = useRecoilValue(userDataState);

  console.log("USER", userData);

  const favGenre = () => {
    const genreList = userData?.bookList?.map((book) => book.genre);
    const genreCount = genreList?.reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});

    console.log("GENRE", genreCount);

    if (Object.keys(genreCount)?.length > 0) {
      const maxGenre = Object.keys(genreCount)?.reduce((a, b) =>
        genreCount[a] > genreCount[b] ? a : b
      );
      return maxGenre;
    }
    return "";
  };

  const genreChartLabel = () => {
    const genreList = userData?.bookList?.map((book) => book.genre);
    const genreCount = genreList?.reduce((acc, cur) => {
      acc[cur] = (acc[cur] || 0) + 1;
      return acc;
    }, {});

    return genreCount;
  };

  const genreChartPercentageLabel = () => {
    const genreList = genreChartLabel();
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

  return (
    <div className={styles.container}>
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
            <span className={styles.infoLabel}>{userData?.createdAt}</span>
          </div>
        </div>
      </div>
      <div className={styles.bookInfo}>
        <div className={styles.bookInfoContainer}>
          <span>전체 독서량</span>
          <span className={styles.bookInfoLabel}>{userData?.record_book}</span>
        </div>
        <div className={styles.bookInfoContainer}>
          <span>최애 장르</span>
          <span className={styles.bookInfoLabel}>{favGenre()}</span>
        </div>
      </div>
      <div className={styles.genreInfo}>
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
      <Navigation value={3} />
    </div>
  );
}
