import React from "react";
import CartContainer from "../components/Cart/CartContainer";
import Header from "../components/Header/Header";

export default function Cart() {
  return (
    <>
      <Header isCartPage={true}></Header>
      <CartContainer isCartPage={true}></CartContainer>
    </>
  );
}
