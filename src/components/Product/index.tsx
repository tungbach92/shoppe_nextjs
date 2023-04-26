import React from "react";
import Header from "../Header/Header";
import { useProductsContext } from "@/context/ProductsProvider";
import ProductContainer from "@/components/Product/ProductContainer";

export default function Product() {
  const { items } = useProductsContext();

  return (
    <>
      <ProductContainer items={items}></ProductContainer>
    </>
  );
}
