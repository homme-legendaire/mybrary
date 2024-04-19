import { Modal, IconButton } from "@mui/material";
import styles from "./BookMarkModal.module.css";
import { AddAPhoto, IosShare } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function BookMarkModal({ open, onClose, bookMark }) {
  const [frontSide, setFrontSide] = useState(true);
  const [bookMarkMemoClicked, setBookMarkMemoClicked] = useState(false);
  const [bookMarkMemo, setBookMarkMemo] = useState("");

  useEffect(() => {
    setBookMarkMemo(bookMark.memo);
  }, [bookMark]);

  console.log(bookMark);

  const flipHandler = () => {
    setFrontSide(!frontSide);
    setBookMarkMemoClicked(false);
    setBookMarkMemo(bookMark.memo);
  };

  const bookMarkMemoClickHandler = (e) => {
    e.stopPropagation();
    setBookMarkMemoClicked(!bookMarkMemoClicked);
  };

  const bookMarkEditSaveHandler = (e) => {
    e.stopPropagation();
  };

  console.log("BOOKMARK", bookMark);

  return (
    <Modal open={open} onClose={onClose} disableAutoFocus>
      <div className={styles.modal}>
        <div
          className={
            frontSide ? styles.flipContainer : styles.flipContainerIsFlipped
          }
          onClick={flipHandler}
        >
          <div className={styles.frontSide}>
            <img
              src={bookMark.img}
              alt={bookMark.text}
              width={268}
              height={368}
            />
            <div className={styles.overlayText}>
              <div className={styles.header}>
                <span className={styles} onClick={bookMarkEditSaveHandler}>
                  저장
                </span>
              </div>
              <div className={styles.body}>
                <span className={styles.bookMarkText}>{bookMark.text}</span>
                <span className={styles.bookMarkMemo}>
                  {bookMarkMemoClicked ? (
                    <input
                      type="text"
                      value={bookMarkMemo}
                      className={styles.bookMarkMemoInput}
                      onChange={(e) => {
                        setBookMarkMemo(e.target.value);
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  ) : (
                    <span onClick={(e) => bookMarkMemoClickHandler(e)}>
                      {bookMark.memo ? bookMark.memo : "메모를 입력하세요"}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.backSide}>
            <img
              src={bookMark.img}
              alt={bookMark.text}
              width={268}
              height={368}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
