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

export const recommendationListState = atom({
  key: "recommendationListState",
  default: [],
});

export const recommendationState = atom({
  key: "recommendationState",
  default: [],
});
