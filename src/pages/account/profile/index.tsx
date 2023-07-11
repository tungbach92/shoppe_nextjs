import React, {ReactNode} from "react";
import Layout from "@/components/Layout/Layout";
import AccountProfileContainer from "@/components/Account/AccountProfileContainer";

export default function Profile() {
  return <AccountProfileContainer/>
}

Profile.getLayout = (page: ReactNode) => {
  return <Layout isAccountPage={true}>{page}</Layout>
}

