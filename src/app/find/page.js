"use client";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import { Autocomplete, Button, Modal, TextField } from "@mui/material";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import { parseCookies } from "nookies";
import {
  recommendationListState,
  recommendationState,
  userBookListState,
  userDataState,
} from "@/components/recoil/atom";
import { useRecoilState, useRecoilValue } from "recoil";

export default function Find() {
  const [bookList, setBookList] = useState([]);
  const userData = useRecoilValue(userDataState);
  const userBookList = useRecoilValue(userBookListState);
  const [searched, setSearched] = useState(false);
  const [recommendation, setRecommendation] =
    useRecoilState(recommendationState);
  const [recommendationList, setRecommendationList] = useRecoilState(
    recommendationListState
  );
  const [selectedBook, setSelectedBook] = useState({});
  const [findLoading, setFindLoading] = useState(false);

  // 새 책 추천 받기 모달
  const [newBookRecommendationOpen, setNewBookRecommendationOpen] =
    useState(false);

  const keywordList1 = [
    "시대",
    "역사",
    "철학",
    "로맨스",
    "전쟁",
    "미스터리",
    "예술",
    "판타지",
    "자서전",
    "동화",
    "과학",
    "무협",
  ];
  const keywordList2 = [
    "고민",
    "열정",
    "도전",
    "긍정",
    "후회",
    "행복",
    "우울",
    "위로",
    "고통",
    "자유",
    "희망",
    "슬픔",
    "열망",
    "비극",
    "불안",
    "용기",
    "절망",
    "불행",
    "유머",
    "힐링",
  ];
  const keywordList3 = [
    "리더십",
    "시간",
    "페미니즘",
    "취업",
    "진로",
    "비즈니스",
    "설득",
    "건강",
    "심리",
    "시",
    "희곡",
    "가족",
    "관계",
    "동물",
    "사진",
    "그림",
    "여행",
    "미술",
    "영화",
    "음악",
    "영화",
    "음악",
    "음식",
    "일기",
    "자연",
    "종교",
    "사랑",
    "인간",
    "생각",
    "사회",
    "인생",
    "일상",
    "친구",
    "성공",
    "청춘",
    "정치",
    "취미",
    "스포츠",
  ];

  const [firstKeyword, setFirstKeyword] = useState("");
  const [secondKeyword, setSecondKeyword] = useState("");
  const [thirdKeyword, setThirdKeyword] = useState("");

  useLayoutEffect(() => {
    if (recommendationList?.length > 0) {
      setSearched(true);
    }
  }, []);

  // useEffect(() => {
  //   if (userBookList.length > 0) {
  //     setBookList(userData.bookList);
  //   }
  // }, [userData]);

  console.log("SEARCHED", searched);

  const recommendationHandler = async () => {
    try {
      setFindLoading(true);
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/findRecommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
          body: JSON.stringify({
            user_genre: firstKeyword,
            user_mood: secondKeyword,
            user_interest: thirdKeyword,
          }),
        }
      );
      const resJson = await res.json();
      console.log("추천 페치", resJson);
      if (resJson.result === "success") {
        const tempBookList = resJson.books.map((book) => {
          return {
            ...book,
            author: book.author.split("(")[0],
          };
        });

        setRecommendationList(tempBookList);
        setSearched(true);
        setFindLoading(false);
      } else if (resJson.result === "empty") {
        setFindLoading(false);
      } else {
        setFindLoading(false);

        alert("서버에서 오류가 발생했습니다.");
      }
    } catch (err) {
      setFindLoading(false);

      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  const recommendationFromZeroHandler = async () => {
    try {
      if (firstKeyword === "" || secondKeyword === "" || thirdKeyword === "") {
        alert("모든 항목을 선택해주세요.");
      }
      setNewBookRecommendationOpen(false);
      setFindLoading(true);
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/findRecommend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
          body: JSON.stringify({
            user_genre: firstKeyword,
            user_mood: secondKeyword,
            user_interest: thirdKeyword,
          }),
        }
      );
      const resJson = await res.json();
      console.log("추천 페치", resJson);
      if (resJson.result === "success") {
        const tempBookList = resJson.books.map((book) => {
          return {
            ...book,
            author: book.author.split("(")[0],
          };
        });

        setRecommendationList(tempBookList);
        setSearched(true);
        setFindLoading(false);
      } else if (resJson.result === "empty") {
        setFindLoading(false);
      } else {
        setFindLoading(false);

        alert("서버에서 오류가 발생했습니다.");
      }
    } catch (err) {
      setFindLoading(false);

      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  const recommendationModalOpener = () => {
    setFirstKeyword("");
    setSecondKeyword("");
    setThirdKeyword("");
    setNewBookRecommendationOpen(true);
  };

  return (
    <div className={styles.container}>
      <Modal
        open={newBookRecommendationOpen}
        onClose={() => setNewBookRecommendationOpen(false)}
      >
        <div className={styles.modal}>
          <div className={styles.modalTitle}>
            <span>나만의 도서 추천</span>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.modalInput}>
              <span>어떤 분야의 책을 찾으세요?</span>
              <Autocomplete
                value={firstKeyword}
                onChange={(e, value) => setFirstKeyword(value)}
                options={keywordList1}
                renderInput={(params) => (
                  <TextField fullWidth {...params} variant="standard" />
                )}
              />
            </div>
            <div className={styles.modalInput}>
              <span>어떤 감정을 담은 책을 찾으세요?</span>
              <Autocomplete
                value={secondKeyword}
                onChange={(e, value) => setSecondKeyword(value)}
                options={keywordList2}
                renderInput={(params) => (
                  <TextField fullWidth {...params} variant="standard" />
                )}
              />
            </div>
            <div className={styles.modalInput}>
              <span>어떤 주제의 책을 찾으세요?</span>
              <Autocomplete
                value={thirdKeyword}
                onChange={(e, value) => setThirdKeyword(value)}
                options={keywordList3}
                renderInput={(params) => (
                  <TextField fullWidth {...params} variant="standard" />
                )}
              />
            </div>
          </div>
          <div className={styles.modalBtnContainer}>
            <Button
              fullWidth
              sx={{
                fontSize: "1.25rem",
                color: "#ffffff",
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
              onClick={recommendationFromZeroHandler}
            >
              추천 받기
            </Button>
            <Button
              fullWidth
              sx={{
                fontSize: "1.25rem",
                color: "#ffffff",
                backgroundColor: "#222849",
                "&:hover": {
                  backgroundColor: "#272200",
                },
              }}
              onClick={() => setNewBookRecommendationOpen(false)}
            >
              닫기
            </Button>
          </div>
        </div>
      </Modal>
      {bookList?.length > 0 ? (
        <>
          {searched ? (
            <div className={styles.recommendationContainer}>
              <div className={styles.title}>
                <span>나만의 도서 추천</span>
              </div>
              <div className={styles.bookCover}>
                {recommendationList?.map((book, index) => (
                  <div key={index} className={styles.book}>
                    <img
                      className={
                        selectedBook?.isbn === book?.isbn
                          ? styles.bookCoverSelected
                          : styles.bookCoverImg
                      }
                      src={book?.cover}
                      alt={book?.title}
                      width={105}
                      height={136}
                      onClick={() => setSelectedBook(book)}
                    />
                  </div>
                ))}
              </div>
              {Object.keys(selectedBook).length > 0 && (
                <>
                  <div className={styles.bookTitleContainer}>
                    <span className={styles.bookTitle}>
                      {selectedBook?.title?.length > 30
                        ? selectedBook?.title.slice(0, 30) + ".."
                        : selectedBook?.title}
                    </span>
                    <div className={styles.bookSubTitle}>
                      <span>
                        {selectedBook?.author?.length > 15
                          ? selectedBook?.author.slice(0, 15) + ".."
                          : selectedBook?.author}
                      </span>
                      <span>
                        {selectedBook?.publisher?.length > 15
                          ? selectedBook?.publisher.slice(0, 15) + ".."
                          : selectedBook?.publisher}
                      </span>
                      <span>{selectedBook?.pubDate}</span>
                    </div>
                  </div>
                  <div className={styles.bookInfo}>
                    <span className={styles.bookDescriptionSpan}>
                      {selectedBook?.description}
                    </span>
                  </div>
                  <div className={styles.btnContainer}>
                    <Button
                      fullWidth
                      sx={{
                        fontSize: "1.25rem",
                        color: "#ffffff",
                        backgroundColor: "#222849",
                        "&:hover": {
                          backgroundColor: "#272200",
                        },
                      }}
                      onClick={() => {
                        setSearched(false);
                        setSelectedBook({});
                        setRecommendation([]);
                        setRecommendationList([]);
                      }}
                    >
                      다시하기
                    </Button>
                    <Button
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
                      <Link href={selectedBook?.link} target="_blank">
                        구매하기
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : findLoading ? (
            <div className={styles.body}>
              <img
                src="/findLoading.gif"
                alt="Loading"
                width={400}
                height={300}
              />
              <span className={styles.findBookText}>
                추천 도서 탐색중입니다...
              </span>
            </div>
          ) : (
            <div className={styles.body}>
              <svg width="71" height="71" viewBox="0 0 71 71" fill="none">
                <rect width="71" height="71" fill="url(#pattern0_22_3)" />
                <defs>
                  <pattern
                    id="pattern0_22_3"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use href="#image0_22_3" transform="scale(0.0111111)" />
                  </pattern>
                  <image
                    id="image0_22_3"
                    width="90"
                    height="90"
                    href="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              <span>
                기록해주신 도서를 기반으로 새로운 책을 추천해드릴게요.
              </span>
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
                onClick={recommendationHandler}
              >
                독서기록 기반 추천 받기
              </Button>
            </div>
          )}
        </>
      ) : (
        <>
          {searched ? (
            <div className={styles.recommendationContainer}>
              <div className={styles.title}>
                <span>나만의 도서 추천</span>
              </div>
              <div className={styles.bookCover}>
                {recommendationList?.map((book, index) => (
                  <div key={index} className={styles.book}>
                    <img
                      className={
                        selectedBook?.isbn === book?.isbn
                          ? styles.bookCoverSelected
                          : styles.bookCoverImg
                      }
                      src={book?.cover}
                      alt={book?.title}
                      width={105}
                      height={136}
                      onClick={() => setSelectedBook(book)}
                    />
                  </div>
                ))}
              </div>
              {Object.keys(selectedBook).length > 0 && (
                <>
                  <div className={styles.bookTitleContainer}>
                    <span className={styles.bookTitle}>
                      {selectedBook?.title?.length > 30
                        ? selectedBook?.title.slice(0, 30) + ".."
                        : selectedBook?.title}
                    </span>
                    <div className={styles.bookSubTitle}>
                      <span>
                        {selectedBook?.author?.length > 15
                          ? selectedBook?.author.slice(0, 15) + ".."
                          : selectedBook?.author}
                      </span>
                      <span>
                        {selectedBook?.publisher?.length > 15
                          ? selectedBook?.publisher.slice(0, 15) + ".."
                          : selectedBook?.publisher}
                      </span>
                      <span>{selectedBook?.pubDate}</span>
                    </div>
                  </div>
                  <div className={styles.bookInfo}>
                    <span className={styles.bookDescriptionSpan}>
                      {selectedBook?.description}
                    </span>
                  </div>
                  <div className={styles.btnContainer}>
                    <Button
                      fullWidth
                      sx={{
                        fontSize: "1.25rem",
                        color: "#ffffff",
                        backgroundColor: "#222849",
                        "&:hover": {
                          backgroundColor: "#272200",
                        },
                      }}
                      onClick={() => {
                        setSearched(false);
                        setSelectedBook({});
                        setRecommendation([]);
                        setRecommendationList([]);
                      }}
                    >
                      다시하기
                    </Button>
                    <Button
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
                      <Link href={selectedBook?.link} target="_blank">
                        구매하기
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : findLoading ? (
            <div className={styles.body}>
              <img
                src="/findLoading.gif"
                alt="Loading"
                width={400}
                height={300}
              />
              <span className={styles.findBookText}>
                추천 도서 탐색중입니다...
              </span>
            </div>
          ) : (
            <div className={styles.body}>
              <svg width="71" height="71" viewBox="0 0 71 71" fill="none">
                <rect width="71" height="71" fill="url(#pattern0_22_3)" />
                <defs>
                  <pattern
                    id="pattern0_22_3"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use href="#image0_22_3" transform="scale(0.0111111)" />
                  </pattern>
                  <image
                    id="image0_22_3"
                    width="90"
                    height="90"
                    href="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              {/* <span>아직 독서기록이 없어요!</span> */}
              <span>키워드만 고르면 맞춤 독서 추천을 받을 수 있어요!</span>
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
                onClick={recommendationModalOpener}
              >
                나의 첫 도서 추천 받기
              </Button>
            </div>
          )}
        </>
      )}

      <Navigation value={2} />
    </div>
  );
}
