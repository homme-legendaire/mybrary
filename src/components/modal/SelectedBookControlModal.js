import { Modal, IconButton } from "@mui/material";
import styles from "./SelectedBookControlModal.module.css";
import { AddAPhoto, IosShare } from "@mui/icons-material";
import { useState } from "react";
import BookMarkModal from "./BookMarkModal";

export default function SelectedBookControlModal({ open, onClose, book }) {
  const [bookMarkList, setBookMarkList] = useState([
    {
      text: "너의 장미를 그토록 중요하게 만든 건 너의 장미를 위해 네가 소비한 그 시간이란다",
      img: "/rose.png",
      memo: "시간을 들여야 하는 것이 중요하다는 것을 알게 되었다",
    },
  ]);

  console.log("BOOKMARKLIST", bookMarkList);

  // 책갈피 모달 변수
  const [bookMarkModalOpen, setBookMarkModalOpen] = useState(false);
  const [selectedBookMark, setSelectedBookMark] = useState({});

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
              <IconButton>
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
