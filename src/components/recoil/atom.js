import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

const { persistAtom } = recoilPersist();

export const bookMarkState = atom({
  key: "bookMarkState",
  default: {},
});

export const userDataState = atom({
  key: "userDataState",
  default: {},
});

export const userBookListState = atom({
  key: "userBookListState",
  default: [],
});

export const userBookMarkListState = atom({
  key: "userBookMarkListState",
  // default: [{ title: "야옹" }],
  default: [
    { title: "야옹" },
    { title: "야옹" },
    { title: "야옹" },
    { title: "야옹" },
    { title: "야옹" },
    { title: "야옹" },
    { title: "야옹" },
    { title: "야옹" },
    { title: "야옹" },
  ],
});

export const bookMarkListState = atom({
  key: "bookMarkListState",
  default: [],
});

export const catColorState = atom({
  key: "catColorState",
  default: "",
});

export const selectedBookState = atom({
  key: "selectedBookState",
  default: {},
});

export const recommendationListState = atom({
  key: "recommendationListState",
  default: [],
});

export const recommendationList2State = atom({
  key: "recommendationList2State",
  default: [],
});

export const recommendationState = atom({
  key: "recommendationState",
  default: [],
});

export const instagramState = atom({
  key: "instagramState",
  default: {},
});

export const communityListState = atom({
  key: "communityListState",
  default: [],
});
