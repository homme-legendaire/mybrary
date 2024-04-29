"use client";
import {
  Button,
  IconButton,
  Input,
  InputAdornment,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import styles from "./page.module.css";
import Navigation from "@/components/Navigation";
import { useState } from "react";
import { Add, Search } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { savedBookListState } from "@/components/recoil/atom";
import SelectedBookControlModal from "@/components/modal/SelectedBookControlModal";

export default function Mybrary() {
  const [sortedBy, setSortedBy] = useState("최신순");
  const sortingList = ["최신순", "제목순", "저자순"];
  const [addBookModalOpen, setAddBookModalOpen] = useState(false);

  // 저장된 책 리스트
  const [savedBookList, setSavedBookList] = useRecoilState(savedBookListState);

  // 책 추가 모달 파트 변수
  const [title, setTitle] = useState("");
  // const [genre, setGenre] = useState("소설");
  // const genreList = [
  //   "소설",
  //   "시/에세이",
  //   "인문",
  //   "가정/육아",
  //   "요리",
  //   "건강",
  //   "취미/실용/스포츠",
  //   "경제/경영",
  //   "자기계발",
  //   "정치/사회",
  //   "역사/문화",
  //   "종교",
  //   "예술/대중문화",
  //   "기술/공학",
  //   "외국어",
  //   "과학",
  //   "취업/수험서",
  //   "여행",
  //   "컴퓨터/IT",
  //   "잡지",
  //   "청소년",
  //   "유아(0~7세)",
  //   "어린이(초등)",
  //   "만화",
  // ];
  const [searchResult, setSearchResult] = useState([]);
  const [selectedBook, setSelectedBook] = useState({});

  // 책 수정, 사진 촬영 모달 파트 변수
  const [selectedBookModalOpen, setSelectedBookModalOpen] = useState(false);
  const [selectedBookForEdit, setSelectedBookForEdit] = useState({});

  const bookTitleSearchHandler = () => {
    setSelectedBook({});
    if (searchResult.length > 0) {
      setSearchResult([]);
    } else {
      setSearchResult([
        {
          title: "어린 왕자",
          link: "https://search.shopping.naver.com/book/catalog/32441644071",
          image:
            "https://shopping-phinf.pstatic.net/main_3244164/32441644071.20221019140242.jpg",
          author: "앙투안 드 생택쥐페리",
          discount: "10620",
          publisher: "열린책들",
          pubdate: "20151020",
          isbn: "9788932917245",
          description:
            "문학 평론가 황현산 선생의 번역으로 만나는 어린 왕자!\n\n다른 별에서 온 어린 왕자의 순수한 시선으로 모순된 어른들의 세계를 비추는 전 세계가 사랑하는 아름다운 이야기 『어린 왕자』. 그동안 프랑스어 원문에 대한 섬세한 이해, 정확하고도 아름다운 문장력, 예리한 문학적 통찰을 고루 갖춘 번역으로 문학 번역에서 큰 입지를 굳혀 온 황현산. 그는 이 작품을 새롭게 번역하면서 생텍쥐페리의 진솔한 문체를 고스란히 살려 내기 위해 심혈을 기울였고, 원전의 가치를 충실히 살린 한국어 결정판을 마련하고자 했다.\n\n이 작품은 어떤 소설보다도 독자들에게 오래 기억되며 마음을 움직이는 힘을 가진 문장들로 가득하다. 역자 황현산은 그 힘의 근원을 저자 생텍쥐페리의 진솔하고 열정적인 문체라고 풀이했다. 꾸밈없는 진솔한 문체와 동화처럼 단순해 보이는 이야기 속에 삶을 돌아보는 깊은 성찰을 아름다운 은유로 녹여 내 깊은 여운을 주는 이 작품을 보다 새롭고 완성도 높은 번역으로 다시 한 번 음미하며 읽어 볼 수 있다.",
        },
        {
          title: "어린 왕자 (저학년 필독서 완역본)",
          link: "https://search.shopping.naver.com/book/catalog/46404713619",
          image:
            "https://shopping-phinf.pstatic.net/main_4640471/46404713619.20240316071048.jpg",
          author: "생텍쥐페리",
          discount: "10800",
          publisher: "효리원",
          pubdate: "20240325",
          isbn: "9788928107896",
          description:
            "지구별을 여행하는 어린 왕자의 해맑고도 따뜻한 시선에서 전해지는 감동!\n\n어린 왕자가 들려주는 사람과 만남, 관계 이야기는 초등 저학년 어린이들이 이해하기에는 어려울 수 있습니다. 하지만 해맑은 어린 왕자의 따뜻한 마음만은 아이들도 느낄 수 있습니다. 오히려 코끼리를 삼킨 보아뱀이나, 오후 네 시를 기다리는 여우의 설렘, 장미꽃을 향한 어린 왕자의 사랑을 아이들은 어른들보다 빨리 눈치챌 것입니다. 어린 왕자의 마음과 여우의 말을 찬찬히 되새기면서 읽는다면, 아이들도 가슴속에서 잔잔한 감동이 일 것입니다. 눈에 보이지 않지만 마음으로 보면 보이는 것이 무엇인지, 친구를 사귀는 기쁨이 얼마나 소중한지 어린 왕자처럼 끊임없이 묻고 생각해 보세요. 어린 시절의 책읽기가 평생 아이들 마음에 값진 선물로 남을 것입니다.",
        },
        {
          title: "어린 왕자",
          link: "https://search.shopping.naver.com/book/catalog/44145089630",
          image:
            "https://shopping-phinf.pstatic.net/main_4414508/44145089630.20231122090941.jpg",
          author: "생텍쥐페리",
          discount: "11700",
          publisher: "시공주니어",
          pubdate: "20231125",
          isbn: "9791169253727",
          description:
            "출간 80주년을 맞은 전 세계 스테디셀러!\n지구로 온 가장 순수한 영혼, 『어린 왕자』\nALMA상 ㆍ 안데르센상 노미네이트, 볼로냐 라가치상 수상 작가\n‘베아트리체 알레마냐’의 그림으로 탄생한 가장 사랑받는 고전\n\n비행기 고장 사고로 사막에 불시착한 조종사는 우연히 한 소년을 만난다. 소년은 처음 만난 조종사에게 양 한 마리를 그려 달라고 부탁한다. 소년은 자신이 사는 작은 별에 사랑하는 장미를 남겨 두고 세상을 보기 위해 여행 온 어린 왕자였다. 어린 왕자는 몇 군데의 별을 돌아다닌 후 지구로 와 뱀, 여우와 친구가 된다. 어린 왕자는 함께 시간을 보낸 여우와의 관계를 통해 존재를 길들여 관계 맺는 것과 눈에 보이지 않는 중요함의 의미를 알게 된다. 자신만의 특별한 존재인 장미에 대한 책임감을 깨달은 어린 왕자는 지구를 떠나 자신의 별로 돌아간다.",
        },
        {
          title: "어린왕자",
          link: "https://search.shopping.naver.com/book/catalog/45721475627",
          image:
            "https://shopping-phinf.pstatic.net/main_4572147/45721475627.20240209070909.jpg",
          author: "생텍쥐페리",
          discount: "9000",
          publisher: "도서출판 위",
          pubdate: "20240215",
          isbn: "9791186861332",
          description: "",
        },
      ]);
    }
  };

  console.log("SAVED", savedBookList);

  const selectedBookSaveHandler = async () => {
    if (Object.keys(selectedBook).length === 0) {
      return;
    }
    if (!savedBookList?.some((item) => item.isbn === selectedBook.isbn)) {
      setSavedBookList([...savedBookList, selectedBook]);
    }
    setAddBookModalOpen(false);
  };

  const bookSelectHandler = (key) => {
    setSelectedBookForEdit(savedBookList[key]);
    setSelectedBookModalOpen(true);
  };

  return (
    <div className={styles.container}>
      <Modal
        open={addBookModalOpen}
        onClose={() => setAddBookModalOpen(false)}
        disableAutoFocus
      >
        <div className={styles.modal}>
          <div className={styles.modalHead}>
            <span>책 추가</span>
          </div>
          <div className={styles.modalBody}>
            <div className={styles.inputRow}>
              <div className={styles.inputLable}>제목</div>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={bookTitleSearchHandler} edge="end">
                      <Search />
                    </IconButton>
                  </InputAdornment>
                }
                sx={{
                  width: "70%",
                }}
              />
            </div>
            {/* <div className={styles.inputRow}>
              <div className={styles.inputLable}>장르</div>
              <Select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                sx={{
                  " & .MuiSelect-select": {
                    padding: "8px 12px",
                  },
                  width: "35%",
                }}
              >
                {genreList.map((item, idx) => {
                  return (
                    <MenuItem key={idx} value={item}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </div> */}
            {Object.keys(selectedBook).length === 0 ? (
              <div className={styles.searchResultContainer}>
                <div className={styles.searchResult}>
                  {searchResult?.length === 0 ? (
                    <div className={styles.searchResultEmpty}>
                      제목을 입력하고 검색 버튼을 눌러주세요.
                    </div>
                  ) : (
                    <>
                      {searchResult?.map((item, idx) => {
                        return (
                          <div
                            key={idx}
                            className={styles.searchResultItem}
                            onClick={() => {
                              setSelectedBook(item);
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              width={60}
                              height={78}
                            />
                            <div className={styles.searchResultItemContent}>
                              <span className={styles.searchResultItemTitle}>
                                {item.title}
                              </span>
                              <span>{item.author}</span>
                              <span>{item.publisher}</span>
                              <span>{item.pubdate}</span>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className={styles.selectedBookContainer}>
                <div className={styles.selectedBook}>
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    width={60}
                    height={78}
                  />
                  <div className={styles.selectedBookContent}>
                    <span className={styles.selectedBookTitle}>
                      {selectedBook.title}
                    </span>
                    <span>{selectedBook.author}</span>
                    <span>{selectedBook.publisher}</span>
                    <span>{selectedBook.pubdate}</span>
                  </div>
                </div>
                <div className={styles.selectedBookDescription}>
                  {selectedBook.description}
                </div>
              </div>
            )}
            {Object.keys(selectedBook).length > 0 && (
              <Button
                fullWidth
                sx={{
                  fontSize: "1.1rem",
                  color: "#ffffff",
                  backgroundColor: "primary.main",
                  marginTop: "auto",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                }}
                onClick={selectedBookSaveHandler}
              >
                저장
              </Button>
            )}
          </div>
        </div>
      </Modal>
      <SelectedBookControlModal
        open={selectedBookModalOpen}
        onClose={() => setSelectedBookModalOpen(false)}
        book={selectedBookForEdit}
      />
      <div className={styles.main}>
        <Select
          value={sortedBy}
          onChange={(e) => setSortedBy(e.target.value)}
          sx={{
            width: "120px",
            " & .MuiSelect-select": {
              padding: "8px 12px",
            },
          }}
        >
          {sortingList?.map((item, idx) => {
            return (
              <MenuItem key={idx} value={item}>
                {item}
              </MenuItem>
            );
          })}
        </Select>
        <div className={styles.savedBookList}>
          {savedBookList?.map((item, idx) => (
            <div
              key={idx}
              className={styles.savedBookItem}
              onClick={() => bookSelectHandler(idx)}
            >
              <img
                className={styles.savedBookItemImg}
                src={item.image}
                alt={item.title}
                width={60}
                height={78}
              />
              <div className={styles.savedBookItemContent}>
                <span className={styles.savedBookItemTitle}>
                  {item.title?.length > 8
                    ? item.title.slice(0, 8) + ".."
                    : item.title}
                </span>
                <span>
                  {item.author?.length > 8
                    ? item.author.slice(0, 8) + ".."
                    : item.author}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="contained"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          bottom: "68px",
          right: "12px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          minWidth: "unset",
          color: "#FFFFFF",
          backgroundColor: "mybraryPink.main",
          "&:hover": {
            backgroundColor: "mybraryPink.dark",
          },
        }}
        onClick={() => setAddBookModalOpen(true)}
      >
        <Add style={{ fontSize: "48px", fontWeight: 700 }} />
      </Button>
      <Navigation value={1} />
    </div>
  );
}
