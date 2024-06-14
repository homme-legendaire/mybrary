import { Modal, IconButton, Avatar } from "@mui/material";
import styles from "./BookMarkModal.module.css";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { IosShare, ThumbDown, ThumbUp } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { parseCookies } from "nookies";
import { userDataState } from "../recoil/atom";

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

  const userData = useRecoilValue(userDataState);
  const [like, setLike] = useState(bookMark.like);
  const [dislike, setDislike] = useState(bookMark.dislike);

  const [snsTooltipOpen, setSnsTooltipOpen] = useState(false);

  useEffect(() => {
    setLike(bookMark.like);
    setDislike(bookMark.dislike);
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

  const likeBookMarkHandler = async (type) => {
    console.log(bookMark.id);
    if (type === "like") {
      if (bookMark.dislikeUser?.includes(userData.id)) {
        alert("이미 싫어요를 누르셨습니다.");
        return;
      }
      if (bookMark.likeUser?.includes(userData.id)) {
        setLike(like - 1);
        bookMark.likeUser = bookMark.likeUser.filter(
          (id) => id !== userData.id
        );
        return;
      } else {
        setLike(like + 1);
        bookMark.likeUser.push(userData.id);
      }
    } else {
      if (bookMark.likeUser?.includes(userData.id)) {
        alert("이미 좋아요를 누르셨습니다.");
        return;
      }
      if (bookMark.dislikeUser?.includes(userData.id)) {
        setDislike(dislike - 1);
        bookMark.dislikeUser = bookMark.dislikeUser.filter(
          (id) => id !== userData.id
        );
        return;
      } else {
        setDislike(dislike + 1);
        bookMark.dislikeUser.push(userData.id);
      }
    }
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/likeBookmark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
            bookmark: bookMark.bookmark_id,
          },
          body: JSON.stringify({
            like: type === "like",
            dislike: type === "dislike",
          }),
        }
      );
      const resJson = await res.json();
      if (resJson.result === "success") {
      } else {
        alert("좋아요/싫어요 에러 발생");
      }
    } catch (err) {
      alert(`좋아요/싫어요 에러 발생 ${err}`);
    }
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
              src={bookMark.image_path}
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
                        <img src="카카오톡로고.png" width={36} height={36} />
                        <img src="인스타그램로고.png" width={36} height={36} />
                        <img src="더보기.png" width={36} height={36} />
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
                        color:
                          bookMark.likeUser?.includes(userData.id) && "skyblue",
                        width: "50%",
                      }}
                      disabled={control}
                      onClick={(e) => {
                        e.stopPropagation();
                        likeBookMarkHandler("like");
                      }}
                    >
                      <ThumbUp />
                    </IconButton>
                    <span>{like}</span>
                  </div>
                  <div className={styles.bookMarkBtn}>
                    <IconButton
                      sx={{
                        color:
                          bookMark.dislikeUser?.includes(userData.id) &&
                          "skyblue",
                      }}
                      disabled={control}
                      onClick={(e) => {
                        e.stopPropagation();
                        likeBookMarkHandler("dislike");
                      }}
                    >
                      <ThumbDown />
                    </IconButton>
                    <span>{dislike}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.backSide}>
            <img
              src={bookMark.image_path}
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
