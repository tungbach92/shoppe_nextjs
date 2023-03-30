import React, {ReactNode} from "react";
import Header from "../../components/Header/Header";
import CheckoutContainer from "../../components/Checkout/CheckoutContainer";
import Layout from "@/components/Layout/Layout";
import CheckoutProvider from "@/context/CheckoutProvider";

export default function Checkout() {
  return (
    <CheckoutProvider>
      <CheckoutContainer isCheckoutPage={true}></CheckoutContainer>
    </CheckoutProvider>
  );
}

Checkout.getLayout = function (page: ReactNode) {
  return <Layout isCheckoutPage={true}>{page}</Layout>
}
