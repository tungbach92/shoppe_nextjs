import React from "react";
import Header from "../Header/Header";
import ProductContainer from "./ProductContainer";
import { useProductsContext } from "../../context/ProductsProvider";

export default function Product() {
  // const { setSearchInput } = useProduct();
  const { items } = useProductsContext();

  return (
    <>
      <ProductContainer items={items}></ProductContainer>
    </>
  );
}
