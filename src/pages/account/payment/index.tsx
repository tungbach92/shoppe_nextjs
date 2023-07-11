import React, {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";
import AccountPaymentContainer from "@/components/Account/AccountPaymentContainer";


export default function Payment() {
  return <AccountPaymentContainer/>
}


Payment.getLayout = function (page: ReactElement) {
  return (
    <Layout isAccountPage={true}>{page}</Layout>
  )
}

