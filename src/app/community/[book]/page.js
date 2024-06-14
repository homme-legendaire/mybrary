"use client";
import Navigation from "@/components/Navigation";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import {
  Avatar,
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  ArrowForward,
  Favorite,
  Search,
  ThumbDown,
  ThumbUp,
} from "@mui/icons-material";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  communityListState,
  instagramState,
  selectedBookState,
  userDataState,
} from "@/components/recoil/atom";
import BookMarkModal from "@/components/modal/BookMarkModal";
import { parseCookies } from "nookies";
import Link from "next/link";

export default function Community() {
  const [bookMarkOrder, setBookMarkOrder] = useState("최신순");
  const [bookMarkList, setBookMarkList] = useRecoilState(communityListState);

  const [searchKeyword, setSearchKeyword] = useState("");

  const userData = useRecoilValue(userDataState);

  // 책갈피 데이터
  const [bookMark, setBookMark] = useRecoilState(instagramState);
  const [like, setLike] = useState(bookMark.like);
  const [dislike, setDislike] = useState(bookMark.dislike);

  const [comment, setComment] = useState("");
  const [commentList, setCommentList] = useState([
    {
      id: "민*준",
      comment: "좋은 책 추천 감사합니다!",
    },
    {
      id: "김*찬",
      comment: "책갈피 너무 멋진데요?",
    },
    {
      id: "이*희",
      comment: "처음 보는 책인데, 내용이 너무 좋네요.",
    },
  ]);

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

  const likeBookMarkHandler = async (type) => {
    console.log(bookMark.id);
    if (type === "like") {
      if (bookMark.dislikeUser?.includes(userData.id)) {
        alert("이미 싫어요를 누르셨습니다.");
        return;
      }
      if (bookMark.likeUser?.includes(userData.id)) {
        setLike(like - 1);
        setBookMark((prev) => {
          return {
            ...prev,
            likeUser: prev.likeUser.filter((id) => id !== userData.id),
          };
        });

        return;
      } else {
        setLike(like + 1);
        setBookMark((prev) => {
          return {
            ...prev,
            likeUser: [...prev.likeUser, userData.id],
          };
        });
      }
    } else {
      if (bookMark.likeUser?.includes(userData.id)) {
        alert("이미 좋아요를 누르셨습니다.");
        return;
      }
      if (bookMark.dislikeUser?.includes(userData.id)) {
        setDislike(dislike - 1);
        setBookMark((prev) => {
          return {
            ...prev,
            dislikeUser: prev.dislikeUser.filter((id) => id !== userData.id),
          };
        });

        // bookMark.dislikeUser = bookMark.dislikeUser.filter(
        //   (id) => id !== userData.id
        // );
        return;
      } else {
        setDislike(dislike + 1);
        setBookMark((prev) => {
          return {
            ...prev,
            dislikeUser: [...prev.dislikeUser, userData.id],
          };
        });

        // bookMark.dislikeUser.push(userData.id);
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
    <div className={styles.container}>
      <div className={styles.communityTitle}>
        <div className={styles.userIcon}>
          <Avatar
            sx={{
              backgroundColor: "#5A5A5A",
              width: "45px",
              height: "45px",
            }}
          />
        </div>
        <div className={styles.userName}>
          <span>마**러리</span>
        </div>
      </div>
      <div className={styles.communityImg}>
        <img
          src={bookMark.encoding_image}
          alt="카카오톡"
          width={400}
          height={400}
        />
      </div>
      <div className={styles.communityBody}>
        <div className={styles.bookMarkBtnContainer}>
          <div className={styles.bookMarkBtn}>
            <IconButton
              sx={{
                color: bookMark.likeUser?.includes(userData.id) && "skyblue",
                width: "50%",
              }}
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
                color: bookMark.dislikeUser?.includes(userData.id) && "skyblue",
              }}
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
        <div className={styles.bookMarkInfoContainer}>
          <span className={styles.bookArticle}>
            {'"'}
            {bookMark.memo}
            {'"'}
          </span>
          <span>{bookMark.my_think}</span>
        </div>
        <div className={styles.bookMarkCommentContainer}>
          {commentList.map((comment, idx) => {
            return (
              <div key={idx} className={styles.commentContainer}>
                <span className={styles.commentId}>{comment.id}</span>
                <span>{comment.comment}</span>
              </div>
            );
          })}
        </div>
        <TextField
          fullWidth
          variant="standard"
          placeholder="댓글을 입력하세요"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setComment("");
                    setCommentList((prev) => {
                      return [
                        ...prev,
                        {
                          id: "이*영",
                          comment: comment,
                        },
                      ];
                    });
                  }}
                >
                  <ArrowForward />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            marginTop: "8px",
          }}
        />
      </div>
      <Navigation value={2} />
    </div>
  );
}
