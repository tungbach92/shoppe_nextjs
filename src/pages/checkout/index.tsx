import React, {ReactNode} from "react";
import CheckoutContainer from "../../components/Checkout/CheckoutContainer";
import Layout from "@/components/Layout/Layout";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST ?? '');


export default function Checkout() {

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST) console.error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST environment variable is not set')

  return (
    <CheckoutContainer isCheckoutPage={true}></CheckoutContainer>
  )
}

Checkout.getLayout = function (page: ReactNode) {
  return (
    <Elements stripe={stripePromise}>
      {/*<CheckoutProvider>*/}
      <Layout isCheckoutPage={true}>{page}</Layout>
      {/*</CheckoutProvider>*/}
    </Elements>
  )
}
