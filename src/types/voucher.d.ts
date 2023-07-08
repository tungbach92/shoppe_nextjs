interface Voucher {
  code: string,
  discount: string
}

interface VoucherStore {
  voucher: Voucher | null
  updateVoucher: (text: string) => void
  resetVoucher: () => void
  isValidVoucher: boolean
}
