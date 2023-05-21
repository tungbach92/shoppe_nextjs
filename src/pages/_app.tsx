import '@/sass/style.scss'
import type {ReactElement, ReactNode} from 'react'
import type {NextPage} from 'next'
import type {AppProps} from 'next/app'
import {store} from "@/redux/store";
import {theme} from "@/theme";
import {Provider} from "react-redux";
import {ThemeProvider} from "@mui/material";
import ProductsProvider from "@/context/ProductsProvider";
import UserProvider from "@/context/UserProvider";
import Layout from "@/components/Layout/Layout";
import CheckoutProvider from "@/context/CheckoutProvider";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


export default function MyApp({Component, pageProps}: AppPropsWithLayout) {
  // each page define a getLayout func to render itself and layout and pass it to const getLayout variable here
  // ?? -> still use the layout defined for each page, if getLayout not call at page
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <ProductsProvider>
            <CheckoutProvider>
              {/* use get layout variable here to return a page */}
              {/*Component -> each page*/}
              {getLayout(<Component {...pageProps} />)}
              {/*{Component.getLayout ?? ((page: ReactElement) => <Layout>{page}</Layout>)}*/}
            </CheckoutProvider>
          </ProductsProvider>
        </UserProvider>
      </ThemeProvider>
    </Provider>
  )

}
