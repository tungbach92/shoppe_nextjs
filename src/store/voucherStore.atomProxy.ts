import {proxy, subscribe} from "valtio/vanilla";
import {atomWithProxy} from "jotai-valtio";

export interface Voucher {
  code: string,
  discount: string
}

export interface VoucherStore {
  voucher: Voucher | null
  updateVoucher: (text: string) => void
  resetVoucher: () => void
  isValidVoucher: boolean
}

export const voucherList = [
  {code: "FREE", discount: "100%"},
  {code: "SALE50", discount: "50%"},
  {code: "SALE100000", discount: "100000"},
];

const voucherStore = proxy<VoucherStore>({
  voucher: null,
  updateVoucher(text: string) {
    const voucher = voucherList.find((item) => item.code === text);
    if (!voucher) {
      voucherStore.isValidVoucher = false;
      return;
    }
    voucherStore.isValidVoucher = true
    voucherStore.voucher = voucher
  },
  resetVoucher() {
    voucherStore.voucher = null
  },
  isValidVoucher: false,
})

subscribe(voucherStore, () => {
  console.log('new count', voucherStore.voucher)
})

const voucherStoreAtom = atomWithProxy(voucherStore)

export {voucherStore, voucherStoreAtom}
