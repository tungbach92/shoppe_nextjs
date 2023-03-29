import React from "react";
import Header from "../components/Header/Header";
import CheckoutContainer from "../components/Checkout/CheckoutContainer";

export default function Checkout() {
  return (
    <>
      <Header isCheckoutPage={true}></Header>
      <CheckoutContainer isCheckoutPage={true}></CheckoutContainer>
    </>
  );
}
