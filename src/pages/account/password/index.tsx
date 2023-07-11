import React, {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";
import AccountPasswordContainer from "@/components/Account/AccountPasswordContainer";

export default function Password() {
  return <AccountPasswordContainer/>
}

Password.getLayout = function (page: ReactElement) {
  return <Layout isAccountPage={true}>{page}</Layout>
}
