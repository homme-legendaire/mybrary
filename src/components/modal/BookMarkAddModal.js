import { Modal, IconButton, Button, TextField } from "@mui/material";
import styles from "./BookMarkAddModal.module.css";
import { useEffect, useState } from "react";
import {
  bookMarkListState,
  bookMarkState,
  selectedBookState,
  userBookListState,
} from "../recoil/atom";
import { useRecoilState } from "recoil";
import { parseCookies } from "nookies";
import { CircleLoader } from "react-spinners";
import BookMarkSelectModal from "./BookMarkSelectModal";
export default function BookMarkAddModal({ open, onClose }) {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState({});
  const [memo, setMemo] = useState("");
  const [bookMarkLoading, setBookMarkLoading] = useState(false);
  const [bookList, setBookList] = useRecoilState(userBookListState);

  // 책갈피 3개 중 선택하는 파트
  const [bookMarkSelectModalOpen, setBookMarkSelectModalOpen] = useState(false);
  const [bookMarkPicList, setBookMarkPicList] = useState([]);

  const [book, setBook] = useRecoilState(selectedBookState);

  const [bookMarkList, setBookMarkList] = useRecoilState(bookMarkListState);

  const addHandler = async () => {
    try {
      setBookMarkLoading(true);

      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/diffusion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
          body: JSON.stringify({
            book_id: book.book_id,
            prompt: prompt,
          }),
        }
      );

      if (!res.ok) {
        alert("서버에서 오류가 발생했습니다.");
        return;
      }

      const resJson = await res.json();
      console.log(resJson);
      if (resJson.status === "success") {
        setBookMarkPicList(
          resJson.image_list?.map((item) => {
            return {
              image_src: `data:image/jpeg;base64,${item.image_data}`,
              image_path: item.image_name,
            };
          })
        );
        setBookMarkLoading(false);
        setBookMarkSelectModalOpen(true);
      }

      // const imageBlob = await res.blob();
      // const imageObjectUrl = URL.createObjectURL(imageBlob);
      // setImageUrl(imageObjectUrl);
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  const bookMarkSaveHandler = async () => {
    try {
      // console.log("BOOK", book);
      // let changeBook = bookList.find((val) => val.book_id === book.book_id);
      // changeBook = {
      //   ...changeBook,

      //   image_path: imageUrl,
      //   memo: prompt,
      //   my_think: memo,
      // };
      // setBookList([
      //   ...bookList.filter((val) => val.book_id !== book.book_id),
      //   changeBook,
      // ]);
      // setBook(changeBook);
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/saveBookmark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            book_id: book.book_id,
            memo: prompt,
            my_think: memo,
            image_path: imageUrl.image_path,
          }),
        }
      );
      const resJson = await res.json();
      console.log("추가 완료", resJson);
      setBookMarkList([
        ...bookMarkList,
        {
          book_id: book.book_id,
          memo: prompt,
          my_think: memo,
          image_path: imageUrl.image_path,
        },
      ]);

      onClose();
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  return (
    <>
      <BookMarkSelectModal
        open={bookMarkSelectModalOpen}
        onClose={() => {
          setBookMarkSelectModalOpen(false);
        }}
        picList={bookMarkPicList}
        onPicSelect={(pic) => {
          console.log("PIC", pic);
          setImageUrl(pic);
        }}
      />
      <Modal open={open} onClose={onClose} disableAutoFocus>
        <div className={styles.modal}>
          <span className={styles.title}>
            글귀를 추가하여 책갈피를 생성해보세요.
          </span>
          <TextField
            size="small"
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
          />
          <Button onClick={addHandler}>책갈피 생성하기</Button>
          {bookMarkLoading && (
            <div className={styles.loadingCircleContainer}>
              <CircleLoader color="#7c3f34" loading size={150} />
              <span>잠시만 기다려주세요...</span>
            </div>
          )}
          {Object.keys(imageUrl).length > 0 && (
            <img
              className={styles.image}
              src={imageUrl.image_src}
              width={200}
              height={200}
              alt="diffusionResult"
            />
          )}
          <TextField
            multiline
            rows={2}
            value={memo}
            onChange={(e) => {
              setMemo(e.target.value);
            }}
            placeholder="글귀를 보고 느낀점 혹은 본인의 생각을 남겨보세요."
          />
          <Button
            sx={{
              fontSize: "1rem",
              color: "#ffffff",
              backgroundColor: "primary.main",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            }}
            onClick={bookMarkSaveHandler}
          >
            책갈피 저장하기
          </Button>
        </div>
      </Modal>
    </>
  );
}
