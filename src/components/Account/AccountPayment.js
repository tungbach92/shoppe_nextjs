import React, {useState} from "react";
import useModal from "../../hooks/useModal";
import PopupModal from "../Modal/PopupModal";
import CardInfoModal from "../Modal/CardInfoModal";
import usePaymentMethodList from "../../hooks/usePaymentMethodList";
import useDefaultPaymentMethodID from "../../hooks/useDefaultPaymentMethodID";
import {getCardImgByBrand} from "@/services/getCardImgByBrand";
import {detachPaymentMethodID} from "@/services/detachPaymentMethodID";
import {useUser} from "@/context/UserProvider";
import getCustomerID from "../../services/getCustomerID";
import useNavigateAndRefreshBlocker from "../../hooks/useNavigateAndRefreshBlocker";
import {ClipLoading} from "../ClipLoading";
import {useUpdateDefaultPaymentMethodIDToStripe} from "@/hooks/useUpdateDefaultPaymentMethodIDToStripe";
import {useMediaQuery} from "@mui/material";

const AccountPayment = () => {
  const {user} = useUser();
  const {defaultPaymentMethodID, setDefaultPaymentMethodID} =
    useDefaultPaymentMethodID(user);
  const {
    paymentMethodList,
    deletePaymentMethod,
    setPaymentMethodList,
    paymentMethodListLoading,
  } = usePaymentMethodList(user, setDefaultPaymentMethodID);
  const {updateDefaultPaymentMethodID, updateDefaultPaymentMethodIDLoading} =
    useUpdateDefaultPaymentMethodIDToStripe();
  const [paymentMethodID, setPaymentMethodID] = useState();
  const [deletePaymentLoading, setDeletePaymentLoading] = useState(false);
  const {isPopupShowing, togglePopup, isCardInfoShowing, toggleCardInfo} =
    useModal();
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");


  useNavigateAndRefreshBlocker(
    deletePaymentLoading || updateDefaultPaymentMethodIDLoading
  );

  const handleAddCardClick = () => {
    toggleCardInfo(!isCardInfoShowing);
  };

  const handlePaymentDeleteClick = (id) => {
    setPaymentMethodID(id);
    togglePopup();
  };

  const handlePaymentDeleteTrue = async (id) => {
    setDeletePaymentLoading(true);
    const customerID = await getCustomerID(user);
    const paymentMethod = await detachPaymentMethodID(customerID, id);
    setDeletePaymentLoading(false);
    deletePaymentMethod(paymentMethod.id);
  };

  const handleDefaultClick = async (paymentMethodID) => {
    if (paymentMethodID === defaultPaymentMethodID) {
      return;
    }
    const updatedDefaultPaymentMethodID = await updateDefaultPaymentMethodID(
      user,
      paymentMethodID
    );
    setDefaultPaymentMethodID(updatedDefaultPaymentMethodID);
  };
  return (
    <>
      <div className="user-profile__title-container">
        <div className="user-profile__title">
          <div className={`user-profile__label ${xsBreakpointMatches && 'flex-col'}`}>
            Thẻ Tín Dụng/Ghi Nợ
            <button
              onClick={handleAddCardClick}
              className="btn user-profile__card-add w-full md:w-auto"
            >
              Thêm thẻ mới
            </button>
            {isCardInfoShowing && (
              <CardInfoModal
                paymentMethodList={paymentMethodList}
                setPaymentMethodList={setPaymentMethodList}
                setDefaultPaymentMethodID={setDefaultPaymentMethodID}
                isCardInfoShowing={isCardInfoShowing}
                toggleCardInfo={toggleCardInfo}
              ></CardInfoModal>
            )}
          </div>
        </div>
      </div>
      <div className="payment-profile__payment-container">
        {paymentMethodListLoading ? (
          <ClipLoading></ClipLoading>
        ) : paymentMethodList.length === 0 && !paymentMethodListLoading ? (
          <div className="payment-profile__payment-empty">
            Bạn chưa liên kết thẻ
          </div>
        ) : (
          paymentMethodList.map((item, index) => (
            <div key={index} className="payment-profile__payment-content">
              <img
                src={getCardImgByBrand(item.card.brand)}
                alt="card-brand"
                className="payment-profile__card-logo"
              />
              <div className="payment-profile__card-name hidden md:block">
                {item.card.brand}
              </div>
              {item.id === defaultPaymentMethodID && (
                <div className="payment-profile__card-default">Mặc định</div>
              )}
              <div className="payment-profile__card-spacer"></div>
              <div className="payment-profile__card-number">
                **** **** **** {item.card.last4}
              </div>
              <div className="payment-profile__btn-container">
                {item.id !== defaultPaymentMethodID &&
                  !updateDefaultPaymentMethodIDLoading &&
                  !deletePaymentLoading && (
                    <div
                      onClick={() => handlePaymentDeleteClick(item.id)}
                      className="payment-profile__card-delete"
                    >
                      Xóa
                    </div>
                  )}

                {isPopupShowing && (
                  <PopupModal
                    isAccountPage={true}
                    isPopupShowing={isPopupShowing}
                    togglePopup={togglePopup}
                    paymentMethodID={paymentMethodID}
                    setPaymentMethodID={setPaymentMethodID}
                    handlePaymentDeleteTrue={handlePaymentDeleteTrue}
                  ></PopupModal>
                )}
                <button
                  disabled={
                    item.id === defaultPaymentMethodID ||
                    updateDefaultPaymentMethodIDLoading ||
                    deletePaymentLoading
                  }
                  onClick={() => handleDefaultClick(item.id)}
                  className="btn payment-profile__default-btn w-full md:w-auto"
                >
                  Thiết lập mặc định
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default AccountPayment;
