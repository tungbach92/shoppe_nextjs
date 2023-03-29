//set up routing for Account feature
import React from "react";
import Header from "../components/Header/Header";
import AccountContainer from "../components/Account/AccountContainer";

export default function Account() {
  return (
    <>
      <Header isAccountPage={true}></Header>
      <AccountContainer></AccountContainer>
    </>
  );
}
