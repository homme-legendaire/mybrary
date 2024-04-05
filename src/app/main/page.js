"use client";
import { Button } from "@mui/material";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";

export default function Main() {
  const clickHandler = async () => {
    const response = await fetch("/test");
    const data = await response.json();
    console.log("DATA", data);
  };

  return (
    <div className={styles.container}>
      <h1>Main Page</h1>
      <Button onClick={clickHandler}>Click me</Button>
      <Navigation value={0} />
    </div>
  );
}
