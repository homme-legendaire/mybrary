import { Modal, IconButton, Button } from "@mui/material";
import styles from "./SelectedBookControlModal.module.css";
import { AddAPhoto, Delete, IosShare } from "@mui/icons-material";
import { useEffect, useState } from "react";
import BookMarkModal from "./BookMarkModal";
import BookMarkAddModal from "./BookMarkAddModal";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  bookMarkListState,
  selectedBookState,
  userBookListState,
} from "../recoil/atom";
import { parseCookies } from "nookies";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const WhiteTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffff",
    color: "rgba(0,0,0,0.87)",
    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.15)",
  },
}));

export default function SelectedBookControlModal({ open, onClose }) {
  const book = useRecoilValue(selectedBookState);

  const [snsTooltipOpen, setSnsTooltipOpen] = useState(false);

  // 책갈피 리스트 변수
  const [isLoading, setIsLoading] = useState(false);
  const [bookMarkList, setBookMarkList] = useRecoilState(bookMarkListState);

  console.log("bookMarkList", bookMarkList);

  // 책갈피 모달 변수
  const [bookMarkModalOpen, setBookMarkModalOpen] = useState(false);

  // 책갈피 추가 모달 변수
  const [bookMarkAddModalOpen, setBookMarkAddModalOpen] = useState(false);
  const [bookMarkAddModalText, setBookMarkAddModalText] = useState("");
  const [bookMark, setBookMark] = useState({});

  // 책 삭제 모달 변수
  const [bookDeleteModalOpen, setBookDeleteModalOpen] = useState(false);
  const [savedBookList, setSavedBookList] = useRecoilState(userBookListState);

  useEffect(() => {
    if (Object.keys(book).length > 0) {
      // 북마크 리스트 불러오기
      fetchBookMarkList();
    }
  }, [book]);

  const bookMarkModalOpenHandler = (bookMark) => {
    setBookMark(bookMark);
    setBookMarkModalOpen(true);
  };

  const fetchBookMarkList = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/loadBookmark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
          body: JSON.stringify({ book_id: book.book_id }),
        }
      );
      const resJson = await res.json();
      if (resJson.result === "success") {
        setBookMarkList(
          resJson.bookmark_list?.map((bookmark) => {
            return {
              ...bookmark,
              encoding_image: `data:image/png;base64,${bookmark.encoding_image}`,
            };
          })
        );
      } else {
        // alert("서버에서 오류가 발생했습니다.");
      }
    } catch (err) {
      // alert(`에러가 발생했습니다. ${err}`);
    }
  };

  const bookDeleteHandler = async () => {
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/deleteBook`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
            book: book.book_id,
          },
        }
      );
      const resJson = await res.json();
      if (resJson.result === "success") {
        setBookMarkAddModalOpen(false);
        setBookMarkModalOpen(false);
        setBookDeleteModalOpen(false);
        setSavedBookList(
          savedBookList.filter((item) => item.title !== book.title)
        );
        onClose();
      } else {
        alert("서버에서 오류가 발생했습니다.");
      }
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  return (
    <div>
      <BookMarkModal
        open={bookMarkModalOpen}
        onClose={() => setBookMarkModalOpen(false)}
        bookMark={bookMark}
        control={true}
      />
      <BookMarkAddModal
        open={bookMarkAddModalOpen}
        onClose={() => setBookMarkAddModalOpen(false)}
      />
      <Modal
        open={bookDeleteModalOpen}
        onClose={() => setBookDeleteModalOpen(false)}
      >
        <div className={styles.smallModal}>
          <div className={styles.title}>
            <div className={styles.titleBold}>책을 삭제하시겠습니까?</div>
            <div>책갈피 및 책 정보가 모두 삭제됩니다.</div>
          </div>
          <div className={styles.modalBtn}>
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
              onClick={bookDeleteHandler}
            >
              삭제
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
              onClick={() => {
                setBookDeleteModalOpen(false);
              }}
            >
              취소
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={open}
        onClose={() => {
          setBookMarkList([]);
          onClose();
        }}
        disableAutoFocus
      >
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <div className={styles.bookInfo}>
              <img src={book.image} alt={book.title} width={60} height={78} />
              <div className={styles.bookTitle}>
                <span className={styles.titleBold}>
                  {book.title?.length > 15
                    ? book.title.slice(0, 15) + ".."
                    : book.title}
                </span>
                <span>
                  {book.author?.length > 15
                    ? book.author.slice(0, 15) + ".."
                    : book.author}
                </span>
              </div>
            </div>
            <div className={styles.bookActionBtn}>
              <IconButton
                onClick={() => {
                  setBookMarkAddModalOpen(true);
                }}
              >
                <AddAPhoto />
              </IconButton>
              <IconButton onClick={() => setBookDeleteModalOpen(true)}>
                <Delete />
              </IconButton>
            </div>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.bookDescription}>
              <span className={styles.partTitle}>책 설명</span>
              <span className={styles.bookDescriptionSpan}>
                {book.description}
              </span>
            </div>
            {/* <div className={styles.bookDescription}>
              <div className={styles.bookPartHeader}>
                <span className={styles.partTitle}>책갈피</span>
                <IconButton onClick={() => setBookMark({})}>
                  <Delete />
                </IconButton>
              </div>
              <div className={styles.bookMark}>
                {Object.keys(bookMark).length === 0 ? (
                  <>책갈피를 제작해 보세요!</>
                ) : (
                  <div
                    className={styles.bookMark}
                    onClick={() => bookMarkModalOpenHandler()}
                  >
                    <img
                      className={styles.bookMarkImg}
                      src={bookMark.img}
                      alt={bookMark.text}
                      width={78}
                      height={78}
                    />
                  </div>
                )}
              </div>
            </div> */}
            <div className={styles.bookDescription}>
              <span className={styles.partTitle}>책갈피</span>
              <div className={styles.bookMarkList}>
                {bookMarkList?.map((bookMark, index) => (
                  <div
                    key={index}
                    className={styles.bookMark}
                    onClick={() => bookMarkModalOpenHandler(bookMark)}
                  >
                    <img
                      src={bookMark.image_path}
                      alt={bookMark.text}
                      width={78}
                      height={78}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
