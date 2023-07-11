import React, {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";
import AccountAddressContainer from "@/components/Account/AccountAddressContainer";

export default function Address() {
  return <AccountAddressContainer/>
}

Address.getLayout = function (page: ReactElement) {
  return <Layout isAccountPage={true}>{page}</Layout>
}
