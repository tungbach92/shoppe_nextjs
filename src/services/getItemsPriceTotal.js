export const getItemsPriceTotal = (items) => {
  const result = items?.reduce(
    (checkoutPriceTotal, item) => checkoutPriceTotal + item.price * item.amount,
    0
  );
  return result ? result : 0;
};
