import classNames from "classnames";
import React, {useEffect, useState} from "react";
import shopeeLogo from "../../img/shoppe-logo.png";
import HeaderCart from "./HeaderCart";
import {Close} from "@mui/icons-material";
import {useRef} from "react";
// import {useNavigate} from "react-router-dom";
import {Box, Stack} from "@mui/material";
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {changeSearchInput, changeSearchItems} from "../../redux/searchSlice";
import {useProductsContext} from "../../context/ProductsProvider";
import useSearchHistory from "../../hooks/useSearchHistory";
import {useUser} from "../../context/UserProvider";

const HeaderSearch = ({isCartPage, isCheckoutPage, xsBreakpointMatches}) => {
  const {items} = useProductsContext();
  const {addToSearchHistory, deleteFromSearchHistory, suggestions} =
    useSearchHistory();
  const searchInput = useSelector((state) => state.search.searchInput);
  const dispatch = useDispatch();
  const wrapperRef = useRef();
  // const navigate = useNavigate();

  const [isHistory, setIsHistory] = useState(false);

  const handleInputClick = (e) => {
    if (!xsBreakpointMatches) {
      setIsHistory(!isHistory);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    // setSearchInput(text);
    dispatch(changeSearchInput(text));
  };

  const handleSuggestionClick = (text) => {
    // setSearchInput(text);
    dispatch(changeSearchInput(text));
    handleSearchIconClick(text);
  };

  const handleSearchIconClick = async (text) => {
    addToSearchHistory(text);
    // handleSearchInputChange(text);
    dispatch(changeSearchItems(items));
    setIsHistory(false);
    // navigate("/search"); // navigate to search 1 time
  };

  const handleHistoryDelete = (item) => {
    deleteFromSearchHistory(item);
  };

  const inputOnKeyUp = (event) => {
    const enter = 13;
    if (event.keyCode === enter) {
      event.currentTarget.blur();
      handleSearchIconClick(event.target.value);
    }
  };

  useEffect(() => {
    if (xsBreakpointMatches) {
      setIsHistory(false);
    }
  }, [xsBreakpointMatches]);

  const onMouseDown = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setIsHistory(false);
    }
  };

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     document.addEventListener("mousedown", onMouseDown);
  //     return () => {
  //       document.removeEventListener("mousedown", onMouseDown);
  //     };
  //   }
  // }, [window]);

  return (
    <div
      className={classNames("header__search", {
        "header__search--cart":
          (isCartPage && !xsBreakpointMatches) ||
          (isCheckoutPage && !xsBreakpointMatches),
      })}
    >
      <div className="header__logo-wrapper">
        {/*<a*/}
        {/*  href="/"*/}
        {/*  className={classNames("header__logo-link", {*/}
        {/*    "header__logo-link--notHome": isCartPage || isCheckoutPage,*/}
        {/*  })}*/}
        {/*>*/}
        {/*  <img src={shopeeLogo} alt="shoppe-logo"/>*/}
        {/*</a>*/}
        {isCartPage && <div className="header__page-name">Giỏ hàng</div>}
        {isCheckoutPage && <div className="header__page-name">Thanh Toán</div>}
      </div>

      {!isCheckoutPage && (
        <>
          <div
            ref={wrapperRef}
            className={classNames("header__search-content", {
              "header__search-content--cart":
                isCartPage && !xsBreakpointMatches,
            })}
          >
            <div className="header__search-wrapper">
              <input
                type="text"
                onChange={handleInputChange}
                onClick={handleInputClick}
                // onBlur={handleSearchBlur}
                onKeyUp={inputOnKeyUp}
                className="header__search-input"
                placeholder="Tìm sản phẩm, thương hiệu, và tên shop"
                value={searchInput}
              />
              <div
                onClick={() => handleSearchIconClick(searchInput)}
                className="header__search-icon"
              >
                <i className="bi bi-search"></i>
              </div>
              {isHistory && (
                <ul className="header__history-list">
                  <li className="header__history-title">Lịch Sử Tìm Kiếm</li>
                  {suggestions.map((item, index) => (
                    <Stack
                      sx={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        "&:hover": {
                          backgroundColor: "var(--lighter-grey-color)",
                        },
                      }}
                      key={index}
                    >
                      <li
                        onClick={() => handleSuggestionClick(item)}
                        className="header__history-item"
                      >
                        <a href="# " className="header__history-link">
                          {item}
                        </a>
                      </li>
                      <Box
                        sx={{
                          marginRight: "0.6rem",
                          "& :hover": {color: "var(--primary-color)"},
                          cursor: "pointer",
                          textAlign: "center",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Close
                          onClick={() => handleHistoryDelete(item)}
                        ></Close>
                      </Box>
                    </Stack>
                  ))}
                </ul>
              )}
            </div>

            <ul className="header__search-list">
              {/* list of recommends */}
              {/*{[].map((item) => (*/}
              {/*  <li className="header__search-item">*/}
              {/*    <a href="# " className="header__item-link">*/}
              {/*      {item}*/}
              {/*    </a>*/}
              {/*  </li>*/}
              {/*))}*/}
            </ul>
          </div>
          {!isCartPage && <HeaderCart></HeaderCart>}
        </>
      )}
    </div>
  );
};
HeaderSearch.propTypes = {
  isCartPage: PropTypes.bool,
  isCheckoutPage: PropTypes.bool,
  xsBreakpointMatches: PropTypes.bool.isRequired,
};
HeaderSearch.defaultProps = {
  isCartPage: false,
  isCheckoutPage: false,
};

export default HeaderSearch;
