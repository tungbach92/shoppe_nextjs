//set up routing for Account feature
import React, {ReactNode} from "react";
import Header from "../Header/Header";
import AccountContainer from "./AccountContainer";
import Layout from "@/components/Layout/Layout";
import Cart from "@/components/Cart";

export default function Account() {
  return (
    <>
      {/*<Header isAccountPage={true}></Header>*/}
      <AccountContainer></AccountContainer>
    </>
  );
}
