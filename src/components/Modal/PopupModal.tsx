import React, {useEffect, useState} from "react";
import {BaseModal} from "@/components/base";
import {useRouter} from "next/router";

interface Props {
  isCheckoutPage?: boolean,
  isAccountPage?: boolean,
  isCartPage?: boolean,
  isUserUpdateFailed?: boolean,
  isImageUploadFailed?: boolean,
  isUpdateEmailSuccess?: boolean,
  isUpdatePasswordSuccess?: boolean,
  handleDeleteTrue?: (arg: number) => void,
  shipInfoIndex?: number | null,
  setShipInfoIndex?: (arg: number | null) => void,
  paymentMethodID?: string,
  setPaymentMethodID?: (arg: string | null) => void,
  handlePaymentDeleteTrue?: () => void,
  deleteID?: string,
  setDeleteID?: (arg: string) => void,
  isDeleteSelected?: boolean,
  setIsDeleteSelected?: (arg: boolean) => void,
  handleDeleteSelectionTrue?: () => void,
  handleDeleteCartTrue?: () => void,
  isVariationChoose?: boolean,
  checked?: any[],
  shipUnit?: any,
  paymentMethod?: string,
  defaultPaymentMethodID?: string,
  isCardPayment?: boolean,
  succeeded?: boolean,
  shipInfos?: any[],
  togglePopup: () => void,
  isPopupShowing: boolean,
}

export default function PopupModal(props: Props) {
  const router = useRouter()
  const [title, setTitle] = useState("");
  const [isBackBtnHidden, setIsBackBtnHidden] = useState(false);

  const {
    isCheckoutPage = false,
    isAccountPage = false,
    isUserUpdateFailed = false,
    isImageUploadFailed = false,
    isUpdateEmailSuccess = false,
    isUpdatePasswordSuccess = false,
    handleDeleteTrue = () => {
    },
    shipInfoIndex = null,
    setShipInfoIndex = () => {
    },
    shipInfos = [],
    defaultPaymentMethodID = '',
    paymentMethodID = '',
    setPaymentMethodID = () => {
    },
    handlePaymentDeleteTrue = (arg: string) => {
    },
    isCartPage = false,
    deleteID = '',
    setDeleteID = () => {
    },
    isDeleteSelected = false,
    setIsDeleteSelected = () => {
    },
    handleDeleteSelectionTrue = () => {
    },
    handleDeleteCartTrue = () => {
    },
    isVariationChoose = false,
    checked = [],
    shipUnit = {},
    isPopupShowing,
    togglePopup,
    paymentMethod = '',
    isCardPayment = false,
    succeeded = false,
  }
    = props;

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
      if (isAccountPage && paymentMethodID?.length > 0) {
        isBackBtnHidden = false;
        title = "Bạn chắc chắn muốn xóa thẻ này ?";
      }

      if (isCartPage && (deleteID || isDeleteSelected)) {
        isBackBtnHidden = false;
        title = "Bạn chắc chắn muốn xóa (các) sản phẩm này khỏi giỏ hàng ?";
      } else if (isCartPage && checked?.length === 0) {
        isBackBtnHidden = true;
        title = "Bạn vẫn chưa chọn sản phẩm nào để mua.";
      } else if (isCartPage && !isVariationChoose) {
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
    togglePopup();

    // set those values to defaultm undefined if setState function true
    if (setDeleteID) {
      setDeleteID('');
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
    togglePopup();
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
      router.push("/account/purchase");
    }

    if (isAccountPage && shipInfoIndex === null && !paymentMethodID) {
      router.push("/account");
    }
    if (isAccountPage && shipInfoIndex !== null) {
      handleDeleteTrue(shipInfoIndex);
      setShipInfoIndex(null);
    }
    if (isAccountPage && paymentMethodID) {
      handlePaymentDeleteTrue(paymentMethodID);
      setPaymentMethodID(null);
    }

    if (isCartPage && deleteID) {
      handleDeleteCartTrue();
      setDeleteID('');
    }
    if (isCartPage && isDeleteSelected) {
      handleDeleteSelectionTrue();
      setIsDeleteSelected(false);
    }
  };
  return (
    <BaseModal isOpen={isPopupShowing} handleClose={togglePopup} className={`gap-8`}>
      <span className="cart-product__popup-label">{title}</span>
      <div className={`flex`}>
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
      </div>
    </BaseModal>
  )
}
