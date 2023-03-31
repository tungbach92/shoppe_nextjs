import React from "react";
import {ReactNode} from "react";
import Layout from "@/components/Layout/Layout";
import CartContainer from "@/components/Cart/CartContainer";

export default function Cart() {
  return (
    <CartContainer></CartContainer>
  );
}

Cart.getLayout = (page: ReactNode) => <Layout isCartPage={true}>{page}</Layout>
