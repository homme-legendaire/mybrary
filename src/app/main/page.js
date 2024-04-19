"use client";
import { Button } from "@mui/material";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import { useState } from "react";

export default function Main() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("/rose.png");

  const clickHandler = async () => {
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

  console.log("P", prompt);

  return (
    <div className={styles.container}>
      <h3
        style={{
          textAlign: "center",
        }}
      >
        감명깊은 글귀를 추가하여 책갈피를 생성해보세요.
      </h3>
      <input
        type="text"
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      />
      <Button onClick={clickHandler}>책갈피 생성하기</Button>
      {/* {imageUrl && <img src={imageUrl} alt="diffusionResult" />} */}
      <img src={imageUrl} alt="diffusionResult" />
      <Navigation value={0} />
    </div>
  );
}
