import { Modal } from "@mui/material";
import { useState } from "react";
import styles from "./CatSelectModal.module.css";
import { useRecoilState } from "recoil";
import { catColorState } from "../recoil/atom";

export default function CatSelectModal({ open, onClose }) {
  const [catList, setCatList] = useState([
    {
      name: "치즈냥이",
      img: "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg",
    },
    {
      name: "밤냥이",
      img: "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg",
    },
    {
      name: "삼색냥이",
      img: "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg",
    },
    {
      name: "흰냥이",
      img: "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg",
    },
    {
      name: "검은냥이",
      img: "https://cdn.pixabay.com/photo/2017/02/20/18/03/cat-2083492_960_720.jpg",
    },
  ]);
  const [catColor, setCatColor] = useRecoilState(catColorState);

  return (
    <Modal open={open} onClose={onClose} disableAutoFocus>
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
              className={styles.catItem}
              onClick={() => {
                setCatColor(cat.name);
                onClose();
              }}
            >
              <img src={cat.img} alt={cat.name} className={styles.catImg} />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
