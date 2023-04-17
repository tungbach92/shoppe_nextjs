import React from "react";
import classNames from "classnames";
import * as categoryType from "../../constants/category";
import * as sortType from "../../constants/sort";
import {
  Box,
  Button,
  Rating,
  styled,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {FilterAlt, List} from "@mui/icons-material";

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
  marginBottom: "0.6rem",
});

const StyledTypography = styled(Typography)({
  fontSize: "1.3rem",
  marginLeft: "0.6rem",
});

const StyledTextField = styled(TextField)({
  width: "40%",
  "& .MuiInputBase-input, & .MuiOutlinedInput-input": {
    padding: "0.45rem 0.6rem",
    fontSize: "1.2rem",
  },
});

export default function ProductCategory({
                                          category,
                                          setCategory,
                                          filteredItems,
                                          setStartPrice,
                                          setEndPrice,
                                          handleResetAll,
                                          setSortPrice,
                                          setSort,
                                          setRatingValue,
                                          startPriceRef,
                                          endPriceRef,
                                          ratingValue,
                                        }) {
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");
  const fiveRating = 5;
  const fourRating = 4;
  const threeRating = 3;
  const twoRating = 2;
  const oneRating = 1;
  const filterDisabled = filteredItems.length === 0;
  const handleCategoryClick = (value) => {
    setCategory(value);
    setSort(sortType.ALL);
    setSortPrice(sortType.DEFAULT_PRICE);
  };

  return (
    <div className="app__container-category">
      <div className="app__category-heading">
        <List className="app__heading-icon"></List>Danh mục
      </div>
      <ul className="app__category-list">
        <li
          data-name="category"
          onClick={() => handleCategoryClick(categoryType.ALL_PRODUCT)}
          className={classNames("app__category-item", "app__category-default", {
            "app__category-item--active": category === categoryType.ALL_PRODUCT,
          })}
        >
          <Box
            component="p"
            sx={{
              className: {
                xs: "",
                sm: category === categoryType.ALL_PRODUCT && "app__item-icon",
              },
            }}
          ></Box>
          <p className="app__item-link">Tất cả sản phẩm</p>
        </li>
        <li
          data-name="category"
          onClick={() => handleCategoryClick(categoryType.SHIRT)}
          className={classNames("app__category-item", "app__category-shirt", {
            "app__category-item--active": category === categoryType.SHIRT,
          })}
        >
          <Box
            component="p"
            sx={{
              className: {
                xs: "",
                sm: category === categoryType.SHIRT && "app__item-icon",
              },
            }}
          ></Box>
          <p className="app__item-link">Áo</p>
        </li>
        <li
          data-name="category"
          onClick={() => handleCategoryClick(categoryType.PANT)}
          className={classNames(
            "app__category-item",
            "app__category-discount",
            {"app__category-item--active": category === categoryType.PANT}
          )}
        >
          <Box
            component="p"
            sx={{
              className: {
                xs: "",
                sm: category === categoryType.PANT && "app__item-icon",
              },
            }}
          ></Box>
          <p className="app__item-link">Quần</p>
        </li>
        <li
          data-name="category"
          onClick={() => handleCategoryClick(categoryType.SHOE)}
          className={classNames("app__category-item", "app__category-shoe", {
            "app__category-item--active": category === categoryType.SHOE,
          })}
        >
          <Box
            component="p"
            sx={{
              className: {
                xs: "",
                sm: category === categoryType.SHOE && "app__item-icon",
              },
            }}
          ></Box>
          <p className="app__item-link">Giày, dép</p>
        </li>
        <li
          data-name="category"
          onClick={() => handleCategoryClick(categoryType.BAG)}
          className={classNames("app__category-item", "app__category-bag", {
            "app__category-item--active": category === categoryType.BAG,
          })}
        >
          <Box
            component="p"
            sx={{
              className: {
                xs: "",
                sm: category === categoryType.BAG && "app__item-icon",
              },
            }}
          ></Box>
          <p className="app__item-link">Túi xách</p>
        </li>
        <li
          data-name="category"
          onClick={() => handleCategoryClick(categoryType.SET)}
          className={classNames("app__category-item", "app__category-set", {
            "app__category-item--active": category === categoryType.SET,
          })}
        >
          <Box
            component="p"
            sx={{
              className: {
                xs: "",
                sm: category === categoryType.SET && "app__item-icon",
              },
            }}
          ></Box>
          <p className="app__item-link">Set</p>
        </li>
        <li
          data-name="category"
          data-value="accessories"
          onClick={() => handleCategoryClick(categoryType.ACCESSORIES)}
          className={classNames(
            "app__category-item",
            "app__category-accessories",
            {
              "app__category-item--active":
                category === categoryType.ACCESSORIES,
            }
          )}
        >
          <Box
            component="p"
            sx={{
              className: {
                xs: "",
                sm:
                  category === categoryType.ACCESSORIES ? "app__item-icon" : "",
              },
            }}
          ></Box>
          <p className="app__item-link">Phụ kiện</p>
        </li>
      </ul>

      {/* //TODO: Responsive price range and rating */}
      {!xsBreakpointMatches && (
        <>
          <Box
            p="2rem 0"
            sx={{borderBottom: "1px solid rgba(0, 0, 0, 0.05)"}}
            display="flex"
            alignItems="center"
          >
            <FilterAlt></FilterAlt>
            <Typography ml="1rem" fontSize="1.6rem" variant="h6">
              Bộ lọc tìm kiếm
            </Typography>
          </Box>
          <Box
            p="2rem 0"
            sx={{borderBottom: "1px solid rgba(0, 0, 0, 0.05)"}}
          >
            <Typography fontSize="1.4rem">Khoảng giá</Typography>
            <Box
              mt="1rem"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <StyledTextField
                type="text"
                inputProps={{inputMode: "numeric", pattern: "[0-9]*"}}
                name="startPrice"
                inputRef={startPriceRef}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");
                }}
                placeholder="Từ"
                size="small"
                disabled={filterDisabled}
              ></StyledTextField>
              <Typography fontSize="1.4rem">-</Typography>
              <StyledTextField
                type="text"
                inputProps={{inputMode: "numeric", pattern: "[0-9]*"}}
                name="endPrice"
                inputRef={endPriceRef}
                onChange={(e) => {
                  e.target.value = e.target.value
                    .replace(/[^0-9.]/g, "")
                    .replace(/(\..*)\./g, "$1");
                }}
                placeholder="Đến"
                size="small"
                disabled={filterDisabled}
              ></StyledTextField>
            </Box>
            <Button
              variant="contained"
              fullWidth
              sx={{
                marginTop: "1rem",
                fontSize: "1.3rem",
                color: "white",
                "&:disabled": {cursor: "not-allowed"},
              }}
              onClick={() => {
                setStartPrice(startPriceRef.current.value);
                setEndPrice(endPriceRef.current.value);
              }}
              disabled={filterDisabled}
            >
              Áp dụng
            </Button>
          </Box>
          <Box
            sx={{
              padding: "2rem 0",
              borderBottom: "1px solid rgba(0, 0, 0, 0.05)",
            }}
          >
            <Typography
              sx={{fontSize: "1.4rem", marginBottom: "0.6rem"}}
              component="p"
            >
              Đánh giá
            </Typography>
            <StyledBox
              onClick={() => !filterDisabled && setRatingValue(fiveRating)}
            >
              <Rating
                name="fiveRating"
                defaultValue={fiveRating}
                readOnly
                disabled={filterDisabled}
                size={ratingValue === 5 ? "large" : "medium"}
              />
            </StyledBox>
            <StyledBox
              onClick={() => !filterDisabled && setRatingValue(fourRating)}
            >
              <Rating
                name="fourRating"
                defaultValue={fourRating}
                readOnly
                disabled={filterDisabled}
                size={ratingValue === 4 ? "large" : "medium"}
              />
              <StyledTypography>trở lên</StyledTypography>
            </StyledBox>
            <StyledBox
              onClick={() => !filterDisabled && setRatingValue(threeRating)}
            >
              <Rating
                name="threeRating"
                defaultValue={threeRating}
                readOnly
                disabled={filterDisabled}
                size={ratingValue === 3 ? "large" : "medium"}
              />
              <StyledTypography>trở lên</StyledTypography>
            </StyledBox>
            <StyledBox
              onClick={() => !filterDisabled && setRatingValue(twoRating)}
            >
              <Rating
                name="twoRating"
                defaultValue={twoRating}
                readOnly
                disabled={filterDisabled}
                size={ratingValue === 2 ? "large" : "medium"}
              />
              <StyledTypography>trở lên</StyledTypography>
            </StyledBox>
            <StyledBox
              onClick={() => !filterDisabled && setRatingValue(oneRating)}
            >
              <Rating
                name="oneRating"
                defaultValue={oneRating}
                readOnly
                disabled={filterDisabled}
                size={ratingValue === 1 ? "large" : "medium"}
              />
              <StyledTypography>trở lên</StyledTypography>
            </StyledBox>
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{
              marginTop: "1rem",
              fontSize: "1.3rem",
              color: "white",
            }}
            onClick={handleResetAll}
          >
            Xoá tất cả
          </Button>
        </>
      )}
    </div>
  );
}
