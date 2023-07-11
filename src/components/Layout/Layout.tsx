import React, {ReactNode} from "react";
import Head from "next/head";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";

interface Props {
  children: ReactNode
  isProductPage?: boolean
  isCartPage?: boolean
  isCheckoutPage?: boolean,
  isLoginPage?: boolean,
  isRegisterPage?: boolean,
  headerText?: string,
  isAccountPage?: boolean
}

export default function Layout({
                                 children,
                                 isProductPage = false,
                                 isCartPage = false,
                                 isCheckoutPage = false,
                                 isLoginPage = false,
                                 isRegisterPage = false,
                                 headerText = '',
                                 isAccountPage = false
                               }: Props) {
  return (
    <>
      <Head>
        <title>My app</title>
        <meta name="description" content="Generated by create next app"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>
      <Header isProductPage={isProductPage} isCartPage={isCartPage} isCheckoutPage={isCheckoutPage}
              isLoginPage={isLoginPage} isRegisterPage={isRegisterPage} isAccountPage={isAccountPage}
              headerText={headerText}/>
      {children}
      <Footer/>
    </>
  )
}
