import AccountContainer from "@/components/Account/AccountContainer";
import AccountProfile from "@/components/Account/AccountProfile";
import React, {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";
import AccountMenu from "@/components/Account/AccountMenu";
import AccountAddress from "@/components/Account/AccountAddress";
import AccountPayment from "@/components/Account/AccountPayment";
import {useUser} from "@/context/UserProvider";
import withContainer from "@/components/withContainer";

function Payment() {
  const {user} = useUser();
  return (
    <div className="main">
      <AccountMenu user={user}/>
      <div className="user-content">
        <AccountPayment/>
      </div>
    </div>
  )
}


Payment.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default withContainer(Payment, true)
