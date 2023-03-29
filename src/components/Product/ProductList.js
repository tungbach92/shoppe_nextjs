import React, { useEffect, useMemo } from "react";
import ProductItem from "./ProductItem";
import { Box, useMediaQuery } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import { useProductsContext } from "../../context/ProductsProvider";
import { ClipLoading } from "../ClipLoading";
function ProductList({ items, pageIndex, pageSize }) {
  const { itemsLoading } = useProductsContext();

  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");

  // scrollToTop
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const renderItemsByPagination = useMemo(() => {
    let renderItem = [];
    renderItem = items.slice((pageIndex - 1) * pageSize, pageIndex * pageSize);
    if (xsBreakpointMatches) {
      renderItem = items;
    }
    return renderItem;
  }, [items, pageIndex, pageSize, xsBreakpointMatches]);

  return (
    <Grid2 container columnSpacing="0.5rem" rowSpacing="1rem">
      {itemsLoading && <ClipLoading></ClipLoading>}
      {renderItemsByPagination.length === 0 && !itemsLoading && (
        <Box
          sx={{
            flex: 1,
            textAlign: "center",
            padding: "14.5rem",
            fontSize: "1.6rem",
            color: "var(--primary-color)",
            fontWeight: "600",
          }}
        >
          Không có sản phẩm...
        </Box>
      )}
      {renderItemsByPagination.map((item) => (
        <ProductItem key={item.id} item={item}></ProductItem>
      ))}
    </Grid2>
  );
}

export default ProductList;
