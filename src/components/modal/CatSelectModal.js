import { Button, Modal } from "@mui/material";
import { useState } from "react";
import styles from "./CatSelectModal.module.css";
import { useRecoilState } from "recoil";
import { catColorState } from "../recoil/atom";

export default function CatSelectModal({ open, onClose }) {
  const [catList, setCatList] = useState([
    {
      name: "치즈냥이",
      img: "./치즈냥이1.webp",
    },
    {
      name: "밤냥이",
      img: "./밤냥이1.webp",
    },
    {
      name: "삼색냥이",
      img: "./삼색냥이1.webp",
    },
    {
      name: "흰냥이",
      img: "./흰냥이1.webp",
    },
    {
      name: "검은냥이",
      img: "./검은냥이1.webp",
    },
  ]);
  const [tempCat, setTempCat] = useState("");
  const [catColor, setCatColor] = useRecoilState(catColorState);

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
      }}
      disableAutoFocus
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>책냥이 고르기</div>
          <div className={styles.modalSubTitle}>
            책갈피를 추가하여 기를 고양이를 선택해주세요!
          </div>
        </div>
        <div className={styles.catList}>
          {catList.map((cat, index) => (
            <div
              key={index}
              className={
                tempCat === cat.name ? styles.selectedCat : styles.catItem
              }
              onClick={() => {
                setTempCat(cat.name);
              }}
            >
              <img src={cat.img} alt={cat.name} className={styles.catImg} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
        {tempCat && (
          <Button
            onClick={() => {
              setCatColor(tempCat);
              onClose();
            }}
          >
            선택
          </Button>
        )}
      </div>
    </Modal>
  );
}
