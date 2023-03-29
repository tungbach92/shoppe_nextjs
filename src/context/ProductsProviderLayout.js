// import { Outlet } from "react-router-dom";
import ProductsProvider from "./ProductsProvider";

const ProductsProviderLayout = () => {
  return (
    <ProductsProvider>
      {/*<Outlet />*/}
    </ProductsProvider>
  );
};
export default ProductsProviderLayout;
