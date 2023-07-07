import {getItemsPriceTotal} from "./getItemsPriceTotal";

export const getVoucherDiscount = (voucher, checkoutItems) => {
  if (voucher) {
    let result = voucher?.discount?.includes("%")
      ? (getItemsPriceTotal(checkoutItems) *
        Number(voucher.discount.slice(0, -1))) /
      100
      : voucher.discount;
    return result;
  } else {
    return 0;
  }
};
