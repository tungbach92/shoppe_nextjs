import React, {useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import useModal from "../../hooks/useModal";
import {NumericFormat} from "react-number-format";
import axios from "../../configs/axios";
import {useStripe} from "@stripe/react-stripe-js";
import {db} from "@/configs/firebase";
import "firebase/firestore";
import useAddress from "../../hooks/useAddress";
import AddressModal from "../Modal/AddressModal";
import useGetShipInfos from "../../hooks/useGetShipInfos";
import getCustomerID from "../../services/getCustomerID";
import usePaymentMethodList from "../../hooks/usePaymentMethodList";
import useDefaultPaymentMethodID from "../../hooks/useDefaultPaymentMethodID";
import useGetUserByObserver from "../../hooks/useGetUserByObserver";
import {getCardImgByBrand} from "@/services/getCardImgByBrand";
import {getItemsPriceTotal} from "@/services/getItemsPriceTotal";
import {getVoucherDiscount} from "@/services/getVoucherDiscount";
import useNavigateAndRefreshBlocker from "../../hooks/useNavigateAndRefreshBlocker";
import {useCheckoutContext} from "@/context/CheckoutProvider";
import {updateCustomerBillingAddressStripe} from "@/services/updateCustomerBillingAddressStripe";
import {ClipLoading} from "../ClipLoading";
import {useUpdateDefaultPaymentMethodIDToStripe} from "@/hooks/useUpdateDefaultPaymentMethodIDToStripe";
import {resetCart} from "@/redux/cartSlice";
import {useDispatch} from "react-redux";
import {useAddCartToFireStoreMutation} from "@/services/cartApi";
import withContainer from "../withContainer";
import {checkoutDocRef, orderDocRef, productDocRef} from "@/common/dbRef";
import {runTransaction, setDoc} from "firebase/firestore";
import ErrorModal from "@/components/Modal/ErrorModal";
import {ShipUnitsModal} from "@/components/Modal/ShipUnitsModal";
import VoucherModal from "@/components/Modal/VoucherModal";
import CardInfoModal from "@/components/Modal/CardInfoModal";
import PopupModal from "@/components/Modal/PopupModal";
import Link from "next/link";
import {voucherStoreAtom, voucherStoreProxy} from "@/store/voucherStore.atomProxy";
import {useAtomValue} from "jotai";

interface CheckoutContainerProps {
  isCheckoutPage: boolean
}

interface ShipUnit {
  id: number,
  name: string,
  price: number,
  date: string,
  method: string,
  isDefault?: string
}

function CheckoutContainer({isCheckoutPage}: CheckoutContainerProps) {
  const {voucher} = useAtomValue(voucherStoreAtom)
  const [addCartToFireStore] = useAddCartToFireStoreMutation();
  const dispatch = useDispatch();
  const {updateDefaultPaymentMethodID, updateDefaultPaymentMethodIDLoading} =
    useUpdateDefaultPaymentMethodIDToStripe();
  const {checkoutState, checkoutDispatch} = useCheckoutContext();
  const {checkoutItems, loading} = checkoutState;
  const {
    name,
    setName,
    phone,
    setPhone,
    street,
    setStreet,
    province,
    setProvince,
    district,
    setDistrict,
    ward,
    setWard,
    provinces,
    districts,
    wards,
    handleDistrictChoose,
    handleProvinceChoose,
    handleWardChoose,
  } = useAddress();

  const {
    isPopupShowing,
    togglePopup,
    isVoucherShowing,
    toggleVoucher,
    isShipUnits,
    toggleShipUnits,
    isCardInfoShowing,
    toggleCardInfo,
    isAddressAddShowing,
    toggleAddressAdd,
  } = useModal();

  const {user} = useGetUserByObserver();
  const {defaultPaymentMethodID, setDefaultPaymentMethodID} =
    useDefaultPaymentMethodID(user);
  const {paymentMethodList, setPaymentMethodList} = usePaymentMethodList(
    user,
    setDefaultPaymentMethodID
  );
  const {shipInfos, updateShipInfoToFirebase} = useGetShipInfos(user);
  const stripe = useStripe();
  const [shipUnit, setShipUnit] = useState<ShipUnit | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isShipInfoChoosing, setIsShipInfoChoosing] = useState(false);
  const [isPaymentMethod, setIsPaymentMethod] = useState(false);
  const [shipChecked, setShipChecked] = useState<any[]>([]);
  const [isCardPayment, setIsCardPayment] = useState(false);
  const [isDeliveryPayment, setIsDeliveryPayment] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false)

  const shipPriceProvince = useMemo(() => {
    let shipPrice = [0, 0];
    shipInfos?.forEach((item: any) => {
      if (item.isDefault) {
        shipPrice = item.province.shipPrice;
      }
    });
    return shipPrice;
  }, [shipInfos]);

  const shipUnitList: ShipUnit[] = useMemo(() => {
    return [
      {
        id: 0,
        name: "Giao Hàng Tiết Kiệm",
        price: shipPriceProvince[0],
        date: "4~5 ngày",
        method: "Cho phép Thanh toán khi nhận hàng",
      },
      {
        id: 1,
        name: "JT Express",
        price: shipPriceProvince[1],
        date: "2~3 ngày",
        method: "Cho phép Thanh toán khi nhận hàng",
      },
    ];
  }, [shipPriceProvince]);

  useNavigateAndRefreshBlocker(processing);

  // useEffect(() => {
  //   let shipPrice = [];
  //   shipInfos?.forEach((item) => {
  //     if (item.isDefault) {
  //       shipPrice = item.province.shipPrice;
  //     }
  //   });

  //   setShipPriceProvince(shipPrice);
  // }, [setShipPriceProvince, shipInfos]);
  // useEffect(() => {
  //   const setCheckout = async () => {
  //     setLoading(true);
  //     await setCheckoutItemsFromFirebase();
  //     setLoading(false);
  //   };
  //   setCheckout();
  // }, [setCheckoutItemsFromFirebase]);

  //Get and set province and set districts and district depend on province
  const getShipPrice = (shipUnit: ShipUnit | null) =>
    Number(shipUnit?.price) ? Number(shipUnit?.price) : 0;

  const getItemsPriceFinal = (items: any, shipUnit: ShipUnit | null, voucher: Voucher | null) => {
    return getItemsPriceTotal(items) +
      getShipPrice(shipUnit) -
      getVoucherDiscount(voucher, items);
  };
  const handleChangeShipInfoClick = () => {
    setIsShipInfoChoosing(!isShipInfoChoosing);
  };

  const handleShowCardInfo = () => {
    toggleCardInfo(true);
  };

  const updateSoldAmount = async () => {
    // transaction need to read first and write
    runTransaction(db, (transaction) => {
      // make an docsId (array of doc name) first by checkoutItem.id
      // Promise.all([transaction.get(docsId)])
      // or forEach checkut and run multi transaction
      let promises = checkoutItems.map((checkoutItem: any) => {
        return transaction.get(productDocRef(checkoutItem.id));
      });
      return Promise.all(promises).then((docs) => {
        checkoutItems.forEach((checkoutItem: any) =>
          docs.forEach((doc) => {
            if (!doc.exists) {
              throw new Error("Document does not exist!");
            }
            if (doc.id === checkoutItem.id) {
              const updatedSoldAmount =
                doc.data().soldAmount + Number(checkoutItem.amount);
              transaction.update(productDocRef(checkoutItem.id), {
                soldAmount: updatedSoldAmount,
              });
            }
          })
        );
        // return data;
      });
    })
      .then((data) => {
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const saveOrdersToFirebase = async (id: any, amount: number, created: any) => {
    try {
      let shipInfo = {};
      shipInfos.forEach((item: any) => {
        if (item.isDefault) {
          const {isDefault, province, district, street, ward, ...rest} = item;
          shipInfo = {...rest};
        }
      });
      await setDoc(orderDocRef(user?.uid, id,), {
        basket: checkoutItems,
        amount: amount,
        shipInfo: {...shipInfo},
        created: created,
      });
    } catch (e) {
      console.log(e)
    }
  };

  const saveCheckoutItemsToFirebase = async (checkoutItems: any) => {
    try {
      const created = Date.now();
      user?.uid && await setDoc(checkoutDocRef(user.uid), {
        basket: checkoutItems,
        created: created,
      });
    } catch (error) {
      alert(error);
    }
  };

  const handleOrderSucceeded = async ({id, amount, created}: { id: any, amount: number, created: any }) => {
    try {
      setLoadingOrder(true)
      await saveOrdersToFirebase(id, amount, created);
      await updateSoldAmount();
      await updateCustomerBillingAddressStripe(user, shipInfos);
      dispatch(resetCart);
      checkoutDispatch({});
      addCartToFireStore({user, cartProducts: []});
      await saveCheckoutItemsToFirebase([]);
    } catch (e) {
      console.log(e)
    } finally {
      setSucceeded(true);
      setProcessing(false);
      setLoadingOrder(false)
      togglePopup();
    }
  };

  //Update after edit shipchecked + edit info
  useEffect(() => {
    //set checked, set shipUnit
    let checked: any[] = [];
    const setCheckedAndShipUnit = () => {
      shipUnitList.forEach((item) => {
        if (item.id === shipUnit?.id) {
          checked[item.id] = true;
          setShipUnit(item);
        } else {
          checked[item.id] = false;
        }
      });
      setShipChecked(checked);
    };

    setCheckedAndShipUnit();
  }, [shipUnit, shipUnitList]);

  const handlePaymentMethodSelect = (e: any) => {
    const paymentMethod = e.target.innerText;
    if (paymentMethod === "Thẻ Tín dụng/Ghi nợ") {
      setIsCardPayment(true);
      setIsDeliveryPayment(false);
    } else if (paymentMethod === "Thanh toán khi nhận hàng") {
      setIsDeliveryPayment(true);
      setIsCardPayment(false);
    }
    if (paymentMethod.length > 0) {
      setPaymentMethod(paymentMethod);
    }
  };

  const handlePaymentMethodChange = () => {
    setIsPaymentMethod(!isPaymentMethod);
  };

  const handlePaymentDefaultChange = async (paymentMethodID: any) => {
    const defaultPaymentMethodID = await updateDefaultPaymentMethodID(
      user,
      paymentMethodID
    );
    setDefaultPaymentMethodID(defaultPaymentMethodID);
  };

  const handleShipInfoAddClick = () => {
    toggleAddressAdd();
    setName("");
    setPhone("");
    setStreet("");
    setProvince(null);
    setDistrict(null);
    setWard(null);
  };

  const handleShipInfoDefaultChange = async (e: any) => {
    const index = e.target.value;
    let tempShipInfos = [...shipInfos];
    tempShipInfos = tempShipInfos.map((shipInfo) =>
      tempShipInfos.indexOf(shipInfo) === Number(index)
        ? ({...shipInfo, isDefault: true})
        : ({...shipInfo, isDefault: false})
    );
    await updateShipInfoToFirebase(tempShipInfos);
  };

  const handleShipInfoCancel = () => {
    // getShipInfos();
    setIsShipInfoChoosing(!isShipInfoChoosing);
  };

  const handleShipInfoApply = async () => {
    await updateCustomerBillingAddressStripe(user, shipInfos);
    setIsShipInfoChoosing(!isShipInfoChoosing);
  };

  const handleShipUnitModal = () => {
    toggleShipUnits();
  };

  const handleVoucherModal = () => {
    toggleVoucher();
  };

  const handleOrder = async () => {
    if (
      !isCardInfoShowing && shipUnit && Object.keys(shipUnit).length > 0 &&
      paymentMethod.length > 0
    ) {
      if (isCardPayment && defaultPaymentMethodID.length === 0) {
        togglePopup();
      }

      if (isCardPayment && defaultPaymentMethodID) {
        setProcessing(true);
        let defaultshipInfo: any;
        shipInfos.forEach((item: any) => {
          if (item.isDefault) {
            defaultshipInfo = {...item};
          }
        });
        // Thanh toán off-season vơi thẻ được lưu ( setupIntent PaymentMethod ID)
        const customerID = await getCustomerID(user);
        axios({
          method: "POST",
          url: `/charge-card-off-session?total=${getItemsPriceFinal(
            checkoutItems,
            shipUnit,
            voucher
          )}`,
          data: {
            paymentMethodID: defaultPaymentMethodID,
            customerID,
            email: user.email,
            shipping: {
              // shipping detail when confirm paymentIntent-> charge card
              name: defaultshipInfo?.name,
              phone: defaultshipInfo?.phone,
              address: {
                state: defaultshipInfo?.province.name,
                city: defaultshipInfo?.district.name,
                line1: defaultshipInfo?.ward.name,
                line2: defaultshipInfo?.street,
                country: "VN",
                postal_code: 10000,
              },
            },
          }, // sub currency usd-> cent *100
          // paymentMethodID was choose and set from radio
        }).then((result) => {
          if (
            result.data.error &&
            result.data.error === "authentication_required"
          ) {
            // Card needs to be authenticatied
            // Reuse the card details we have to use confirmCardPayment() to prompt for authentication
            // showAuthenticationView(data);
            alert(
              "Thẻ cần xác thực để thanh toán. Vui lòng nhấn ok và đợi cửa sổ xác thực"
            );
            // Tương đương với sd PPaymentIntents method to confirm paymentIntent

            stripe?.confirmCardPayment(result.data.clientSecret, {
              payment_method: result.data.paymentMethod,
            })
              .then((stripeJsResult) => {
                if (
                  stripeJsResult.error &&
                  stripeJsResult.error.code ===
                  "payment_intent_authentication_failure"
                ) {
                  // Authentication failed -- prompt for a new payment method since this one is failing to authenticate
                  // hideEl(".requires-auth");
                  // showEl(".requires-pm");
                  alert(
                    `Xác thực thẻ ${result.data.card.brand} **** ${result.data.card.last4} thất bại. Vui lòng chọn phương thức thanh toán khác hoặc thử lại.`
                  );
                  setSucceeded(false);
                  setProcessing(false);
                } else if (
                  stripeJsResult.paymentIntent &&
                  stripeJsResult.paymentIntent.status === "succeeded"
                ) {
                  // Order was authenticated and the card was charged
                  // There's a risk your customer will drop-off or close the browser before this callback executes
                  // We recommend handling any business-critical post-payment logic in a webhook
                  // paymentIntentSucceeded(clientSecret, ".requires-auth");
                  handleOrderSucceeded(stripeJsResult.paymentIntent);
                  setProcessing(false);
                }
                // paymentIntent = payment confirmation
                // SetSuccess(true);
                // SetError(null);
                //SetProcessing(false);
                // history.replace("/cart");
                // result.token.card.last4
              });
          } else if (result.data.error) {
            // Card was declined off-session -- ask customer for a new card
            // showEl(".requires-pm");
            alert(
              `${result.data.card?.brand ? result.data.card.brand : null} ${
                result.data.card?.last4
                  ? "****" + result.data.card.last4
                  : "Thẻ"
              } bị từ chối thanh toán hoặc không đủ tiền. Vui lòng sử dụng thẻ khác`
            );
            setSucceeded(false);
            setProcessing(false);
          } else if (result.data.succeeded) {
            // Card was successfully charged off-session
            // No recovery flow needed
            // paymentIntentSucceeded(data.clientSecret, ".sr-select-pm");
            handleOrderSucceeded(result.data.paymentIntent);
            setProcessing(false);
          }
        });
      }

      if (isDeliveryPayment) {
        // payment in delivery
        const paymentIntent = {
          id: `Pi_delivery_${Math.random().toString(36).substring(2)}`,
          amount: getItemsPriceFinal(checkoutItems, shipUnit, voucher),
          created: Math.floor(Date.now() / 1000),
        };
        await handleOrderSucceeded(paymentIntent);
      }
    } else {
      togglePopup();
    }
  };

  const handleVoucherDelete = () => {
    voucherStoreProxy.resetVoucher();
  };

  return (
    <div className="main !grid-cols-1">
      <div className="grid checkout-product">
        <div className="checkout-product__address-line"></div>
        <div className="checkout-product__address-wrapper">
          <div className="checkout-product__address-header">
            <div className="checkout-product__header-wrapper">
              <svg
                height="16"
                viewBox="0 0 12 16"
                width="12"
                className="checkout-product__address-icon"
              >
                <path
                  d="M6 3.2c1.506 0 2.727 1.195 2.727 2.667 0 1.473-1.22 2.666-2.727 2.666S3.273 7.34 3.273 5.867C3.273 4.395 4.493 3.2 6 3.2zM0 6c0-3.315 2.686-6 6-6s6 2.685 6 6c0 2.498-1.964 5.742-6 9.933C1.613 11.743 0 8.498 0 6z"
                  fillRule="evenodd"
                ></path>
              </svg>
              <span className="checkout-product__address-label">
                Địa chỉ nhận hàng
              </span>
            </div>
            {isShipInfoChoosing && (
              <div className="checkout-product__shipInfoBtn-wrapper">
                <button
                  onClick={handleShipInfoAddClick}
                  className="btn checkout-product__shipInfo-add"
                >
                  Thêm địa chỉ mới
                </button>
                <AddressModal
                  name={name}
                  setName={setName}
                  street={street}
                  setStreet={setStreet}
                  district={district}
                  province={province}
                  ward={ward}
                  phone={phone}
                  setPhone={setPhone}
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                  handleDistrictChoose={handleDistrictChoose}
                  handleProvinceChoose={handleProvinceChoose}
                  handleWardChoose={handleWardChoose}
                  isAddressAddShowing={isAddressAddShowing}
                  toggleAddressAdd={toggleAddressAdd}
                ></AddressModal>
                <Link
                  className="btn checkout-product__shipInfo-edit"
                  href={"/account/address"}>
                  Thiết lập địa chỉ
                </Link>
              </div>
            )}
          </div>
          <div className="checkout-product__address-container">
            {isShipInfoChoosing
              ? shipInfos?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="checkout-product__address-content"
                >
                  <input
                    type="radio"
                    id={index.toString()}
                    name="shipInfo"
                    value={index}
                    checked={item.isDefault === true}
                    onChange={handleShipInfoDefaultChange}
                    className="checkout-product__radio-btn"
                  />
                  <span className="checkout-product__user-name">
                      {item.name} {item.phone}
                    </span>
                  <span className="checkout-product__user-address">
                      {item.fullAddress}
                    </span>
                  {item.isDefault && (
                    <span className="checkout-product__default">
                        Mặc định
                      </span>
                  )}
                </div>
              ))
              : shipInfos?.map((item: any, index: number) =>
                item.isDefault && (
                  <div
                    key={index}
                    className="checkout-product__address-content"
                  >
                        <span className="checkout-product__user-name">
                          {item.name} {item.phone}
                        </span>
                    <span className="checkout-product__user-address">
                          {item.fullAddress}
                        </span>
                    <span className="checkout-product__default">
                          Mặc định
                        </span>
                    <span
                        onClick={handleChangeShipInfoClick}
                        className="checkout-product__address-action"
                      >
                          Thay đổi
                        </span>
                    </div>
                  )
              )}
            {isShipInfoChoosing && (
              <div className="checkout-product__btn-wrapper">
                <button
                  onClick={handleShipInfoApply}
                  className="btn checkout-product__address-apply"
                >
                  Hoàn thành
                </button>
                <button
                  onClick={handleShipInfoCancel}
                  className="btn checkout-product__address-cancel"
                >
                  Trở lại
                </button>
              </div>
            )}
            {shipInfos?.length === 0 && (
              <>
                <Link
                  className="checkout-product__address-action"
                  href={"/user/account/address"}>
                  Thêm
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="checkout-product__item-label">
          <span className="checkout-product__product">Sản phẩm</span>
          <span className="checkout-product__price">Đơn giá</span>
          <span className="checkout-product__amount">Số lượng</span>
          <span className="checkout-product__total">Thành tiền</span>
        </div>
        <ul className="checkout-product__item-list">
          {checkoutItems?.map((item: any, index: number) => (
            <div key={index} className="checkout-product-item-wrapper">
              <li className="checkout-product__item">
                <div className="checkout-product__name-wrapper">
                  <img
                    src={item.imageUrl}
                    alt="product__item-img"
                    className="checkout-product__item-img"
                  ></img>
                  <span className="checkout-product__item-name">
                    {item.name}
                  </span>
                  <span className="checkout-product__variation-wrapper">
                    <span className="checkout-product__variation-label">
                      Loại:
                    </span>
                    <span className="checkout-product__variation">
                      {item.variation}
                    </span>
                  </span>
                </div>
                <span className="checkout-product__item-price">
                  <NumericFormat
                    value={item.price}
                    thousandSeparator={true}
                    displayType="text"
                    prefix={"₫"}
                  ></NumericFormat>
                </span>
                <span className="checkout-product__item-amount">
                  {item.amount}
                </span>
                <span className="checkout-product__item-total">
                  <NumericFormat
                    value={item.price * item.amount}
                    thousandSeparator={true}
                    displayType="text"
                    prefix={"₫"}
                  ></NumericFormat>
                </span>
              </li>
              <div className="checkout-product__addition">
                <span className="checkout-product__second-addition">
                  <span className="checkout-product__price-label">
                    Tổng số tiền ({item.amount} sản phẩm):
                  </span>
                  <span className="checkout-product__additon-price">
                    <NumericFormat
                      value={item.price * item.amount}
                      thousandSeparator={true}
                      displayType="text"
                      prefix={"₫"}
                    ></NumericFormat>
                  </span>
                </span>
              </div>
            </div>
          ))}
          {loading && <ClipLoading></ClipLoading>}
          <ErrorModal isErrorOpen={checkoutItems?.length === 0 && !loading}></ErrorModal>
        </ul>
        <div className="checkout-product__first-addition">
          <span className="checkout-product__message-wrapper">
            {/* <span className="checkout-product__message-label">Lời nhắn:</span>
            <input
              ref={inputMessageEl}
              onBlur={handleInputBlur}
              onKeyUp={handleInputEnter}
              type="text"
              placeholder="Lưu ý cho người bán..."
              className="checkout-product__message-input"
            /> */}
          </span>
          <span className="checkout-product__transport-wrapper">
            <span className="checkout-product__transport-label">
              Đơn vị vận chuyển:
            </span>

            {shipUnit && Object.keys(shipUnit).length === 0 ? (
              <span className="checkout-product__transport-notchoose">
                Chưa chọn đơn vị vận chuyển
              </span>
            ) : (
              <span className="checkout-product__transport-info">
                <span className="checkout-product__transport-name">
                  {shipUnit?.name}
                </span>
                <span className="checkout-product__transport-date">
                  {shipUnit?.date}
                </span>
                <span className="checkout-product__transport-method">
                  {shipUnit?.method}
                </span>
              </span>
            )}
            {shipInfos?.length > 0 && (
              <span
                onClick={handleShipUnitModal}
                className="checkout-product__transport-action"
              >
                {shipUnit && Object.keys(shipUnit).length <= 0 ? "Chọn" : "Thay đổi"}
              </span>
            )}

            <ShipUnitsModal
              isOpen={isShipUnits}
              handleClose={toggleShipUnits}
              isShipUnits={isShipUnits}
              toggleShipUnits={toggleShipUnits}
              shipUnit={shipUnit}
              shipUnitList={shipUnitList}
              setShipUnit={setShipUnit}
              shipChecked={shipChecked}
              setShipChecked={setShipChecked}
            ></ShipUnitsModal>
            {shipUnit && Object.keys(shipUnit).length > 0 && (
              <span className="checkout-product__transport-price">
                <NumericFormat
                  value={shipUnit.price}
                  thousandSeparator={true}
                  displayType="text"
                  prefix={"₫"}
                ></NumericFormat>
              </span>
            )}
          </span>
        </div>
        <div className="checkout-product__checkout-wrapper">
          <div className="checkout-product__voucher-wrapper">
            {voucher ? (
              <svg
                fill="none"
                viewBox="0 0 23 22"
                className="checkout-product__voucher-icon--selected"
              >
                <rect
                  x="13"
                  y="9"
                  width="10"
                  height="10"
                  rx="5"
                  fill="#EE4D2D"
                ></rect>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20.881 11.775a.54.54 0 00-.78.019l-2.509 2.765-1.116-1.033a.542.542 0 00-.74.793l1.5 1.414a.552.552 0 00.844-.106l2.82-3.109a.54.54 0 00-.019-.743z"
                  fill="#fff"
                ></path>
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.488 16.178h.858V14.57h-.858v1.607zM6.488 13.177h.858v-1.605h-.858v1.605zM6.488 10.178h.858V8.572h-.858v1.606zM6.488 7.178h.858V5.572h-.858v1.606z"
                  fill="#EE4D2D"
                ></path>
                <g filter="url(#voucher-filter1_d)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1 4v2.325a1.5 1.5 0 01.407 2.487l-.013.012c-.117.103-.25.188-.394.251v.65c.145.063.277.149.394.252l.013.012a1.496 1.496 0 010 2.223l-.013.012c-.117.103-.25.188-.394.251v.65c.145.063.277.149.394.252l.013.012A1.5 1.5 0 011 15.876V18h12.528a6.018 6.018 0 01-.725-1H2v-.58c.55-.457.9-1.147.9-1.92a2.49 2.49 0 00-.667-1.7 2.49 2.49 0 00.667-1.7 2.49 2.49 0 00-.667-1.7A2.49 2.49 0 002.9 7.7c0-.773-.35-1.463-.9-1.92V5h16v.78a2.494 2.494 0 00-.874 2.283 6.05 6.05 0 011.004-.062A1.505 1.505 0 0119 6.325V4H1z"
                    fill="#EE4D3D"
                  ></path>
                </g>
                <defs>
                  <filter
                    id="voucher-filter1_d"
                    x="0"
                    y="3"
                    width="20"
                    height="16"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood
                      floodOpacity="0"
                      result="BackgroundImageFix"
                    ></feFlood>
                    <feColorMatrix
                      in="SourceAlpha"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    ></feColorMatrix>
                    <feOffset></feOffset>
                    <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"></feColorMatrix>
                    <feBlend
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow"
                    ></feBlend>
                    <feBlend
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      result="shape"
                    ></feBlend>
                  </filter>
                </defs>
              </svg>
            ) : (
              <svg
                fill="none"
                viewBox="0 -2 23 22"
                className="checkout-product__voucher-icon"
              >
                <g filter="url(#voucher-filter0_d)">
                  <mask id="a" fill="#fff">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M1 2h18v2.32a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75v.65a1.5 1.5 0 000 2.75V16H1v-2.12a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75v-.65a1.5 1.5 0 000-2.75V2z"
                    ></path>
                  </mask>
                  <path
                    d="M19 2h1V1h-1v1zM1 2V1H0v1h1zm18 2.32l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zm0 .65l.4.92.6-.26v-.66h-1zm0 2.75h1v-.65l-.6-.26-.4.91zM19 16v1h1v-1h-1zM1 16H0v1h1v-1zm0-2.12l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zm0-.65l-.4-.92-.6.26v.66h1zm0-2.75H0v.65l.6.26.4-.91zM19 1H1v2h18V1zm1 3.32V2h-2v2.32h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zm.6 1.56v-.65h-2v.65h2zm-.9 1.38c0-.2.12-.38.3-.46l-.8-1.83a2.5 2.5 0 00-1.5 2.29h2zm.3.46a.5.5 0 01-.3-.46h-2c0 1.03.62 1.9 1.5 2.3l.8-1.84zM20 16v-2.13h-2V16h2zM1 17h18v-2H1v2zm-1-3.12V16h2v-2.12H0zm1.4.91a2.5 2.5 0 001.5-2.29h-2a.5.5 0 01-.3.46l.8 1.83zm1.5-2.29a2.5 2.5 0 00-1.5-2.3l-.8 1.84c.18.08.3.26.3.46h2zM0 10.48v.65h2v-.65H0zM.9 9.1a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 9.1h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 8.65zM0 7.08v.65h2v-.65H0zM.9 5.7a.5.5 0 01-.3.46l.8 1.83A2.5 2.5 0 002.9 5.7h-2zm-.3-.46c.18.08.3.26.3.46h2a2.5 2.5 0 00-1.5-2.3L.6 5.25zM0 2v2.33h2V2H0z"
                    mask="url(#a)"
                  ></path>
                </g>
                <path
                  clipRule="evenodd"
                  d="M6.49 14.18h.86v-1.6h-.86v1.6zM6.49 11.18h.86v-1.6h-.86v1.6zM6.49 8.18h.86v-1.6h-.86v1.6zM6.49 5.18h.86v-1.6h-.86v1.6z"
                ></path>
                <defs>
                  <filter
                    id="voucher-filter0_d"
                    x="0"
                    y="1"
                    width="20"
                    height="16"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood
                      floodOpacity="0"
                      result="BackgroundImageFix"
                    ></feFlood>
                    <feColorMatrix
                      in="SourceAlpha"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    ></feColorMatrix>
                    <feOffset></feOffset>
                    <feGaussianBlur stdDeviation=".5"></feGaussianBlur>
                    <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"></feColorMatrix>
                    <feBlend
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow"
                    ></feBlend>
                    <feBlend
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      result="shape"
                    ></feBlend>
                  </filter>
                </defs>
              </svg>
            )}

            <span className="checkout-product__voucher-label">
              Shopee Voucher
            </span>
            {voucher && (
              <span className="checkout-product__voucher-discount">
                -{voucher.discount}
              </span>
            )}
            {voucher && (
              <span
                onClick={handleVoucherDelete}
                className="checkout-product__voucher-del"
              >
                Xóa
              </span>
            )}
            <span
              onClick={handleVoucherModal}
              className="checkout-product__voucher-action"
            >
              {voucher ? "Thay đổi" : "Nhập mã"}
            </span>
            {isVoucherShowing && (
              <VoucherModal
                toggleVoucher={toggleVoucher}
              ></VoucherModal>
            )}
          </div>
          <div className="checkout-product__method-wrapper">
            <span className="checkout-product__method-label">
              Phương thức thanh toán
            </span>
            {isPaymentMethod && (
              <>
                <button
                  onClick={handlePaymentMethodSelect}
                  className={classNames(
                    "btn",
                    "checkout-product__method-card",
                    {"checkout-product__method--selected": isCardPayment}
                  )}
                >
                  Thẻ Tín dụng/Ghi nợ
                </button>

                <button
                  onClick={handlePaymentMethodSelect}
                  className={classNames(
                    "btn",
                    "checkout-product__method-Immediatepay",
                    {
                      "checkout-product__method--selected": isDeliveryPayment,
                    }
                  )}
                >
                  Thanh toán khi nhận hàng
                </button>
              </>
            )}

            {!isPaymentMethod && (
              <>
                <span className="checkout-product__method">
                  {paymentMethod}
                </span>
                <span
                  onClick={handlePaymentMethodChange}
                  className="checkout-product__method-action"
                >
                  Chọn
                </span>
              </>
            )}
          </div>
          <div className="checkout-product__notify-wrapper">
            <div className="checkout-product__method-notify">
              <span className="checkout-product__notify-label">
                {isCardPayment ? "Chọn thẻ" : ""}
                {isDeliveryPayment ? "Thanh toán khi nhận hàng" : ""}
              </span>
              {isCardPayment && (
                <div className="checkout-product__card-list">
                  {paymentMethodList?.length > 0 &&
                    paymentMethodList.map((item: any, index) => (
                      <div key={index} className="checkout-product__card-item">
                        <input
                          type="radio"
                          id={index.toString()}
                          name="payment"
                          value={index}
                          checked={item.id === defaultPaymentMethodID}
                          onChange={() => handlePaymentDefaultChange(item.id)}
                          className="checkout-product__radio-card"
                          disabled={updateDefaultPaymentMethodIDLoading}
                        />
                        <img
                          src={getCardImgByBrand(item.card.brand)} //if cardInfo.number => img
                          alt="card"
                          className="checkout-product__card-img"
                        ></img>
                        <span className="checkout-product__card-type">
                          {item.card.brand}
                        </span>
                        <span
                          onClick={handleShowCardInfo}
                          className="checkout-product__card-numb"
                        >
                          **** {item.card.last4}
                        </span>
                      </div>
                    ))}
                  <button
                    onClick={handleShowCardInfo}
                    className="btn checkout-product__add-item"
                  >
                    <svg
                      enableBackground="new 0 0 10 10"
                      viewBox="0 0 10 10"
                      className="checkout-product__add-icon"
                    >
                      <path
                        stroke="none"
                        d="m10 4.5h-4.5v-4.5h-1v4.5h-4.5v1h4.5v4.5h1v-4.5h4.5z"
                      ></path>
                    </svg>
                    Thêm thẻ
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
              )}
              {isDeliveryPayment && (
                <span className="checkout-product__immediatepay-notify">
                  Phí thu hộ: ₫0 VNĐ. Ưu đãi về phí vận chuyển (nếu có) áp dụng
                  cả với phí thu hộ.
                </span>
              )}
            </div>
            {/* {isCardPayment && (
              <div className="checkout-product__promo-item">
                <div className="checkout-product__promo-cimb">
                  <span className="checkout-product__cimb-discount">
                    15% Giảm
                  </span>
                  <span className="checkout-product__cimb-detail">
                    Giảm 15% tối đa 150k đơn từ 800k mỗi thứ 2-4
                  </span>
                  <img
                    src={cimbImg}
                    alt="cimb"
                    className="checkout-product__cimb-img"
                  />
                </div>
                <div className="checkout-product__promo-jcb">
                  <span className="checkout-product__jcb-discount">
                    30% Giảm
                  </span>
                  <span className="checkout-product__jcb-detail">
                    Ưu đãi CIMB mỗi thứ 2 hàng tuần
                  </span>
                  <img
                    src={mbImg}
                    alt="mb"
                    className="checkout-product__mb-img"
                  />
                </div>
              </div>
            )} */}
          </div>
          <div className="checkout-product__calc-wrapper">
            <span className="checkout-product__payment-label">
              Tổng tiền hàng:
            </span>
            <span className="checkout-product__payment">
              <NumericFormat
                value={getItemsPriceTotal(checkoutItems)}
                thousandSeparator={true}
                displayType="text"
              ></NumericFormat>
            </span>
            <span className="checkout-product__ship-label">
              Tổng phí vận chuyển:
            </span>
            <span className="checkout-product__ship">
              <NumericFormat
                value={getShipPrice(shipUnit)}
                thousandSeparator={true}
                displayType="text"
              ></NumericFormat>
            </span>
            <span className="checkout-product__discount-label">Tiết kiệm:</span>
            <span className="checkout-product__discount">
              <NumericFormat
                value={getVoucherDiscount(voucher, checkoutItems)}
                thousandSeparator={true}
                displayType="text"
              ></NumericFormat>
            </span>
            <span className="checkout-product__final-label">
              Tổng thanh toán:
            </span>
            <span className="checkout-product__final">
              <NumericFormat
                value={getItemsPriceFinal(checkoutItems, shipUnit, voucher)}
                prefix={"₫"}
                thousandSeparator={true}
                displayType="text"
              ></NumericFormat>
            </span>
          </div>
          <div className="checkout-product__order-wrapper">
            <span className="checkout-product__order-notice">
              Nhấn Đặt hàng đồng nghĩa với việc bạn đồng ý tuân theo
            </span>
            <span className="checkout-product__order-policy">
              Điều khoản Shopee
            </span>
            <button
              disabled={processing || loadingOrder}
              onClick={handleOrder}
              className="btn checkout-product__order-btn"
            >
              {processing || loadingOrder ? "Đang xử lý" : " Đặt hàng"}
            </button>
            {isPopupShowing && (
              <PopupModal
                isPopupShowing={isPopupShowing}
                togglePopup={togglePopup}
                shipUnit={shipUnit}
                shipInfos={shipInfos}
                paymentMethod={paymentMethod}
                isCardPayment={isCardPayment}
                defaultPaymentMethodID={defaultPaymentMethodID}
                succeeded={succeeded}
                isCheckoutPage={isCheckoutPage}
              ></PopupModal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withContainer(CheckoutContainer, true);
