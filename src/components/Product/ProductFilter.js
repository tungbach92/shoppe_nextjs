import React, { useState } from "react";
import classNames from "classnames";
import MiniPageControl from "../Pagination/MiniPageControl";
import {ArrowDownward, ArrowUpward, ExpandMore, UnfoldMore} from "@mui/icons-material";
import { Box, useMediaQuery } from "@mui/material";
import * as sortType from "../../constants/sort";

const ProductFilter = ({
  sort,
  setSort,
  sortPrice,
  setSortPrice,
  filteredItems,
  categoryItems,
  pageIndex,
  setPageIndex,
  pageSize,
  pageTotal,
}) => {
  const [isFilterPriceShow, setIsFilterPriceShow] = useState(false);
  const [
    isFilterPriceDescForXsResponsive,
    setIsFilterPriceDescForXsResponsive,
  ] = useState(false);
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");
  let totalCategoryItems = categoryItems.length;
  let totalFilteredItems = filteredItems.length;
  const filterDisabled = totalCategoryItems === 0;

  const handleFilterPriceClickForXsResponsive = () => {
    if (!isFilterPriceDescForXsResponsive) {
      setSortPrice(sortType.PRICE_ASC);
      // handleCategoryItemsBySort(sortType.PRICE_ASC);

      setIsFilterPriceDescForXsResponsive(true);
    }
    if (isFilterPriceDescForXsResponsive) {
      setSortPrice(sortType.PRICE_DESC);
      // handleCategoryItemsBySort(sortType.PRICE_DESC);

      setIsFilterPriceDescForXsResponsive(false);
    }
  };

  const handleSortChange = (sort) => {
    // handleCategoryItemsBySort(sort);
    setSort(sort);
    setSortPrice(sortType.DEFAULT_PRICE);
  };

  const handleSortPriceChange = (sortPrice) => {
    // handleCategoryItemsBySort(sortPrice);
    setSortPrice(sortPrice);
  };

  return (
    <Box className="app__filter">
      <div className="app__filter-label">Sắp xếp theo</div>
      <div className="app__filter-list">
        {/* <!-- active: btn--active --> */}
        <button
          data-name="filter"
          data-value="all"
          onClick={() =>
            filterDisabled ? undefined : handleSortChange(sortType.ALL)
          }
          className={classNames("btn app__filter-item app__filter-popular", {
            "btn--active": sort === "all",
          })}
          disabled={filterDisabled}
        >
          Tất cả
        </button>
        <button
          data-name="filter"
          data-value="date"
          onClick={() =>
            filterDisabled ? undefined : handleSortChange(sortType.DATE)
          }
          className={classNames("btn app__filter-item app__filter-newest", {
            "btn--active": sort === "date",
          })}
          disabled={filterDisabled}
        >
          Mới nhất
        </button>
        <button
          data-name="filter"
          data-value="bestSelling"
          onClick={() =>
            filterDisabled ? undefined : handleSortChange(sortType.BEST_SELLING)
          }
          className={classNames("btn app__filter-item app__filter-bestSell", {
            "btn--active": sort === "bestSelling",
          })}
          disabled={filterDisabled}
        >
          Bán chạy
        </button>
        <div
          data-name="filterPrice"
          onClick={() =>
            totalFilteredItems > 1 &&
            (xsBreakpointMatches
              ? handleFilterPriceClickForXsResponsive()
              : setIsFilterPriceShow(!isFilterPriceShow))
          }
          tabIndex="0"
          onBlur={() => setIsFilterPriceShow(false)}
          className={
            filteredItems.length > 1
              ? "select-input"
              : " select-input--disabled"
          }
        >
          <span
            className={classNames("app__input-lable", {
              "app__input-lable--active": sortPrice !== "default",
            })}
          >
            {!xsBreakpointMatches
              ? sortPrice === "priceAsc"
                ? "Giá: Thấp đến cao"
                : sortPrice === "priceDesc"
                ? "Giá: Cao đến thấp"
                : "Giá"
              : "Giá"}
          </span>
          {sortPrice === "default" && (
            <UnfoldMore
              sx={{ display: { sm: "none", xs: "inline" } }}
            ></UnfoldMore>
          )}
          {xsBreakpointMatches && sortPrice === "priceDesc" && (
            <ArrowDownward
              sx={{ color: "var(--primary-color)" }}
            ></ArrowDownward>
          )}
          {xsBreakpointMatches && sortPrice === "priceAsc" && (
            <ArrowUpward sx={{ color: "var(--primary-color)" }}></ArrowUpward>
          )}
          <ExpandMore className="app__input-icon"></ExpandMore>
          {isFilterPriceShow && (
            <ul className="app__input-list">
              {/* <!-- icon: <i className="app__input-item-icon bi bi-check"></i> --> */}
              {/* <!-- active: app__input-item--active  --> */}
              <li className="app__input-item app__price-default app__input-item--active">
                Giá<i className="app__input-item-icon bi bi-check"></i>
              </li>
              <li
                onClick={(e) => {
                  handleSortPriceChange(sortType.PRICE_ASC);
                  setIsFilterPriceShow(!isFilterPriceShow);
                }}
                className={classNames("app__input-item", "app__price-asc", {
                  "app__input-item--active": sortPrice === sortType.PRICE_ASC,
                })}
              >
                Giá: Thấp đến Cao
                <i
                  className={
                    sortPrice === sortType.PRICE_ASC
                      ? "app__input-item-icon bi bi-check"
                      : undefined
                  }
                ></i>
              </li>
              <li
                onClick={(e) => {
                  handleSortPriceChange(sortType.PRICE_DESC);
                  setIsFilterPriceShow(!isFilterPriceShow);
                }}
                className={classNames("app__input-item", "app__price-desc", {
                  "app__input-item--active": sortPrice === sortType.PRICE_DESC,
                })}
              >
                Giá: Cao đến Thấp
                <i
                  className={
                    sortPrice === sortType.PRICE_DESC
                      ? "app__input-item-icon bi bi-check"
                      : undefined
                  }
                ></i>
              </li>
            </ul>
          )}
        </div>
      </div>
      <div className="app__filter-page">
        <MiniPageControl
          totalItems={totalFilteredItems}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          pageTotal={pageTotal}
        ></MiniPageControl>
      </div>
    </Box>
  );
};

export default ProductFilter;
