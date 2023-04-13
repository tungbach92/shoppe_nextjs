import {useEffect, useState} from "react";
import {useMemo} from "react";
import {useSelector} from "react-redux";
import {useUser} from "../context/UserProvider";
import getSearchHistoryFromFirebase from "../services/getSearchHistoryFromFirebase";
import {saveSearchHistoryToFirebase} from "../services/saveSearchHistoryToFirebase";

const useSearchHistory = () => {
  const {user} = useUser();
  const searchInput = useSelector((state) => state.search.searchInput);
  const [searchHistory, setSearchHistory] = useState([]);
  const suggestions = useMemo(
    () =>
      searchHistory.filter((item) => {
        return item
          .trim()
          .toLowerCase()
          .includes(searchInput.trim().toLowerCase());
      }),
    [searchHistory, searchInput]
  );

  useEffect(() => {
    (async () => {
      if (user) {
        const searchHistory = await getSearchHistoryFromFirebase(user);
        setSearchHistory(searchHistory);
      }
    })();
  }, [setSearchHistory, user]);

  const addToSearchHistory = (text) => {
    text = text.trim();
    if (text.length > 0) {
      const newSearchHistory = [...searchHistory, text];
      const uniqueNewSearchHistory = [...new Set(newSearchHistory)];
      saveSearchHistoryToFirebase(user, uniqueNewSearchHistory).then();
      setSearchHistory(uniqueNewSearchHistory);
    }
  };

  const deleteFromSearchHistory = (text) => {
    text = text.trim();
    if (text.length > 0) {
      const newSearchHistory = [...searchHistory].filter(
        (item) => item !== text
      );
      setSearchHistory(newSearchHistory);
      saveSearchHistoryToFirebase(user, newSearchHistory).then();
    }
  };

  return {
    searchHistory,
    suggestions,
    addToSearchHistory,
    deleteFromSearchHistory,
  };
};

export default useSearchHistory;
