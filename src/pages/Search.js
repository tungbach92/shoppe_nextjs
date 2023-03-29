import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/Header/Header";
import ProductContainer from "../components/Product/ProductContainer";
import { changeSearchInput } from "../redux/searchSlice";
const Search = () => {
  const searchItems = useSelector((state) => state.search.searchItems);
  const dispatch = useDispatch();
  // const [searchParams, setSearchParams] = useSearchParams();

  // useEffect(() => {
  //   setSearchParams({ keyword: searchInput }, { replace: true });
  // }, [searchInput, setSearchParams]);

  useEffect(() => {
    return () => {
      dispatch(changeSearchInput(""));
    };
  }, [dispatch]);

  return (
    <>
      <Header></Header>
      <ProductContainer items={searchItems}></ProductContainer>
    </>
  );
};

export default Search;
