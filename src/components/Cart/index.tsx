import React from "react";
import CartContainer from "./CartContainer";
import {ReactNode} from "react";
import Layout from "@/components/Layout/Layout";

export default function Cart() {
  return (
    <>
      {/*<Header isCartPage={true}></Header>*/}
      <CartContainer></CartContainer>
    </>
  );
}

Cart.getLayout = (page: ReactNode) => <Layout isCartPage={true}>{page}</Layout>
