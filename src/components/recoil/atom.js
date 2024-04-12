import { recoilPersist } from "recoil-persist";
import { atom } from "recoil";

const { persistAtom } = recoilPersist();

export const savedBookListState = atom({
  key: "savedBookListState",
  default: [],
  // effects_UNSTABLE: [persistAtom],
});
