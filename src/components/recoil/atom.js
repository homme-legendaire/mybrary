import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

const { persistAtom } = recoilPersist();

export const savedBookListState = atom({
  key: "savedBookListState",
  default: [
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
  ],
  // effects_UNSTABLE: [persistAtom],
});

export const bookMarkListState = atom({
  key: "bookMarkListState",
  default: [
    {
      text: "너의 장미를 그토록 중요하게 만든 건 너의 장미를 위해 네가 소비한 그 시간이란다",
      img: "/rose.png",
      memo: "시간을 들여야 하는 것이 중요하다는 것을 알게 되었다",
    },
  ],
});

export const userDataState = atom({
  key: "userDataState",
  default: {
    name: "마이브러리",
    level: 1,
    exp: 0,
    date: "2024.04.12",
    bookTotal: 12,
    bookList: [
      {
        title: "어린 왕자",
        genre: "소설",
      },
      {
        title: "마흔에 읽는 쇼펜하우어",
        genre: "철학",
      },
      {
        title: "마흔에 읽는 쇼펜하우어",
        genre: "철학",
      },
      {
        title: "마흔에 읽는 쇼펜하우어",
        genre: "철학",
      },
      {
        title: "불변의 법칙",
        genre: "경제경영",
      },
      {
        title: "마흔에 읽는 쇼펜하우어",
        genre: "철학",
      },
      {
        title: "마흔에 읽는 쇼펜하우어",
        genre: "철학",
      },
      {
        title: "마흔에 읽는 쇼펜하우어",
        genre: "철학",
      },
      {
        title: "어린 왕자",
        genre: "소설",
      },
      {
        title: "어린 왕자",
        genre: "소설",
      },
      {
        title: "어린 왕자",
        genre: "소설",
      },
      {
        title: "불변의 법칙",
        genre: "경제경영",
      },
    ],
  },
});
