import React, {ReactNode} from "react";
import Layout from "@/components/Layout/Layout";
import CartContainer from "@/components/Cart/CartContainer";

export default function Cart() {
  return (
    // <CheckoutProvider>
    <CartContainer isCartPage={true}></CartContainer>
    // </CheckoutProvider>
  );
}

Cart.getLayout = (page: ReactNode) => <Layout isCartPage={true}>{page}</Layout>
