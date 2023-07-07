import {NumericFormat} from "react-number-format";
import VoucherModal from "@/components/Modal/VoucherModal";
import React from "react";
import {voucherStoreAtom} from "@/store/voucherStore.atomProxy";
import {useAtomValue} from "jotai";

interface Props {
  handleVoucherModal: () => void
  isVoucherShowing: boolean
}

export default function CartVoucher({isVoucherShowing, handleVoucherModal}: Props) {
  const {voucher, resetVoucher} = useAtomValue(voucherStoreAtom)
  return (
    <>
      {voucher && (
        <span className="cart-product__voucher-discount">
                    -
          {voucher.discount.includes("%") ? (
            voucher.discount
          ) : (
            <NumericFormat
              value={voucher.discount}
              thousandSeparator={true}
              displayType="text"
              prefix={"₫"}
            ></NumericFormat>
          )}
                  </span>
      )}
      {voucher && (
        <span
          onClick={() => {
            resetVoucher()
          }}
          className="cart-product__voucher-del"
        >
                    Xóa
                  </span>
      )}
      <div
        onClick={handleVoucherModal}
        className="cart-product__shopee-action"
      >
        {voucher ? "Thay đổi" : "Nhập mã"}
      </div>
      {isVoucherShowing && (
        <VoucherModal
          toggleVoucher={handleVoucherModal}
        ></VoucherModal>
      )}
    </>
  )
}
