import React, {useEffect, useState} from "react";
import validCardCheck from "card-validator";
import {CardElement, useElements, useStripe} from "@stripe/react-stripe-js";
import {Input} from "@mui/material";
import {updateCustomerIDToFirebase} from "@/services/updateCustomerIDToFirebase";
import {getPaymentMethodList} from "@/services/getPaymentMethodList";
import {useCustomerID} from "@/hooks/useCustomerID";
import useNavigateAndRefreshBlocker from "../../hooks/useNavigateAndRefreshBlocker";
import {checkCardPaymentExist} from "@/services/checkCardPaymentExist";
import {createSetupIntentAndCustomerIDInStripe} from "@/services/createSetupIntentAndCustomerIDInStripe";
import {checkConfirmCardSetupToStripe} from "@/services/checkConfirmCardSetupToStripe";
import {infoDocRef} from "@/common/dbRef";
import useGetUserByObserver from "@/hooks/useGetUserByObserver";
import useGetShipInfos from "@/hooks/useGetShipInfos";
import {getDoc} from "firebase/firestore";
import {BaseModal} from "@/components/base";

// const StyledInput = styled("input", {
//   shouldForwardProp: (props) => props !== "isValid",
// })(({isValid}) => ({
//   borderColor: isValid === false && "red",
// }));

// const StyledCardElement = styled(CardElement, {
//   shouldForwardProp: (props) => props !== "isValid",
// })(({isValid}) => ({
//   borderColor: isValid === false && "red",
//   fontSize: "1.3rem",
// }));

interface CardInfoModalProps {
  paymentMethodList: any
  setPaymentMethodList: any
  setDefaultPaymentMethodID: any
  isCardInfoShowing: boolean
  toggleCardInfo: any
}

export default function CardInfoModal({
                                        paymentMethodList,
                                        setPaymentMethodList,
                                        setDefaultPaymentMethodID,
                                        isCardInfoShowing,
                                        toggleCardInfo,
                                      }: CardInfoModalProps) {
  const stripe = useStripe();
  const elements = useElements();
  const {user} = useGetUserByObserver();
  const {customerID} = useCustomerID(user);
  const {shipInfos} = useGetShipInfos(user);
  const [cardName, setCardName] = useState("");
  const [cardAddress, setCardAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [nameIsValid, setNameIsValid] = useState<boolean | null>(null);
  const [numberIsValid, setNumberIsValid] = useState<|null>(null);
  const [errorNumberMsg, setErrorNumberMsg] = useState("");
  const [errorNameMsg, setErrorNameMsg] = useState("");
  const [addCardLoading, setAddCardLoading] = useState<boolean>(false);

  const handleClick = () => {
    toggleCardInfo(!isCardInfoShowing);
  };

  const handleCardElChange = (e: any) => {
    setNumberIsValid(!e.error && e.complete);
    setErrorNumberMsg(e.error ? e.error.message : "");
  };
  const validateCardName = () => {
    setNameIsValid(true);
    let nameValidation = validCardCheck.cardholderName(cardName);
    if (!cardName) {
      setNameIsValid(false);
      setErrorNameMsg("Vui lòng nhập tên thẻ.");
      return;
    }
    if (nameValidation.isValid) {
      setNameIsValid(true);
      setErrorNameMsg("");
      return;
    }
    setNameIsValid(false);
    setErrorNameMsg(
      "Tên thẻ phải là các ký tự alphabet và có thể chứa các ký hiệu apostrophe('), minus(-) and dot(.)."
    );
  };
  //! validateCardNumber not work because no way to retrieve card number from CardElement
  // const validateCardNumber = () => {
  //   setNumberIsValid(true);
  //   if (cardNuber) {
  //     setNameIsValid(false);
  //     setErrorNumberMsg("Vui lòng nhập số thẻ.");
  //   }
  // }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    validateCardName();
    // validateCardNumber();
    if (!numberIsValid && !errorNumberMsg) {
      setErrorNumberMsg("Vui lòng nhập số thẻ.");
    }
    if (!nameIsValid || !numberIsValid) {
      return;
    }

    setAddCardLoading(true);
    if (!stripe || !elements) {
      setAddCardLoading(false);
      alert("Lỗi lấy dữ liệu từ stripe. Vui lòng thử lại!");
      return;
    }

    //Check card exists
    const cardEl = elements.getElement(CardElement);
    const isCardDuplicate = await checkCardPaymentExist(
      stripe,
      cardEl,
      paymentMethodList
    );
    if (isCardDuplicate) {
      setAddCardLoading(false);
      alert("Thẻ này trùng với thẻ đang được sử dụng!");
      return;
    }

    //Create a setupIntent(plus creat customer), use conirmpaymentIntent to create paymentIntent and continue payment flow
    const {setUpIntentSecret, customerID: newCustomerID} =
      await createSetupIntentAndCustomerIDInStripe(cardName, user, customerID);
    // set and add new customerID to firebase if it's the first time doing purchase
    if (customerID.length === 0) {
      await updateCustomerIDToFirebase(user, newCustomerID);
    }
    if (!setUpIntentSecret) return;

    //When the SetupIntent succeeds
    const result = await checkConfirmCardSetupToStripe(
      stripe,
      shipInfos,
      setUpIntentSecret,
      cardEl,
      cardName,
      user,
      phone
    );
    // The resulting PaymentMethod ID (in result.setupIntent.payment_method) will be saved to the provided Customer.

    if (result.setupIntent && result.setupIntent.status === "succeeded") {
      const paymentMethodList = await getPaymentMethodList(user);
      setPaymentMethodList(paymentMethodList);
      if (paymentMethodList.length === 1) {
        setDefaultPaymentMethodID(paymentMethodList[0].id);
      }
      setAddCardLoading(false);
      toggleCardInfo(!isCardInfoShowing);
      alert("Lưu thông tin thẻ thành công!");
    } else {
      alert(result.error.message);
      setAddCardLoading(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  useNavigateAndRefreshBlocker(addCardLoading);

  useEffect(() => {
    if (user) {
      getDoc(infoDocRef(user?.uid))
        .then((doc) => {
          if (doc.exists()) {
            const phone = doc.data().phone;
            setPhone(phone ? phone : "");
          }
        })
        .catch((err) => alert(err));
    }
  }, [user]);
  return (
    <BaseModal isOpen={isCardInfoShowing} handleClose={toggleCardInfo}>
        <div className="cart-product__modal-header">
          <span className="cart-product__header-label">Thêm thẻ</span>
        </div>
        <div className="cart-product__modal-protect">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="cart-product__protect-icon"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.8918 5.24381C16.8918 5.00972 16.7356 4.85363 16.5016 4.77555L10.3362 3.05857C10.102 2.98048 9.78989 2.98048 9.6338 3.05857L3.46826 4.77555C3.23408 4.85354 3.15599 5.00964 3.07809 5.24379C3.07809 5.25036 3.07588 5.27348 3.07221 5.31193C3.0322 5.73092 2.81832 7.97093 3.39016 10.4729C3.78035 12.1119 4.40477 13.5167 5.3413 14.6871C6.434 16.092 7.91688 17.1066 9.71182 17.731C9.868 17.809 10.0241 17.809 10.2582 17.731C12.0532 17.1068 13.536 16.092 14.6287 14.6871C15.4872 13.5167 16.1896 12.1119 16.5797 10.4729C17.1515 7.97061 16.9377 5.7305 16.8977 5.31184L16.8977 5.31176C16.894 5.27341 16.8918 5.25036 16.8918 5.24381H16.8918ZM15.487 10.2385C14.7065 13.5163 12.8336 15.7017 9.9459 16.6382C7.05825 15.6236 5.1852 13.5163 4.40479 10.2385C3.93651 8.20937 4.0146 6.41441 4.09261 5.63389L9.9459 3.99502L15.7993 5.63389C15.8772 6.41441 15.9553 8.28755 15.487 10.2385L15.487 10.2385ZM7.0582 10.6288L9.00933 12.5017C9.08734 12.5798 9.24351 12.6579 9.39969 12.6579C9.55577 12.6579 9.71176 12.5797 9.78985 12.5017L13.3799 9.14591C13.614 8.91183 13.614 8.59956 13.3799 8.36548C13.1457 8.13131 12.8336 8.13131 12.5993 8.36548L9.3995 11.3311L7.83873 9.84834C7.60456 9.61417 7.29228 9.61417 7.0582 9.84834C6.82403 10.0824 6.82403 10.3947 7.0582 10.6288Z"
              fill="#66CC00"
            ></path>
          </svg>
          <div className="cart-product__protect-label">
            Thông tin thẻ của bạn được bảo mật.
          </div>
          <div className="cart-product__protect-info">
            Chúng tôi hợp tác với Stripe để đảm bảo thông tin thẻ của bạn được
            giữ an toàn và bảo mật. Shopee sẽ không có quyền truy cập vào thông
            tin thẻ của bạn.
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="cart-product__card-info">
            <label className="cart-product__card-label">Chi tiết thẻ</label>
            <Input
              // isValid={nameIsValid}
              onKeyDown={handleKeyDown}
              onChange={(e) => setCardName(e.target.value)}
              onBlur={validateCardName}
              value={cardName}
              type="text"
              name="name"
              className="cart-product__card-name"
              placeholder="Họ tên trên thẻ"
            />
            {errorNameMsg && (
              <label className="cart-product__name-error">{errorNameMsg}</label>
            )}
            <div className="cart-product__number-wrapper">
              <CardElement
                // isValid={numberIsValid}
                onChange={handleCardElChange}
              ></CardElement>
            </div>
            {errorNumberMsg && (
              <label className="cart-product__number-error">
                {errorNumberMsg}
              </label>
            )}
          </div>
          <div className="cart-product__card-address">
            <label className="cart-product__address-label">
              Địa chỉ thanh toán
            </label>
            <input
              onKeyDown={handleKeyDown}
              value={cardAddress}
              onChange={(e) => setCardAddress(e.target.value)}
              type="text"
              name="address"
              className="cart-product__address-text"
              placeholder="Address"
            />
          </div>
          <div className="cart-product__modal-footer">
            <button
              disabled={addCardLoading}
              onClick={handleClick}
              className="btn cart-product__modal-close"
            >
              Trở lại
            </button>
            <button
              disabled={addCardLoading} //fix
              type="submit"
              className="btn cart-product__modal-apply"
            >
              {addCardLoading ? "Xử lý..." : "Xác nhận"}
            </button>
          </div>
        </form>
    </BaseModal>
  )

}
