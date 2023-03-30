import React, {ReactElement} from "react";
import Product from '@/components/Product'

import Layout from "@/components/Layout/Layout";
import {NextPageWithLayout} from "@/pages/_app";

const Page: NextPageWithLayout = () => {
  return (
    /** Your content */
    <Product/>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout isProductPage={true}>
      {page}
    </Layout>
  )
}
export default Page
