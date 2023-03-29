import { db } from "../configs/firebase";
import {searchHistoryDocRef} from "../common/dbRef";

const getSearchHistoryFromFirebase = async (user) => {
  if (!user) return;
  let searchHistory = [];
  try {
    const doc = await searchHistoryDocRef(user?.uid).get();
    if (doc.exists) {
      searchHistory = doc.data().basket;
    }
  } catch (error) {
    alert(error.message);
  }
  return searchHistory;
};
export default getSearchHistoryFromFirebase;
