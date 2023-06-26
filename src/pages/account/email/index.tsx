import React, {ReactElement, useEffect, useState} from "react";
import Layout from "@/components/Layout/Layout";
import {useUser} from "@/context/UserProvider";
import AccountMenu from "@/components/Account/AccountMenu";
import AccountEmail from "@/components/Account/AccountEmail";
import withContainer from "@/components/withContainer";

function Email() {
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
        <AccountEmail email={email} setEmail={setEmail}/>
      </div>
    </div>)
}

Email.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default withContainer(Email, true)
