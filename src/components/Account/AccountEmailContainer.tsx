import {useUser} from "@/context/UserProvider";
import React, {useEffect, useState} from "react";
import AccountMenu from "@/components/Account/AccountMenu";
import AccountEmail from "@/components/Account/AccountEmail";
import withContainer from "@/components/withContainer";
import {useMediaQuery} from "@mui/material";

const AccountEmailContainer = () => {
  const {user} = useUser();
  const [email, setEmail] = useState<string>('')
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");
  
  useEffect(() => {
    if (user) {
      const email = user.email;
      setEmail(email ? email : "");
    }
  }, [user])
  return (
    <div className="main">
      {!xsBreakpointMatches &&
        <AccountMenu user={user}/>
      }
      <div className="user-content">
        <AccountEmail email={email} setEmail={setEmail}/>
      </div>
    </div>)
}
export default withContainer(AccountEmailContainer, true)
