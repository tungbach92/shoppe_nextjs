import {proxy, subscribe} from "valtio/vanilla";
import {atomWithProxy} from "jotai-valtio";

export const voucherList: Voucher[] = [
  {code: "FREE", discount: "100%"},
  {code: "SALE50", discount: "50%"},
  {code: "SALE100000", discount: "100000"},
];

const voucherStoreProxy = proxy<VoucherStore>({
  voucher: null,
  updateVoucher(text: string) {
    const voucher = voucherList.find((item) => item.code === text);
    if (!voucher) {
      voucherStoreProxy.isValidVoucher = false;
      return;
    }
    voucherStoreProxy.isValidVoucher = true
    voucherStoreProxy.voucher = voucher
  },
  resetVoucher() {
    voucherStoreProxy.voucher = null
  },
  isValidVoucher: false,
})

subscribe(voucherStoreProxy, () => {
  console.log('new voucher', voucherStoreProxy.voucher)
})

const voucherStoreAtom = atomWithProxy(voucherStoreProxy)

export {voucherStoreProxy, voucherStoreAtom}
