import {NumericFormat} from "react-number-format";
import VoucherModal from "@/components/Modal/VoucherModal";
import React from "react";
import useModal from "@/hooks/useModal";

interface Props {
  voucher: any
  handleVoucherDelete: () => void
  handleVoucherModal: () => void
}

export default function CartVoucher({voucher, handleVoucherDelete, handleVoucherModal}: Props) {
  const {
    isVoucherShowing,
    toggleVoucher,
  } = useModal();
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
          onClick={handleVoucherDelete}
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
          isVoucherShowing={isVoucherShowing}
          toggleVoucher={toggleVoucher}
        ></VoucherModal>
      )}
    </>
  )
}
