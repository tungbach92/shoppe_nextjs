//set up routing for Account feature
import React, {ReactElement, ReactNode} from "react";
import Header from "../../components/Header/Header";
import AccountContainer from "../../components/Account/AccountContainer";
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

Account.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}
