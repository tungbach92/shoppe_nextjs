import React, {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";
import AccountPurchaseContainer from "@/components/Account/AccountPurchaseContainer";

export default function Purchase() {
  return <AccountPurchaseContainer/>
}

Purchase.getLayout = function (page: ReactElement) {
  return <Layout isAccountPage={true}>{page}</Layout>
}

