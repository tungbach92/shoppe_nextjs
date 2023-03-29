import {db} from "../configs/firebase";
import {searchHistoryDocRef} from "../common/dbRef";

export const saveSearchHistoryToFirebase = async (user, searchHistory) => {
  if (!user) return;
  try {
    await searchHistoryDocRef(user?.uid).set({
      basket: searchHistory,
    });
  } catch (error) {
    alert(error);
  }
};
