import {searchHistoryDocRef} from "@/common/dbRef";
import { setDoc } from "firebase/firestore";

export const saveSearchHistoryToFirebase = async (user, searchHistory) => {
  if (!user) return;
  try {
    await setDoc(searchHistoryDocRef(user?.uid), {
      basket: searchHistory,
    });
  } catch (error) {
    alert(error);
  }
};
