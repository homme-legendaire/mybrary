"use client";
import Navigation from "@/components/Navigation";
import styles from "./page.module.css";
import { useState } from "react";
import { IconButton, MenuItem, Select } from "@mui/material";
import { Favorite, ThumbDown, ThumbUp } from "@mui/icons-material";

export default function Community() {
  const [bookMarkOrder, setBookMarkOrder] = useState("최신순");
  const [bookMarkList, setBookMarkList] = useState([
    {
      title: "어린왕자",
      script: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      src: "https://t1.daumcdn.net/cfile/tistory/998D344B5BF5070114",
    },
    {
      title: "나니아연대기",
      script: "날 피해서 숨은 거예요?",
      src: "https://cdn.hankyung.com/photo/201810/01.17952867.1.jpg",
    },
    {
      title: "인간실격",
      script: "그것은 세상이 용서하지 않아",
      src: "https://i.pinimg.com/564x/a9/ce/79/a9ce79d3065ef432ba1b4412517b0548.jpg",
    },
  ]);
  const [bestBookMark, setBestBookMark] = useState({
    title: "변신",
    script: "그레고르는 더 이상 이러한 소리를 구별할 엄두가 나지 않았다",
    src: "https://t1.daumcdn.net/thumb/R720x0/?fname=http://t1.daumcdn.net/brunch/service/user/1RCf/image/P74IB_A_gUjag8Xk6mL8YqD0XB8.jpg",
  });

  return (
    <div className={styles.container}>
      <div className={styles.bookListHeader}>
        <div className={styles.bookListTitle}>월간 BEST</div>
        <div className={styles.bookListSubTitle}>
          지난 한 달 가장 많은 추천을 받은 책갈피에요!
        </div>
      </div>
      <div className={styles.bookMark}>
        <img src={bestBookMark.src} className={styles.img} />
        <div className={styles.bookMarkText}>
          <span className={styles.bookMarkTitle}>{bestBookMark.title}</span>
          <span className={styles.bookMarkScript}>{bestBookMark.script}</span>
        </div>
        <div className={styles.bookMarkBtnContainer}>
          <div className={styles.bookMarkBtn}>
            <IconButton>
              <ThumbUp />
            </IconButton>
            <span>194</span>
          </div>
          <div className={styles.bookMarkBtn}>
            <IconButton
              sx={{
                width: "50%",
              }}
            >
              <ThumbDown />
            </IconButton>
            <span>28</span>
          </div>
        </div>
      </div>

      <div className={styles.bookListHeader}>
        <div className={styles.bookListTitle}>사용자 책갈피 리스트</div>
        <div className={styles.bookListSubTitle}>
          다른 사용자들의 책갈피를 확인해보세요!
        </div>
      </div>
      <Select
        value={bookMarkOrder}
        onChange={(e) => setBookMarkOrder(e.target.value)}
        size="small"
        variant="standard"
        sx={{
          " & .MuiSelect-select": {
            padding: "8px 12px",
          },
          width: "35%",
          my: "8px",
        }}
      >
        {["최신순", "추천순"].map((item, idx) => {
          return (
            <MenuItem key={idx} value={item}>
              {item}
            </MenuItem>
          );
        })}
      </Select>
      <div className={styles.bookMarkListContainer}>
        {bookMarkList.map((book, idx) => (
          <div key={idx} className={styles.bookMarkListItem}>
            <img src={book.src} className={styles.img} />
            <div className={styles.bookMarkText}>
              <span className={styles.bookMarkTitle}>{book.title}</span>
              <span className={styles.bookMarkScript}>{book.script}</span>
            </div>
            <div className={styles.bookMarkBtnContainer}>
              <div className={styles.bookMarkBtn}>
                <IconButton>
                  <ThumbDown />
                </IconButton>
                <span>14</span>
              </div>
              <div className={styles.bookMarkBtn}>
                <IconButton
                  sx={{
                    width: "50%",
                  }}
                >
                  <ThumbUp />
                </IconButton>
                <span>6</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Navigation value={2} />
    </div>
  );
}
