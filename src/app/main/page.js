"use client";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import { Button, Rating } from "@mui/material";
import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { parseCookies } from "nookies";

export default function Main() {
  useLayoutEffect(() => {
    // 나의 아카이빙 페치
    fetchMyLibrary();
    // 이전의 추천 책 페치
    fetchRecommendation();
    // 실시간 베스트 셀러 페치
    fetchBestSeller();
  }, []);

  const [bookMark, setBookMark] = useState({});
  const [recommendation, setRecommendation] = useState([]);
  const [bestSeller, setBestSeller] = useState([]);

  const fetchMyLibrary = async () => {
    try {
      const res = await fetch(`${process.env.PRODUCTION_SERVER_HOST}/my_book`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: parseCookies(null, "token").token,
        },
      });
      const resJson = await res.json();
      console.log("나의 아카이빙", resJson);
      if (resJson.result === "success") {
      } else if (resJson.result === "empty") {
      } else {
        alert("서버에서 오류가 발생했습니다.");
      }
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  const fetchRecommendation = async () => {
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/myBookList`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
        }
      );
      const resJson = await res.json();
      console.log("추천 픽", resJson);
      if (resJson.result === "success") {
        setRecommendation(resJson.book_list);
      } else if (resJson.result === "empty") {
      } else {
        alert("서버에서 오류가 발생했습니다.");
      }
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  const fetchBestSeller = async () => {
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/aladin/bestseller`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
        }
      );

      if (res.status === 200) {
        const resJson = await res.json();
        const tempBestSeller = resJson.item.map((item) => {
          return {
            ...item,
            author: item.author.split("(")[0],
          };
        });
        setBestSeller(tempBestSeller);
      } else {
        alert("서버에서 오류가 발생했습니다.");
      }
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mybrary}>
        <span className={styles.headTitle}>나의 아카이빙</span>
        {Object.keys(bookMark).length > 0 ? (
          <div className={styles.mybraryContent}>
            <img
              className={styles.bookMarkImg}
              src={"./rose.png"}
              alt="북마크"
            />
            <div className={styles.mybraryText}>
              <div className={styles.mybraryTitle}>어린 왕자</div>
              <div className={styles.mybraryDescription}>
                "네 장미꽃을 소중하게 만든 것은 그 꽃을 위해 네가 소비한
                시간이란다"
              </div>
              <div className={styles.mybraryDate}>2024.03.30</div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyContent}>
            기록된 책이 없습니다.
            <Link href="/mybrary">
              <Button
                fullWidth
                sx={{
                  fontSize: "1rem",
                  color: "#ffffff",
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                나만의 독서기록 하러가기
              </Button>
            </Link>
          </div>
        )}
        <Link href="/mybrary" className={styles.mybraryLink}>
          <span>아카이빙 더보기 -{">"}</span>
        </Link>
      </div>
      <div className={styles.mybrary}>
        <span className={styles.headTitle}>이전의 추천 책</span>
        {recommendation?.length > 0 ? (
          <div className={styles.recommendationContent}>
            {recommendation?.map((imgLink, idx) => {
              return (
                <div className={styles.book} key={imgLink}>
                  <Link
                    href={{
                      pathname: "/find",
                      query: { choice: idx },
                    }}
                  >
                    <img
                      className={styles.bookCoverImg}
                      src={imgLink}
                      alt="북마크"
                      width={132}
                      height={185}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyContent}>
            추천받은 책이 없습니다.
            <Link href="/find">
              <Button
                fullWidth
                sx={{
                  fontSize: "1rem",
                  color: "#ffffff",
                  backgroundColor: "primary.main",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
              >
                나를 위한 도서 추천 받으러 가기
              </Button>
            </Link>
          </div>
        )}
        {recommendation?.length > 0 && (
          <Link href="/find" className={styles.mybraryLink}>
            <span>책 추천 받기 -{">"}</span>
          </Link>
        )}
      </div>
      <div className={styles.mybrary}>
        <span className={styles.headTitle}>실시간 베스트 셀러</span>
        {bestSeller?.length > 0 && (
          <div className={styles.bestSellerContent}>
            {bestSeller?.map((book) => {
              return (
                <Link
                  className={styles.bestSeller}
                  key={book}
                  href={book?.link}
                  targe="_blank"
                >
                  <div className={styles.bestSellerCoverImgLink}>
                    <img
                      className={styles.bestSellerCoverImg}
                      src={book?.cover}
                      alt={`${book?.title} 표지`}
                    />
                  </div>
                  <div className={styles.bestSellerInfo}>
                    <div className={styles.bestSellerTitle}>
                      {book?.title?.length > 14
                        ? `${book?.title.slice(0, 14)}..`
                        : book?.title}
                    </div>
                    <div className={styles.bestSellerDescription}>
                      <span>
                        {book?.author?.length > 15
                          ? `${book?.author.slice(0, 15)}..`
                          : book?.author}
                      </span>
                      <span>
                        {book?.publisher?.length > 15
                          ? `${book?.publisher.slice(0, 15)}..`
                          : book?.publisher}
                      </span>
                      <span>{book?.pubDate}</span>
                      <span>{book?.priceSales?.toLocaleString()}원</span>
                    </div>
                    {/* <div className={styles.bestSellerRating}>
                      <Rating
                      name="read-only"
                      value={4.2}
                        precision={0.1}
                        readOnly
                      />
                      <div className={styles.bestSellerRatingCount}>4.2</div>
                    </div> */}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      <Navigation value={0} />
    </div>
  );
}
