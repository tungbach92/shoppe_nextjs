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

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({Component, pageProps}: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <UserProvider>
          <ProductsProvider>
            {getLayout(<Component {...pageProps} />)}
          </ProductsProvider>
        </UserProvider>
      </ThemeProvider>
    </Provider>
  )

}
