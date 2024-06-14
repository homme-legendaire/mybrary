"use client";
import Navigation from "@/components/Navigation";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Select,
} from "@mui/material";
import { Favorite, Search, ThumbDown, ThumbUp } from "@mui/icons-material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  communityListState,
  instagramState,
  selectedBookState,
} from "@/components/recoil/atom";
import BookMarkModal from "@/components/modal/BookMarkModal";
import { parseCookies } from "nookies";
import Link from "next/link";

export default function Community() {
  const [bookMarkOrder, setBookMarkOrder] = useState("최신순");
  const [bookMarkList, setBookMarkList] = useRecoilState(communityListState);
  const [inst, setInst] = useRecoilState(instagramState);

  const [searchKeyword, setSearchKeyword] = useState("");

  // 책갈피 변수
  const [bookMark, setBookMark] = useState({});
  const [bookMarkModalOpen, setBookMarkModalOpen] = useState(false);

  const bookMarkSelectHandler = (book) => {
    setBookMark(book);
    setBookMarkModalOpen(true);
  };

  useEffect(() => {
    fetchBookMarkList();
  }, []);

  const fetchBookMarkList = async () => {
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/shareBook`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
        }
      );
      const resJson = await res.json();
      console.log("커뮤니티 리스트", resJson);
      if (resJson.result === "success") {
        console.log(resJson.book_list);
        setBookMarkList(
          resJson.book_list?.map((bookmark) => {
            return {
              ...bookmark,
              encoding_image: `data:image/png;base64,${bookmark.encoding_image}`,
            };
          })
        );
      } else {
        alert("서버에서 오류가 발생했습니다.");
      }
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
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

      <div className={styles.bookMarkListContainer}>
        {bookMarkList.map((book, idx) => (
          <Link href={"/community/1"}>
            <div
              key={idx}
              className={styles.bookMarkListItem}
              onClick={() => {
                setInst(book);
              }}
            >
              <img src={book.encoding_image} className={styles.img} />
            </div>
          </Link>
        ))}
      </div>
      <Navigation value={2} />
    </div>
  );
}
