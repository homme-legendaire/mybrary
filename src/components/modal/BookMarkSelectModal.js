import { Button, Modal, TextField } from "@mui/material";
import styles from "./BookMarkAddModal.module.css";
import { useState } from "react";
import { parseCookies } from "nookies";
import { CircleLoader } from "react-spinners";

export default function BookMarkSelectModal({
  open,
  onClose,
  picList,
  onPicSelect,
}) {
  const [selectedPic, setSelectedPic] = useState(null);
  const [editedPic, setEditedPic] = useState(null);
  const [selected, setSelected] = useState(false);
  const [sourcePrompt, setSourcePrompt] = useState("");
  const [targetPrompt, setTargetPrompt] = useState("");
  const [edited, setEdited] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const picSelectHandler = () => {
    // onPicSelect(selectedPic);
    onClose();
  };

  const editBookMarkHandler = async () => {
    try {
      setEditLoading(true);
      const res = await fetch(
        `${process.env.PRODUCTION_SERVER_HOST}/editBookmark`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: parseCookies(null, "token").token,
          },
          body: JSON.stringify({
            source_prompt: sourcePrompt,
            target_prompt: targetPrompt,
            image_path: selectedPic.image_path,
          }),
        }
      );
      const resJson = await res.json();
      if (resJson.result === "success") {
        setEdited(true);
        setEditedPic(`data:image/jpeg;base64,${resJson.bookmark}`);
        onPicSelect({
          image_src: `data:image/jpeg;base64,${resJson.bookmark}`,
          image_path: "tmp3.png",
        });
        setEditLoading(false);
      } else {
        alert("책갈피 수정에 실패했습니다.");
      }
    } catch (err) {
      alert(`책갈피 수정 중 에러 발생. ${err}`);
    }
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
            edited ? (
              <img src={editedPic} alt="diffusion" className={styles.img} />
            ) : (
              <img
                src={selectedPic.image_src}
                alt="diffusion"
                className={styles.img}
              />
            )
          ) : (
            <div className={styles.picList}>
              {picList.map((pic, idx) => (
                <div
                  key={idx}
                  className={
                    pic.image_src === selectedPic?.image_src
                      ? styles.selectedBookMarkListItem
                      : styles.bookMarkListItem
                  }
                >
                  <img
                    key={idx}
                    src={pic.image_src}
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
              {edited ? (
                <div className={styles.bookMarkEditResult}>
                  <span>
                    <strong>바위 위에 서 있는 어린왕자</strong>을(를){" "}
                    <strong>장미와 함께 있는 어린왕자</strong>로 바꿔드렸어요!
                  </span>
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
              ) : (
                <>
                  {editLoading ? (
                    <div className={styles.loaderDiv}>
                      <CircleLoader color="#7c3f34" loading size={150} />
                    </div>
                  ) : (
                    <div className={styles.editInputDiv}>
                      <div className={styles.smallEditInputDiv}>
                        <TextField
                          size="small"
                          placeholder="예) 장미"
                          value={sourcePrompt}
                          onChange={(e) => {
                            setSourcePrompt(e.target.value);
                          }}
                        />
                        <span>을(를)</span>
                      </div>
                      <div className={styles.smallEditInputDiv}>
                        <TextField
                          size="small"
                          placeholder="예) 분홍색 장미"
                          value={targetPrompt}
                          onChange={(e) => {
                            setTargetPrompt(e.target.value);
                          }}
                        />
                        <span>으로 바꿔드릴게요.</span>
                      </div>
                    </div>
                  )}

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
                      onClick={editBookMarkHandler}
                    >
                      {editLoading ? "수정 중..." : "수정"}
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
                </>
              )}
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
