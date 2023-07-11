//set up routing for Account feature
import React, {ReactElement, useEffect} from "react";
import Layout from "@/components/Layout/Layout";
import {useRouter} from "next/router";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST ?? '');

export default function Account() {
  const router = useRouter()

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST) console.error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST environment variable is not set')

  useEffect(() => {
    router.push("/account/profile")
  }, [])
  return null
}

Account.getLayout = function (page: ReactElement) {
  return (
    <Elements stripe={stripePromise}>
      <Layout isAccountPage={true}>{page}</Layout>
    </Elements>
  )
}
