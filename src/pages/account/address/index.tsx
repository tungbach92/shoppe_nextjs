import AccountContainer from "@/components/Account/AccountContainer";
import AccountProfile from "@/components/Account/AccountProfile";
import React, {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";
import AccountAddress from "@/components/Account/AccountAddress";
import AccountMenu from "@/components/Account/AccountMenu";
import {useUser} from "@/context/UserProvider";
import withContainer from "@/components/withContainer";

function Address() {
  const {user} = useUser();

  return (
    <div className="main">
      <AccountMenu user={user}/>
      <div className="user-content">
        <AccountAddress/>
      </div>
    </div>
  )
}
Address.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}
export default withContainer(Address, true);
