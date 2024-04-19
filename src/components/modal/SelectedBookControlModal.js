import { Modal, IconButton } from "@mui/material";
import styles from "./SelectedBookControlModal.module.css";
import { AddAPhoto, BookmarkAdd, IosShare } from "@mui/icons-material";
import { useState } from "react";
import BookMarkModal from "./BookMarkModal";
import BookMarkAddModal from "./BookMarkAddModal";
import { useRecoilState } from "recoil";
import { bookMarkListState } from "../recoil/atom";

export default function SelectedBookControlModal({ open, onClose, book }) {
  const [bookMarkList, setBookMarkList] = useRecoilState(bookMarkListState);

  console.log("BOOKMARKLIST", bookMarkList);

  // 책갈피 모달 변수
  const [bookMarkModalOpen, setBookMarkModalOpen] = useState(false);
  const [selectedBookMark, setSelectedBookMark] = useState({});

  // 책갈피 추가 모달 변수
  const [bookMarkAddModalOpen, setBookMarkAddModalOpen] = useState(false);
  const [bookMarkAddModalText, setBookMarkAddModalText] = useState("");

  const bookMarkModalOpenHandler = (key) => {
    setSelectedBookMark(bookMarkList[key]);
    setBookMarkModalOpen(true);
  };

  return (
    <div>
      <BookMarkModal
        open={bookMarkModalOpen}
        onClose={() => setBookMarkModalOpen(false)}
        bookMark={selectedBookMark}
      />
      <BookMarkAddModal
        open={bookMarkAddModalOpen}
        onClose={() => setBookMarkAddModalOpen(false)}
      />
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
              <IconButton
                onClick={() => {
                  setBookMarkAddModalOpen(true);
                }}
              >
                <AddAPhoto />
              </IconButton>
              <IconButton>
                <IosShare />
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
              <div className={styles.bookMarkList}>
                {bookMarkList.map((bookMark, index) => (
                  <div
                    key={index}
                    className={styles.bookMark}
                    onClick={() => bookMarkModalOpenHandler(index)}
                  >
                    <img
                      src={bookMark.img}
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
