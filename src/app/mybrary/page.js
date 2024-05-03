"use client";
import {
  Button,
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import { useLayoutEffect, useState } from "react";
import { Add, Search } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { userBookListState } from "@/components/recoil/atom";
import SelectedBookControlModal from "@/components/modal/SelectedBookControlModal";
import { CircleLoader } from "react-spinners";
import { parseCookies } from "nookies";

export default function Mybrary() {
  const [sortedBy, setSortedBy] = useState("최신순");
  const sortingList = ["최신순", "제목순", "저자순"];
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);

  // 저장된 책 리스트
  const [savedBookList, setSavedBookList] = useRecoilState(userBookListState);

  // 책 추가 모달 파트 변수
  const [title, setTitle] = useState("");
  // const [genre, setGenre] = useState("소설");
  // const genreList = [
  //   "소설",
  //   "시/에세이",
  //   "인문",
  //   "가정/육아",
  //   "요리",
  //   "건강",
  //   "취미/실용/스포츠",
  //   "경제/경영",
  //   "자기계발",
  //   "정치/사회",
  //   "역사/문화",
  //   "종교",
  //   "예술/대중문화",
  //   "기술/공학",
  //   "외국어",
  //   "과학",
  //   "취업/수험서",
  //   "여행",
  //   "컴퓨터/IT",
  //   "잡지",
  //   "청소년",
  //   "유아(0~7세)",
  //   "어린이(초등)",
  //   "만화",
  // ];
  const [bookSearchLoading, setBookSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedBook, setSelectedBook] = useState({});

  // 책 수정, 사진 촬영 모달 파트 변수
  const [selectedBookModalOpen, setSelectedBookModalOpen] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState({});

  useLayoutEffect(() => {
    loadBookList();
  }, []);

  const loadBookList = async () => {
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/myLibrary`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
        }
      );
      const resJson = await res.json();
      if (resJson.result === "success") {
        console.log("나의 아카이빙", resJson);
        setSavedBookList(resJson.book_list);
      } else {
        alert("책 리스트를 불러오는데 실패했습니다.");
      }
    } catch {
      alert("책 리스트를 불러오는데 실패했습니다.");
    }
  };

  const bookTitleSearchHandler = async () => {
    try {
      setBookSearchLoading(true);
      setSelectedBook({});
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/aladin/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Query: title,
          }),
        }
      );
      const resJson = await res.json();
      console.log("찐 결과", resJson);
      const simplifiedResults = resJson.item.map((item) => ({
        title: item.title,
        link: item.link,
        image: item.cover, // Use 'cover' from your API response
        author: item.author,
        discount: item.priceSales, // Use 'priceSales' for discount if applicable
        publisher: item.publisher,
        pubdate: item.pubDate,
        isbn: item.isbn13 || item.isbn,
        description: item.description,
        genre: item.category,
      }));

      console.log("검색 결과", simplifiedResults);
      setSearchResult(simplifiedResults);
      setBookSearchLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  console.log("SELECT", selectedBook);

  const selectedBookSaveHandler = async () => {
    try {
      console.log("SELECTED", selectedBook);
      if (Object.keys(selectedBook).length === 0) {
        alert("책을 선택해주세요.");
        return;
      }
      if (savedBookList?.some((item) => item.isbn === selectedBook.isbn)) {
        alert("이미 저장된 책입니다.");
        return;
      }
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/saveBook`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
          body: JSON.stringify({
            title: selectedBook.title,
            genre: selectedBook.genre,
            link: selectedBook.link,
            image: selectedBook.image,
            author: selectedBook.author,
            discount: selectedBook.discount,
            publisher: selectedBook.publisher,
            pubdate: selectedBook.pubdate,
            isbn: selectedBook.isbn,
            description: selectedBook.description,
          }),
        }
      );
      const resJson = await res.json();
      if (resJson.result === "success") {
        setSavedBookList([...savedBookList, selectedBook]);
        setAddBookModalOpen(false);
      } else {
        alert("책 저장에 실패했습니다.");
      }
    } catch (err) {
      alert(err);
    }
  };

  const bookSelectHandler = (key) => {
    setSelectedBookForEdit(savedBookList[key]);
    setSelectedBookModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <Modal
        open={addBookModalOpen}
        onClose={() => setAddBookModalOpen(false)}
        disableAutoFocus
      >
        <div className={styles.modal}>
          <div className={styles.modalHead}>
            <span>책 추가</span>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.inputRow}>
              <div className={styles.inputLable}>제목</div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onSubmit={bookTitleSearchHandler}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={bookTitleSearchHandler} edge="end">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  width: "70%",
                }}
              />
            </div>
            {/* <div className={styles.inputRow}>
              <div className={styles.inputLable}>장르</div>
              <Select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                sx={{
                  " & .MuiSelect-select": {
                    padding: "8px 12px",
                  },
                  width: "35%",
                }}
              >
                {genreList.map((item, idx) => {
                  return (
                    <MenuItem key={idx} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </div> */}
            {bookSearchLoading ? (
              <div className={styles.searchResultLoading}>
                <CircleLoader color="#7c3f34" loading size={100} />
                <span>잠시만 기다려주세요..</span>
              </div>
            ) : Object.keys(selectedBook).length === 0 ? (
              <div className={styles.searchResultContainer}>
                <div className={styles.searchResult}>
                  {searchResult?.length === 0 ? (
                    <div className={styles.searchResultEmpty}>
                      제목을 입력하고 검색 버튼을 눌러주세요.
                    </div>
                  ) : (
                    <>
                      {searchResult?.map((item, idx) => {
                        return (
                          <div
                            key={idx}
                            className={styles.searchResultItem}
                            onClick={() => {
                              setSelectedBook(item);
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              width={60}
                              height={78}
                            />
                            <div className={styles.searchResultItemContent}>
                              <span className={styles.searchResultItemTitle}>
                                {item.title}
                              </span>
                              <span>{item.author}</span>
                              <span>{item.publisher}</span>
                              <span>{item.pubdate}</span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div
                className={styles.selectedBookContainer}
                onClick={() => setSelectedBook({})}
              >
                <div className={styles.selectedBook}>
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    width={60}
                    height={78}
                  />
                  <div className={styles.selectedBookContent}>
                    <span className={styles.selectedBookTitle}>
                      {selectedBook.title}
                    </span>
                    <span>{selectedBook.author}</span>
                    <span>{selectedBook.publisher}</span>
                    <span>{selectedBook.pubdate}</span>
                  </div>
                </div>
                <div className={styles.selectedBookDescription}>
                  {selectedBook.description}
                </div>
              </div>
            )}
            {Object.keys(selectedBook).length > 0 && (
              <Button
                fullWidth
                sx={{
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  backgroundColor: "primary.main",
                  marginTop: "auto",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
                onClick={selectedBookSaveHandler}
              >
                저장하기
              </Button>
            )}
          </div>
        </div>
      </Modal>
      <SelectedBookControlModal
        open={selectedBookModalOpen}
        onClose={() => setSelectedBookModalOpen(false)}
        book={selectedBookForEdit}
      />
      <div className={styles.main}>
        <Select
          value={sortedBy}
          onChange={(e) => setSortedBy(e.target.value)}
          sx={{
            width: "120px",
            " & .MuiSelect-select": {
              padding: "8px 12px",
            },
          }}
        >
          {sortingList?.map((item, idx) => {
            return (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
        <div className={styles.savedBookList}>
          {savedBookList?.map((item, idx) => (
            <div
              key={idx}
              className={styles.savedBookItem}
              onClick={() => bookSelectHandler(idx)}
            >
              <img
                className={styles.savedBookItemImg}
                src={item.image}
                alt={item.title}
                width={60}
                height={78}
              />
              <div className={styles.savedBookItemContent}>
                <span className={styles.savedBookItemTitle}>
                  {item.title?.length > 8
                    ? item.title.slice(0, 8) + ".."
                    : item.title}
                </span>
                <span>
                  {item.author?.length > 8
                    ? item.author.slice(0, 8) + ".."
                    : item.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="contained"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          bottom: "68px",
          right: "12px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          minWidth: "unset",
          color: "#FFFFFF",
          backgroundColor: "mybraryPink.main",
          "&:hover": {
            backgroundColor: "mybraryPink.dark",
          },
        }}
        onClick={() => setAddBookModalOpen(true)}
      >
        <Add style={{ fontSize: "48px", fontWeight: 700 }} />
      </Button>
      <Navigation value={1} />
    </div>
  );
}
