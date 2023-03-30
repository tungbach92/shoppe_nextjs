import Cart from "@/components/Cart";
import CheckoutProvider from "@/context/CheckoutProvider";

export default function CartPage() {
  return (
    <CheckoutProvider>
      <Cart/>
    </CheckoutProvider>
  )
}
