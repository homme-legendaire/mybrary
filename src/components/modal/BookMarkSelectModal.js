import { Button, Modal, TextField } from "@mui/material";
import styles from "./BookMarkAddModal.module.css";
import { useState } from "react";

export default function BookMarkSelectModal({
  open,
  onClose,
  picList,
  onPicSelect,
}) {
  const [selectedPic, setSelectedPic] = useState(null);
  const [selected, setSelected] = useState(false);

  const picSelectHandler = () => {
    onPicSelect(selectedPic);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} disableAutoFocus>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>
            {selected ? "책갈피 수정" : "책갈피 선택"}
          </span>
          <span className={styles.modalSubTitle}>
            {selected ? "" : "책갈피를 선택해주세요."}
          </span>
        </div>
        <div className={styles.modalBody}>
          {selected ? (
            <div className={styles.bookMarkListItem}>
              <img src={selectedPic} alt="diffusion" className={styles.img} />
            </div>
          ) : (
            <div className={styles.picList}>
              {picList.map((pic, idx) => (
                <div
                  key={idx}
                  className={
                    pic === selectedPic
                      ? styles.selectedBookMarkListItem
                      : styles.bookMarkListItem
                  }
                >
                  <img
                    key={idx}
                    src={pic}
                    alt="diffusion"
                    className={styles.img}
                    onClick={() => {
                      setSelectedPic(pic);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          {selected ? (
            <div className={styles.bookMarkEditDiv}>
              <TextField
                size="small"
                placeholder="수정할 내용을 입력해주세요."
              />
              <div className={styles.bookMarkEditBtn}>
                <Button
                  fullWidth
                  sx={{
                    fontSize: "1.25rem",
                    color: "rgba(0,0,0,0.87)",
                    backgroundColor: "#f5f5f5",
                    "&:hover": {
                      backgroundColor: "#e0e0e0",
                    },
                    "&:disabled": {
                      backgroundColor: "#b6b6b6",
                    },
                  }}
                  disabled={!selectedPic}
                  onClick={() => {
                    // 수정 핸들러
                  }}
                >
                  수정
                </Button>
                <Button
                  fullWidth
                  sx={{
                    fontSize: "1.25rem",
                    color: "#ffffff",
                    backgroundColor: "primary.main",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                    "&:disabled": {
                      backgroundColor: "#b6b6b6",
                    },
                  }}
                  disabled={!selectedPic}
                  // 결정 및 저장 핸들러
                  onClick={picSelectHandler}
                >
                  결정 및 저장
                </Button>
              </div>
            </div>
          ) : (
            <Button
              fullWidth
              sx={{
                fontSize: "1.25rem",
                color: "#ffffff",
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
                "&:disabled": {
                  backgroundColor: "#b6b6b6",
                },
              }}
              disabled={!selectedPic}
              onClick={() => {
                setSelected(true);
              }}
            >
              선택
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
