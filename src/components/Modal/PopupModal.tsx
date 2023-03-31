import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {BaseModal} from "@/components/base";
import {useRouter} from "next/router";

export default function PopupModal(props: any) {
  const router = useRouter()
  const [title, setTitle] = useState("");
  const [isBackBtnHidden, setIsBackBtnHidden] = useState(false);

  const {
    isCheckoutPage,
    isAccountPage,
    isUserUpdateFailed,
    isImageUploadFailed,
    isUpdateEmailSuccess,
    isUpdatePasswordSuccess,
    handleDeleteTrue,
    shipInfoIndex,
    setShipInfoIndex,
    shipInfos,
    defaultPaymentMethodID,
    paymentMethodID,
    setPaymentMethodID,
    handlePaymentDeleteTrue,
    isCartPage,
    deleteID,
    setDeleteID,
    isDeleteSelected,
    setIsDeleteSelected,
    handleDeleteSelectionTrue,
    handleDeleteCartTrue,
    isVariationChoose,
    checked,
    shipUnit,
    isPopupShowing,
    togglePopup,
    paymentMethod,
    isCardPayment,
    succeeded,
  } = props;

  useEffect(() => {
    const setTitleAndBackBtnHidden = () => {
      let isBackBtnHidden = false;
      let title = "";

      if (isAccountPage && isUpdateEmailSuccess) {
        isBackBtnHidden = true;
        title = "Cập nhật địa chỉ email thành công";
      }
      if (isAccountPage && isUpdatePasswordSuccess) {
        isBackBtnHidden = true;
        title = "Cập nhật mật khẩu thành công";
      }
      if (isAccountPage && !isUserUpdateFailed && !isImageUploadFailed) {
        isBackBtnHidden = true;
        title = "Cập nhật thông tin người dùng thành công";
      }
      if (isAccountPage && isUserUpdateFailed && isImageUploadFailed) {
        isBackBtnHidden = true;
        title =
          "Có lỗi xảy ra khi cập nhật thông tin và tải ảnh người dùng lên hệ thống.";
      }
      if (isAccountPage && isUserUpdateFailed) {
        isBackBtnHidden = true;
        title = "Có lỗi xảy ra khi cập nhật thông tin người dùng lên hệ thống.";
      }
      if (isAccountPage && isImageUploadFailed) {
        isBackBtnHidden = true;
        title = "Có lỗi xảy ra khi tải ảnh người dùng lên hệ thống";
      }
      if (isAccountPage && shipInfoIndex !== null) {
        isBackBtnHidden = false;
        title = "Bạn chắc chắn muốn xóa địa chỉ này ?";
      }
      if (isAccountPage && paymentMethodID.length > 0) {
        isBackBtnHidden = false;
        title = "Bạn chắc chắn muốn xóa thẻ này ?";
      }

      if (isCartPage && (deleteID !== null || isDeleteSelected)) {
        isBackBtnHidden = false;
        title = "Bạn chắc chắn muốn xóa (các) sản phẩm này khỏi giỏ hàng ?";
      } else if (isCartPage && checked?.length === 0) {
        isBackBtnHidden = true;
        title = "Bạn vẫn chưa chọn sản phẩm nào để mua.";
      } else if (isCartPage && isVariationChoose === false) {
        isBackBtnHidden = true;
        title = "Bạn vẫn chưa chọn loại hay kích cỡ sản phẩm để mua.";
      }

      if (isCheckoutPage && shipInfos?.length <= 0) {
        isBackBtnHidden = true;
        title = "Bạn vẫn chưa nhập địa chỉ nhận hàng.";
      } else if (isCheckoutPage && !Object.keys(shipUnit)?.length) {
        isBackBtnHidden = true;
        title = "Vui lòng chọn đơn vị vận chuyển.";
      } else if (isCheckoutPage && paymentMethod?.length === 0) {
        isBackBtnHidden = true;
        title = "Vui lòng chọn phương thức thanh toán.";
      } else if (
        isCheckoutPage &&
        isCardPayment &&
        defaultPaymentMethodID.length === 0
      ) {
        isBackBtnHidden = true;
        title = "Vui lòng thêm thông tin Thẻ Tín dụng/Ghi nợ ";
      } else if (isCheckoutPage && succeeded) {
        isBackBtnHidden = true;
        title = "Đặt hàng thành công";
      } else if (isCheckoutPage && !succeeded) {
        isBackBtnHidden = true;
        title = "Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ tổng đài";
      }
      setTitle(title);
      setIsBackBtnHidden(isBackBtnHidden);
    };
    setTitleAndBackBtnHidden();
  }, [
    checked?.length,
    defaultPaymentMethodID,
    deleteID,
    isAccountPage,
    isCardPayment,
    isCartPage,
    isCheckoutPage,
    isDeleteSelected,
    isImageUploadFailed,
    isUpdateEmailSuccess,
    isUpdatePasswordSuccess,
    isUserUpdateFailed,
    isVariationChoose,
    paymentMethod?.length,
    paymentMethodID,
    shipInfoIndex,
    shipInfos?.length,
    shipUnit,
    succeeded,
  ]);

  //Back button
  const handleBackClick = () => {
    togglePopup(false);

    // set those values to defaultm undefined if setState function true
    if (setDeleteID) {
      setDeleteID(null);
    }
    if (setPaymentMethodID) {
      setPaymentMethodID(null);
    }
    if (setShipInfoIndex) {
      setShipInfoIndex(null);
    }
    if (setIsDeleteSelected) {
      setIsDeleteSelected(false);
    }
  };

  // Ok button
  const handleApplyClick = () => {
    togglePopup(!isPopupShowing);
    if (isCheckoutPage && shipInfos?.length <= 0) {
      window.scrollTo({top: 0, left: 0, behavior: "smooth"});
    }
    if (isCheckoutPage && !Object.keys(shipUnit)?.length) {
      window.scrollTo({top: 300, left: 0, behavior: "smooth"});
    }
    if (isCheckoutPage && defaultPaymentMethodID.length === 0) {
      window.scrollTo({top: 700, left: 0, behavior: "smooth"});
    }
    if (isCheckoutPage && paymentMethod?.length === 0) {
      window.scrollTo({top: 600, left: 0, behavior: "smooth"});
    }
    if (isCheckoutPage && succeeded) {
      router.push("/user/account/purchase");
    }

    if (isAccountPage && shipInfoIndex === null && !paymentMethodID) {
      router.push("/user");
    }
    if (isAccountPage && shipInfoIndex !== null) {
      handleDeleteTrue(shipInfoIndex);
      setShipInfoIndex();
    }
    if (isAccountPage && paymentMethodID) {
      handlePaymentDeleteTrue(paymentMethodID);
      setPaymentMethodID();
    }

    if (isCartPage && deleteID) {
      handleDeleteCartTrue();
      setDeleteID();
    }
    if (isCartPage && isDeleteSelected) {
      handleDeleteSelectionTrue();
      setIsDeleteSelected(false);
    }
  };
  return (
    <BaseModal isOpen={isPopupShowing} handleClose={togglePopup}>
      <span className="cart-product__popup-label">{title}</span>
      {!isBackBtnHidden && (
        <button
          className="btn cart-product__popup-cancle"
          onClick={handleBackClick}
        >
          Back
        </button>
      )}

      <button
        onClick={handleApplyClick}
        className="btn cart-product__popup-apply"
      >
        OK
      </button>
      {/*<div className="cart-product__modal-container">*/}
      {/*  <div className="cart-product__modal-header">*/}
      {/*    <span className="cart-product__popup-label">{title}</span>*/}
      {/*  </div>*/}
      {/*  <div className="cart-product__popup-footer">*/}
      {/*    {!isBackBtnHidden && (*/}
      {/*      <button*/}
      {/*        className="btn cart-product__popup-cancle"*/}
      {/*        onClick={handleBackClick}*/}
      {/*      >*/}
      {/*        Back*/}
      {/*      </button>*/}
      {/*    )}*/}

      {/*    <button*/}
      {/*      onClick={handleApplyClick}*/}
      {/*      className="btn cart-product__popup-apply"*/}
      {/*    >*/}
      {/*      OK*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</div>*/}
        </BaseModal>

        // <div className="cart-product__modal">
        //   <div className="cart-product__modal-overlay"></div>
        //   <div className="cart-product__modal-container">
        //     <div className="cart-product__modal-header">
        //       <span className="cart-product__popup-label">{title}</span>
        //     </div>
        //     <div className="cart-product__popup-footer">
        //       {!isBackBtnHidden && (
        //         <button
        //           className="btn cart-product__popup-cancle"
        //           onClick={handleBackClick}
        //         >
        //           Back
        //         </button>
        //       )}
        //
        //       <button
        //         onClick={handleApplyClick}
        //         className="btn cart-product__popup-apply"
        //       >
        //         OK
        //       </button>
        //     </div>
        //   </div>
        // </div>
        )
      }

PopupModal.propTypes = {
  isAccountPage: PropTypes.bool,
  isUserUpdateFailed: PropTypes.bool,
  isImageUploadFailed: PropTypes.bool,
  isUpdateEmailSuccess: PropTypes.bool,
  isUpdatePasswordSuccess: PropTypes.bool,
  handleDeleteTrue: PropTypes.func,
  shipInfoIndex: PropTypes.number,
  setShipInfoIndex: PropTypes.func,
  paymentMethodID: PropTypes.string,
  setPaymentMethodID: PropTypes.func,
  handlePaymentDeleteTrue: PropTypes.func,
  isCartPage: PropTypes.bool,
  deleteID: PropTypes.string,
  setDeleteID: PropTypes.func,
  isDeleteSelected: PropTypes.bool,
  setIsDeleteSelected: PropTypes.func,
  handleDeleteSelectionTrue: PropTypes.func,
  handleDeleteCartTrue: PropTypes.func,
  isVariationChoose: PropTypes.bool,
  checked: PropTypes.arrayOf(PropTypes.object),
  shipUnit: PropTypes.object,
  isPopupShowing: PropTypes.bool.isRequired,
  togglePopup: PropTypes.func.isRequired,
  paymentMethod: PropTypes.string,
  defaultPaymentMethodID: PropTypes.string,
  isCardPayment: PropTypes.bool,
  succeeded: PropTypes.bool,
  shipInfos: PropTypes.arrayOf(PropTypes.object),
};

PopupModal.defaultProps = {
  isAccountPage: false,
  isUserUpdateFailed: false,
  isImageUploadFailed: false,
  isUpdateEmailSuccess: false,
  isUpdatePasswordSuccess: false,
  handleDeleteTrue: () => {
  },
  shipInfoIndex: null,
  setShipInfoIndex: () => {
  },
  paymentMethodID: "",
  setPaymentMethodID: () => {
  },
  handlePaymentDeleteTrue: () => {
  },
  isCartPage: false,
  deleteID: null,
  setDeleteID: () => {
  },
  isDeleteSelected: false,
  setIsDeleteSelected: () => {
  },
  handleDeleteSelectionTrue: () => {
  },
  handleDeleteCartTrue: () => {
  },
  isVariationChoose: false,
  checked: [],
  shipUnit: {},
  paymentMethod: "",
  defaultPaymentMethodID: undefined,
  isCardPayment: false,
  succeeded: false,
  shipInfos: null,
};
