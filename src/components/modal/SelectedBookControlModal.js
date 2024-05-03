import { Modal, IconButton, Button } from "@mui/material";
import styles from "./SelectedBookControlModal.module.css";
import { AddAPhoto, BookmarkAdd, Delete, IosShare } from "@mui/icons-material";
import { useState } from "react";
import BookMarkModal from "./BookMarkModal";
import BookMarkAddModal from "./BookMarkAddModal";
import { useRecoilState } from "recoil";
import { bookMarkState, userBookListState } from "../recoil/atom";
import { parseCookies } from "nookies";

export default function SelectedBookControlModal({ open, onClose, book }) {
  const [bookMark, setBookMark] = useRecoilState(bookMarkState);

  console.log("BOOK", book);
  console.log("BOOKMARK", bookMark);

  // 책갈피 모달 변수
  const [bookMarkModalOpen, setBookMarkModalOpen] = useState(false);

  // 책갈피 추가 모달 변수
  const [bookMarkAddModalOpen, setBookMarkAddModalOpen] = useState(false);
  const [bookMarkAddModalText, setBookMarkAddModalText] = useState("");

  // 책 삭제 모달 변수
  const [bookDeleteModalOpen, setBookDeleteModalOpen] = useState(false);
  const [savedBookList, setSavedBookList] = useRecoilState(userBookListState);

  const bookMarkModalOpenHandler = (key) => {
    setBookMarkModalOpen(true);
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
            book: book.docId,
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
          <span className={styles.title}>책을 삭제하시겠습니까?</span>
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
      <Modal open={open} onClose={onClose} disableAutoFocus>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <div className={styles.bookInfo}>
              <img src={book.image} alt={book.title} width={60} height={78} />
              <div className={styles.bookTitle}>
                <span className={styles.title}>
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
              {Object.keys(bookMark).length === 0 && (
                <IconButton
                  onClick={() => {
                    setBookMarkAddModalOpen(true);
                  }}
                >
                  <AddAPhoto />
                </IconButton>
              )}
              <IconButton>
                <IosShare />
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
            <div className={styles.bookDescription}>
              <span className={styles.partTitle}>책갈피</span>
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
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
