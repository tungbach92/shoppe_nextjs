import React, {useState} from "react";
import {useFormik} from "formik";
import * as Yup from "yup";
import {voucherStoreProxy} from "@/store/voucherStore.atomProxy";

interface Props {
  toggleVoucher: () => void
}

export default function VoucherModal({toggleVoucher}: Props) {
  const [isVoucherNotifyShowing, setIsVoucherNotifyShowing] = useState(false);

  const formik = useFormik({
    initialValues: {voucherCode: ""},
    validationSchema: Yup.object({
      voucherCode: Yup.string().max(20, "voucher không vượt quá 20 ký tự"),
    }),
    onSubmit: onSubmit,
  });

  function onSubmit({voucherCode}: any) {
    voucherCode = voucherCode.trim();

    if (voucherCode.length > 0) {
      voucherStoreProxy.updateVoucher(voucherCode);
      setIsVoucherNotifyShowing(true);
    }
  }

  const handleBack = () => {
    toggleVoucher();
  };
  return (
    <div className="cart-product__modal">
      <div className="cart-product__modal-overlay"></div>
      <div className="cart-product__modal-container">
        <div className="cart-product__modal-header">
          <span className="cart-product__header-label">
            Chọn Shopee Voucher
          </span>
          <div className="cart-product__header-support">
            <span className="cart-product__support-label">Hỗ Trợ</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="cart-product__support-icon"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6 11C3.23858 11 1 8.76142 1 6C1 3.23858 3.23858 1 6 1C8.76142 1 11 3.23858 11 6C11 8.76142 8.76142 11 6 11ZM5.39088 7.5C5.39745 7.12789 5.44184 6.83396 5.52404 6.6182C5.60625 6.40244 5.77394 6.16323 6.02713 5.90056L6.67324 5.26735C6.94945 4.97029 7.08755 4.65135 7.08755 4.31051C7.08755 3.98217 6.99712 3.72499 6.81628 3.53893C6.63543 3.35288 6.37238 3.25985 6.02713 3.25985C5.69174 3.25985 5.42211 3.34428 5.21825 3.51313C5.01438 3.68199 4.91245 4.19325 4.91245 4.19325H4C4 4.19325 4.19646 3.27783 4.56967 2.9667C4.94287 2.65556 5.42869 2.5 6.02713 2.5C6.64859 2.5 7.13276 2.65869 7.47965 2.97608C7.82655 3.29347 8 3.72889 8 4.28236C8 4.82958 7.73366 5.36898 7.20099 5.90056L6.66338 6.40713C6.42334 6.66041 6.30333 7.0247 6.30333 7.5H5.39088ZM5.15 9.00714C5.15 8.79286 5.21278 8.6131 5.33836 8.46786C5.46393 8.32262 5.65 8.25 5.89658 8.25C6.14315 8.25 6.33036 8.32262 6.45822 8.46786C6.58607 8.6131 6.65 8.79286 6.65 9.00714C6.65 9.22143 6.58607 9.39881 6.45822 9.53929C6.33036 9.67976 6.14315 9.75 5.89658 9.75C5.65 9.75 5.46393 9.67976 5.33836 9.53929C5.21278 9.39881 5.15 9.22143 5.15 9.00714Z"
                fill="black"
                fillOpacity="0.54"
              ></path>
            </svg>
          </div>
        </div>
        <form
          onSubmit={formik.handleSubmit}
          className="cart-product__modal-voucher"
        >
          <label htmlFor="voucherCode" className="cart-product__voucher-text">
            Mã Voucher
          </label>
          <div className="cart-product__input-wrapper">
            {/* {isVoucherNotifyShowing && (
              <span className="cart-product__voucher-notify">
                {isValidVoucher
                  ? "Thành công"
                  : "Rất tiếc! Không thể tìm thấy mã voucher này.Xin vui lòng kiểm tra lại."}
              </span>
            )} */}
            {formik.errors.voucherCode && formik.touched.voucherCode && (
              <span className="cart-product__voucher-notify">
                {formik.errors.voucherCode}
              </span>
            )}
            {!Boolean(formik.errors.voucherCode) && isVoucherNotifyShowing && (
              <span className="cart-product__voucher-notify">
                {voucherStoreProxy.isValidVoucher
                  ? "Thành công"
                  : "Rất tiếc! Không thể tìm thấy mã voucher này.Xin vui lòng kiểm tra lại."}
              </span>
            )}
            <input
              // ref={inputEl}
              id="voucherCode"
              type="text"
              {...formik.getFieldProps("voucherCode")}
              // onKeyUp={handleKeyUp}
              // onFocus={handleFocus}
              className="cart-product__voucher-input"
              placeholder="Mã shoppe Voucher"
            />
          </div>
          <button
            // onClick={handleVoucherApply}
            disabled={!formik.dirty}
            type="submit"
            className="btn cart-product__voucher-btn"
          >
            Áp dụng
          </button>
        </form>

        {/* <ul className="cart-product__voucher-list">
          <li className="cart-product__list-label">
            <span className="cart-product__label-left">
              Mã Miễn Phí Vận Chuyển
            </span>
            <span className="cart-product__label-right">Có thể chọn 1</span>
          </li>
          <li className="cart-product__voucher-item">item</li>
          <li className="cart-product__voucher-item">item</li>
          <li className="cart-product__voucher-item">item</li>
        </ul> */}
        <div className="cart-product__modal-footer">
          <button
            onClick={handleBack}
            className="btn cart-product__modal-apply"
          >
            Trở lại
          </button>
        </div>
      </div>
    </div>
  )
}
