import { Modal, IconButton, Avatar } from "@mui/material";
import styles from "./BookMarkModal.module.css";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { IosShare, ThumbDown, ThumbUp } from "@mui/icons-material";
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

export default function BookMarkModal({ open, onClose, bookMark, control }) {
  const [frontSide, setFrontSide] = useState(true);
  const [bookMarkMemoClicked, setBookMarkMemoClicked] = useState(false);
  const [bookMarkMemo, setBookMarkMemo] = useState("");

  const [snsTooltipOpen, setSnsTooltipOpen] = useState(false);

  useEffect(() => {
    setBookMarkMemo(bookMark.my_think);
  }, [bookMark]);

  const flipHandler = () => {
    setFrontSide(!frontSide);
    setBookMarkMemoClicked(false);
    setBookMarkMemo(bookMark.my_think);
  };

  const bookMarkMemoClickHandler = (e) => {
    e.stopPropagation();
    setBookMarkMemoClicked(!bookMarkMemoClicked);
  };

  const bookMarkEditSaveHandler = (e) => {
    e.stopPropagation();
  };

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
              src={bookMark.encoding_image}
              alt={bookMark.memo}
              width={268}
              height={368}
            />
            <div className={styles.overlayText}>
              <div className={styles.header}>
                {control && (
                  <WhiteTooltip
                    open={snsTooltipOpen}
                    title={
                      <div className={styles.snsShareDiv}>
                        <span>공유하기</span>
                        <span>공유하기</span>
                        <span>공유하기</span>
                      </div>
                    }
                    sx={{
                      marginTop: "-8px !important",
                    }}
                  >
                    <IconButton
                      sx={{
                        color: "#ffffff",
                        padding: "0px 4px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSnsTooltipOpen(!snsTooltipOpen);
                      }}
                    >
                      <IosShare />
                    </IconButton>
                  </WhiteTooltip>
                )}
                {control && <span onClick={bookMarkEditSaveHandler}>저장</span>}
              </div>
              <div className={styles.body}>
                <span className={styles.bookMarkText}>{bookMark.memo}</span>
                <span className={styles.bookMarkMemo}>
                  {bookMarkMemoClicked && control ? (
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
                      {bookMark.my_think
                        ? bookMark.my_think
                        : "메모를 입력하세요"}
                    </span>
                  )}
                </span>
                <div className={styles.bookMarkBtnContainer}>
                  <div className={styles.bookMarkBtn}>
                    <IconButton
                      sx={{
                        width: "50%",
                      }}
                      disabled={control}
                    >
                      <ThumbUp />
                    </IconButton>
                    <span>{bookMark.like}</span>
                  </div>
                  <div className={styles.bookMarkBtn}>
                    <IconButton disabled={control}>
                      <ThumbDown />
                    </IconButton>
                    <span>{bookMark.dislike}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.backSide}>
            <img
              src={bookMark.encoding_image}
              alt={bookMark.memo}
              width={268}
              height={368}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
