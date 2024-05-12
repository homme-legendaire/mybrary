"use client";
import Navigation from "@/components/Navigation";
import styles from "./page.module.css";
import { useState } from "react";
import {
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Select,
} from "@mui/material";
import { Favorite, Search, ThumbDown, ThumbUp } from "@mui/icons-material";
import { useRecoilValue } from "recoil";
import { selectedBookState } from "@/components/recoil/atom";
import BookMarkModal from "@/components/modal/BookMarkModal";

export default function Community() {
  const [bookMarkOrder, setBookMarkOrder] = useState("최신순");
  const [bookMarkList, setBookMarkList] = useState([
    {
      title: "어린왕자",
      memo: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      my_think: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      image_path: "https://t1.daumcdn.net/cfile/tistory/998D344B5BF5070114",
    },
    {
      title: "나니아연대기",
      memo: "날 피해서 숨은 거예요?",
      my_think: "날 피해서 숨은 거예요?",
      image_path: "https://cdn.hankyung.com/photo/201810/01.17952867.1.jpg",
    },
    {
      title: "인간실격",
      memo: "그것은 세상이 용서하지 않아",
      my_think: "그것은 세상이 용서하지 않아",
      image_path:
        "https://i.pinimg.com/564x/a9/ce/79/a9ce79d3065ef432ba1b4412517b0548.jpg",
    },
    {
      title: "어린왕자",
      memo: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      my_think: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      image_path: "https://t1.daumcdn.net/cfile/tistory/998D344B5BF5070114",
    },
    {
      title: "나니아연대기",
      memo: "날 피해서 숨은 거예요?",
      my_think: "날 피해서 숨은 거예요?",
      image_path: "https://cdn.hankyung.com/photo/201810/01.17952867.1.jpg",
    },
    {
      title: "인간실격",
      memo: "그것은 세상이 용서하지 않아",
      my_think: "그것은 세상이 용서하지 않아",
      image_path:
        "https://i.pinimg.com/564x/a9/ce/79/a9ce79d3065ef432ba1b4412517b0548.jpg",
    },
    {
      title: "어린왕자",
      memo: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      my_think: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      image_path: "https://t1.daumcdn.net/cfile/tistory/998D344B5BF5070114",
    },
    {
      title: "나니아연대기",
      memo: "날 피해서 숨은 거예요?",
      my_think: "날 피해서 숨은 거예요?",
      image_path: "https://cdn.hankyung.com/photo/201810/01.17952867.1.jpg",
    },
    {
      title: "인간실격",
      memo: "그것은 세상이 용서하지 않아",
      my_think: "그것은 세상이 용서하지 않아",
      image_path:
        "https://i.pinimg.com/564x/a9/ce/79/a9ce79d3065ef432ba1b4412517b0548.jpg",
    },
    {
      title: "어린왕자",
      memo: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      my_think: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      image_path: "https://t1.daumcdn.net/cfile/tistory/998D344B5BF5070114",
    },
    {
      title: "나니아연대기",
      memo: "날 피해서 숨은 거예요?",
      my_think: "날 피해서 숨은 거예요?",
      image_path: "https://cdn.hankyung.com/photo/201810/01.17952867.1.jpg",
    },
    {
      title: "인간실격",
      memo: "그것은 세상이 용서하지 않아",
      my_think: "그것은 세상이 용서하지 않아",
      image_path:
        "https://i.pinimg.com/564x/a9/ce/79/a9ce79d3065ef432ba1b4412517b0548.jpg",
    },
    {
      title: "어린왕자",
      memo: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      my_think: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      image_path: "https://t1.daumcdn.net/cfile/tistory/998D344B5BF5070114",
    },
    {
      title: "나니아연대기",
      memo: "날 피해서 숨은 거예요?",
      my_think: "날 피해서 숨은 거예요?",
      image_path: "https://cdn.hankyung.com/photo/201810/01.17952867.1.jpg",
    },
    {
      title: "인간실격",
      memo: "그것은 세상이 용서하지 않아",
      my_think: "그것은 세상이 용서하지 않아",
      image_path:
        "https://i.pinimg.com/564x/a9/ce/79/a9ce79d3065ef432ba1b4412517b0548.jpg",
    },
    {
      title: "어린왕자",
      memo: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      my_think: "사막이 아름다운 건 어디엔가 샘을 감추고 있기 때문이야",
      image_path: "https://t1.daumcdn.net/cfile/tistory/998D344B5BF5070114",
    },
    {
      title: "나니아연대기",
      memo: "날 피해서 숨은 거예요?",
      my_think: "날 피해서 숨은 거예요?",
      image_path: "https://cdn.hankyung.com/photo/201810/01.17952867.1.jpg",
    },
    {
      title: "인간실격",
      memo: "그것은 세상이 용서하지 않아",
      my_think: "그것은 세상이 용서하지 않아",
      image_path:
        "https://i.pinimg.com/564x/a9/ce/79/a9ce79d3065ef432ba1b4412517b0548.jpg",
    },
  ]);

  const [searchKeyword, setSearchKeyword] = useState("");

  // 책갈피 변수
  const [bookMark, setBookMark] = useState({});
  const [bookMarkModalOpen, setBookMarkModalOpen] = useState(false);

  const bookMarkSelectHandler = (book) => {
    setBookMark({
      // img: "/" + book?.image_path,
      img: book?.image_path,
      text: book?.memo,
      memo: book?.my_think,
    });
    setBookMarkModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <BookMarkModal
        open={bookMarkModalOpen}
        onClose={() => setBookMarkModalOpen(false)}
        bookMark={bookMark}
        control={false}
      />
      <div className={styles.bookListHeader}>
        <Input
          fullWidth
          placeholder="찾고싶은 책 제목을 검색해보세요!"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          // onSubmit={bookTitleSearchHandler}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                // onClick={bookTitleSearchHandler}
                edge="end"
              >
                <Search />
              </IconButton>
            </InputAdornment>
          }
        />
      </div>
      {/* <div className={styles.bookListHeader}>
        <div className={styles.bookListTitle}>월간 BEST</div>
        <div className={styles.bookListSubTitle}>
          지난 한 달 가장 많은 추천을 받은 책갈피에요!
        </div>
      </div>
      <div className={styles.bookMark}>
        <img src={bestBookMark.image_path} className={styles.img} />
        <div className={styles.bookMarkText}>
          <span className={styles.bookMarkTitle}>{bestBookMark.title}</span>
          <span className={styles.bookMarkScript}>{bestBookMark.memo}</span>
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
            <img src={book.image_path} className={styles.img} />
            <div className={styles.bookMarkText}>
              <span className={styles.bookMarkTitle}>{book.title}</span>
              <span className={styles.bookMarkScript}>{book.memo}</span>
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
      </div> */}

      <div className={styles.bookMarkListContainer}>
        {bookMarkList.map((book, idx) => (
          <div
            key={idx}
            className={styles.bookMarkListItem}
            onClick={() => bookMarkSelectHandler(book)}
          >
            <img src={book.image_path} className={styles.img} />
            {/* <div className={styles.bookMarkText}>
              <span className={styles.bookMarkTitle}>{book.title}</span>
              <span className={styles.bookMarkScript}>{book.memo}</span>
            </div> */}
            {/* <div className={styles.bookMarkBtnContainer}>
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
            </div> */}
          </div>
        ))}
      </div>
      <Navigation value={2} />
    </div>
  );
}
