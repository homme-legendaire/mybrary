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
import { useState } from "react";
import { Add, Search } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { savedBookListState } from "@/components/recoil/atom";
import SelectedBookControlModal from "@/components/modal/SelectedBookControlModal";

export default function Mybrary() {
  const [sortedBy, setSortedBy] = useState("최신순");
  const sortingList = ["최신순", "제목순", "저자순"];
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);

  // 저장된 책 리스트
  const [savedBookList, setSavedBookList] = useRecoilState(savedBookListState);

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
  const [searchResult, setSearchResult] = useState([]);
  const [selectedBook, setSelectedBook] = useState({});

  // 책 수정, 사진 촬영 모달 파트 변수
  const [selectedBookModalOpen, setSelectedBookModalOpen] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState({});

  const bookTitleSearchHandler = async () => {
    setSelectedBook({});
    if (searchResult.length > 0) {
      setSearchResult([]);
    } else {
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
      }));
      console.log("검색 결과", simplifiedResults);
      setSearchResult(simplifiedResults);
    }
  };

  console.log("SAVED", savedBookList);

  const selectedBookSaveHandler = async () => {
    if (Object.keys(selectedBook).length === 0) {
      return;
    }
    if (!savedBookList?.some((item) => item.isbn === selectedBook.isbn)) {
      setSavedBookList([...savedBookList, selectedBook]);
    }
    setAddBookModalOpen(false);
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
            {Object.keys(selectedBook).length === 0 ? (
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
              <div className={styles.selectedBookContainer}>
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
                저장
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
