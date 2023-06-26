import React, {ReactElement} from "react";
import Layout from "@/components/Layout/Layout";
import AccountMenu from "@/components/Account/AccountMenu";
import AccountPayment from "@/components/Account/AccountPayment";
import {useUser} from "@/context/UserProvider";
import withContainer from "@/components/withContainer";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST ?? '');

function Payment() {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST) console.error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST environment variable is not set')

  const {user} = useUser();
  return (
    <div className="main">
      <AccountMenu user={user}/>
      <div className="user-content">
        <Elements stripe={stripePromise}>
          <AccountPayment/>
        </Elements>
      </div>
    </div>
  )
}


Payment.getLayout = function (page: ReactElement) {
  return (
    <Layout>{page}</Layout>
  )
}

export default withContainer(Payment, true)
