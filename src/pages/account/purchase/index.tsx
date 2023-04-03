import React, {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";
import {useUser} from "@/context/UserProvider";
import AccountMenu from "@/components/Account/AccountMenu";
import AccountOrder from "@/components/Account/AccountOrder";

export default function Purchase() {
  const {user} = useUser();
  return (
    <div className="main">
      <AccountMenu user={user}/>
      <div className="user-content">
        <AccountOrder/>
      </div>
    </div>
  )
}
Purchase.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}
