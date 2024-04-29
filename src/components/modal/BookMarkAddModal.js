import { Modal, IconButton, Button, TextField } from "@mui/material";
import styles from "./BookMarkAddModal.module.css";
import { useEffect, useState } from "react";
import { bookMarkState } from "../recoil/atom";
import { useRecoilState } from "recoil";

export default function BookMarkAddModal({ open, onClose }) {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("/rose.png");
  const [memo, setMemo] = useState("");

  const [bookMarkList, setBookMarkList] = useRecoilState(bookMarkState);

  const addHandler = async () => {
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/diffusion`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt,
          }),
        }
      );

      if (!res.ok) {
        alert("서버에서 오류가 발생했습니다.");
        return;
      }

      const imageBlob = await res.blob();
      const imageObjectUrl = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectUrl);
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  const saveHandler = async () => {
    try {
      setBookMarkList({
        text: prompt,
        img: imageUrl,
        memo: "시간을 들여야 하는 것이 중요하다는 것을 알게 되었다",
      });
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  return (
    <Modal open={open} onClose={onClose} disableAutoFocus>
      <div className={styles.modal}>
        <span className={styles.title}>
          글귀를 추가하여 책갈피를 생성해보세요.
        </span>
        <input
          type="text"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
          }}
        />
        <Button onClick={addHandler}>책갈피 생성하기</Button>
        {/* {imageUrl && <img src={imageUrl} alt="diffusionResult" />} */}
        <img
          className={styles.image}
          src={imageUrl}
          alt="diffusionResult"
          width={200}
          height={200}
        />
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
          onClick={saveHandler}
        >
          책갈피 저장하기
        </Button>
      </div>
    </Modal>
  );
}
