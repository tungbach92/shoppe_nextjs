import React, {useEffect} from "react";
import {DefaultRootState, RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {changeSearchInput} from "@/redux/searchSlice";
import ProductContainer from "@/components/Product/ProductContainer";
import {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";

const Search = () => {
  const searchItems = useSelector((state: RootStateOrAny) => state.search.searchItems);
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
    <ProductContainer items={searchItems}></ProductContainer>
  );
};
Search.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}
export default Search;
