import React, {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";
import AccountEmailContainer from "@/components/Account/AccountEmailContainer";

export default function Email() {
  return <AccountEmailContainer/>
}

Email.getLayout = function (page: ReactElement) {
  return <Layout isAccountPage={true}>{page}</Layout>
}

