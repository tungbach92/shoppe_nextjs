import React from "react";
import {BaseModal} from "@/components/base";
import Link from "next/link";

interface Props {
  isErrorOpen: boolean
}

export default function ErrorModal({isErrorOpen}: Props) {
  return (
    <BaseModal isOpen={isErrorOpen} handleClose={() => {
    }}>
      <div className="cart-product__error-label">Không có sản phẩm.</div>
      <div className="cart-product__modal-footer">
        <Link href="/cart" className="btn cart-product__error-btn">
          OK
        </Link>
      </div>
    </BaseModal>
  )
}
