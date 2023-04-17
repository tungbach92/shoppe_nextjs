import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import PropTypes from "prop-types";
import React, { useMemo, useRef, useState } from "react";
import * as categoryType from "../../constants/category";
import * as sortType from "../../constants/sort";
import { useProductsContext } from "@/context/ProductsProvider";
import usePagination from "../../hooks/usePagination";
import withContainer from "../withContainer";
import Pagination from "../Pagination/Pagination";
import ProductCategory from "./ProductCategory";
import ProductFilter from "./ProductFilter";
import ProductList from "./ProductList";

const newestDays = 180;
const oneDayinMs = 24 * 3600 * 1000;
const currentTimeinMs = new Date().valueOf();

const ProductContainer = ({ items }) => {
  const { bestSelling } = useProductsContext();
  const [category, setCategory] = useState(categoryType.ALL_PRODUCT);
  const [sort, setSort] = useState(sortType.ALL);
  const [sortPrice, setSortPrice] = useState(sortType.DEFAULT_PRICE);
  const [startPrice, setStartPrice] = useState("");
  const [endPrice, setEndPrice] = useState("");
  const [ratingValue, setRatingValue] = useState(0);
  const startPriceRef = useRef();
  const endPriceRef = useRef();

  const categoryItems = useMemo(() => {
    return items.filter((item) => {
      let result = true;
      if (category !== categoryType.ALL_PRODUCT) {
        result = item.category === category;
      }
      return result;
    });
  }, [category, items]);

  const filteredItems = useMemo(() => {
    return categoryItems
      .filter((item) => {
        let result = true;
        if (sort === sortType.BEST_SELLING) {
          result = item.soldAmount >= bestSelling;
        }
        if (sort === sortType.DATE) {
          result =
            Math.floor(new Date(item.date).valueOf() / oneDayinMs) >
            Math.floor(currentTimeinMs / oneDayinMs) - newestDays;
        }
        // result = item.rating >= ratingValue
        return result;
      })
      .filter((item) => {
        let result = true;
        if (startPrice.length > 0 && endPrice.length === 0) {
          result = item.price >= Number(startPrice);
        }
        if (startPrice.length > 0 && endPrice.length > 0) {
          result =
            item.price >= Number(startPrice) && item.price <= Number(endPrice);
        }
        if (startPrice.length === 0 && endPrice.length > 0) {
          result = item.price <= Number(endPrice);
        }
        if (startPrice.length > 0 && endPrice.length === 0) {
          result = item.price >= Number(startPrice);
        }
        if (startPrice.length > 0 && endPrice.length > 0) {
          result =
            item.price >= Number(startPrice) && item.price <= Number(endPrice);
        }
        if (startPrice.length === 0 && endPrice.length > 0) {
          result = item.price <= Number(endPrice);
        }
        return result;
      })
      .sort((a, b) => {
        if (sortPrice === sortType.PRICE_ASC) {
          return parseFloat(a.price) - parseFloat(b.price);
        }
        if (sortPrice === sortType.PRICE_DESC) {
          return parseFloat(b.price) - parseFloat(a.price);
        }
        return 0;
      })
      .filter((item) => item.rating >= ratingValue);
  }, [
    bestSelling,
    categoryItems,
    endPrice,
    ratingValue,
    sort,
    sortPrice,
    startPrice,
  ]);

  const { pageIndex, setPageIndex, pageSize, pageTotal } =
    usePagination(filteredItems);

  const handleResetAll = () => {
    setCategory(categoryType.ALL_PRODUCT);
    setSort(sortType.ALL);
    setSortPrice(sortType.DEFAULT_PRICE);
    setRatingValue(0);
    setStartPrice("");
    setEndPrice("");
    startPriceRef.current.value = "";
    endPriceRef.current.value = "";
  };

  return (
    <Grid2
      container
      maxWidth={"100%"}
      sx={{
        flexDirection: { xs: "column", sm: "row" },
        padding: { xs: "0", sm: "0.3rem 0" },
      }}
    >
      <Grid2
        bgcolor="white"
        xs
        sm={2}
        sx={{
          position: { xs: "sticky", sm: "unset" },
          top: { xs: "6.5rem", sm: "unset" },
          zIndex: { xs: "3", sm: "0" },
          padding: { xs: "1rem 0", sm: "0" },
        }}
      >
        <ProductCategory
          category={category}
          setCategory={setCategory}
          filteredItems={filteredItems}
          setSort={setSort}
          setSortPrice={setSortPrice}
          startPrice={startPrice}
          setStartPrice={setStartPrice}
          endPrice={endPrice}
          setEndPrice={setEndPrice}
          handleResetAll={handleResetAll}
          setRatingValue={setRatingValue}
          ratingValue={ratingValue}
          startPriceRef={startPriceRef}
          endPriceRef={endPriceRef}
        ></ProductCategory>
      </Grid2>
      <Grid2 xs sm={10}>
        <ProductFilter
          sort={sort}
          setSort={setSort}
          sortPrice={sortPrice}
          setSortPrice={setSortPrice}
          categoryItems={categoryItems}
          filteredItems={filteredItems}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          pageTotal={pageTotal}
        ></ProductFilter>
        <ProductList
          items={filteredItems}
          pageIndex={pageIndex}
          pageSize={pageSize}
        ></ProductList>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <Pagination
            items={filteredItems}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            pageSize={pageSize}
            pageTotal={pageTotal}
          ></Pagination>
        </Box>
      </Grid2>
    </Grid2>
  );
};

ProductContainer.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

ProductContainer.defaultProps = {};

export default withContainer(ProductContainer);
