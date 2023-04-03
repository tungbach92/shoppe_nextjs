//set up routing for Account feature
import React, {ReactElement, ReactNode, useEffect} from "react";
import Header from "../../components/Header/Header";
import AccountContainer from "../../components/Account/AccountContainer";
import Layout from "@/components/Layout/Layout";
import Cart from "@/components/Cart";
import {useRouter} from "next/router";

export default function Account() {
  const router = useRouter()
  useEffect(() => {
    router.push("/account/profile")
  }, [])
  return null
}

Account.getLayout = function (page: ReactElement) {
  return <Layout>{page}</Layout>
}
