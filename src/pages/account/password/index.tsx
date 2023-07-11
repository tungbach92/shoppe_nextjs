import React, {ReactElement, useEffect, useState} from "react";
import Layout from "@/components/Layout/Layout";
import {useUser} from "@/context/UserProvider";
import AccountMenu from "@/components/Account/AccountMenu";
import AccountPassword from "@/components/Account/AccountPassword";
import withContainer from "@/components/withContainer";

function Password() {
  const {user} = useUser();
  const [email, setEmail] = useState<string>('')
  useEffect(() => {
    if (user) {
      const email = user.email;
      setEmail(email ? email : "");
    }
  }, [user])
  return (
    <div className="main">
      <AccountMenu user={user}/>
      <div className="user-content">
        <AccountPassword email={email} setEmail={setEmail}/>
      </div>
    </div>
  )
}

Password.getLayout = function (page: ReactElement) {
  return <Layout isAccountPage={true}>{page}</Layout>
}
export default withContainer(Password, true)
