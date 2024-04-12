"use client";
import { Button } from "@mui/material";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import { useState } from "react";

export default function Main() {
  const [prompt, setPrompt] = useState("");

  const clickHandler = async () => {
    try {
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/prompt/test`,
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
      const resJson = await res.json();
      if (resJson.result === "success") {
        alert("등록 완료.");
      }
    } catch (err) {
      alert(`에러가 발생했습니다. ${err}`);
    }
  };

  console.log("P", prompt);

  return (
    <div className={styles.container}>
      <h1>Main Page</h1>
      <input
        type="text"
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      />
      <Button onClick={clickHandler}>Click me</Button>
      <Navigation value={0} />
    </div>
  );
}
