import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import useModal from "../../hooks/useModal";
import VoucherModal from "../Modal/VoucherModal";
import noCartImg from "../../../public/img/no-cart.png";
import AddCartModal from "../Modal/AddCartModal";
import PopupModal from "../../components/Modal/PopupModal";
import { NumericFormat } from "react-number-format";
import Grid2 from "@mui/material/Unstable_Grid2";
import { getItemsPriceTotal } from "../../services/getItemsPriceTotal";
import { getVoucherDiscount } from "../../services/getVoucherDiscount";
import { useCheckoutContext } from "../../context/CheckoutProvider";
import { CHECKOUT_ACTIONTYPES } from "../../constants/actionType";
import { ClipLoading } from "../ClipLoading";
import { useUser } from "../../context/UserProvider";
import { useSelector } from "react-redux";
import {
  deleteProducts,
  deleteSelectedProducts,
  updateProducts,
} from "../../redux/cartSlice";
import { useDispatch } from "react-redux";
import {
  useAddCartToFireStoreMutation,
  useFetchCartQuery,
} from "../../services/cartApi";
import useVoucher from "../../hooks/useVoucher";
import withContainer from "../withContainer";

function CartContainer() {
  const { user } = useUser();
  const { voucher, resetVoucher } = useVoucher();
  const { isLoading: cartItemsLoading } = useFetchCartQuery(user);
  const cartProducts = useSelector((state) => state.cart.products);
  const [addCartToFireStore] = useAddCartToFireStoreMutation();
  const dispatch = useDispatch();
  const { checkoutDispatch } = useCheckoutContext();
  const [variation, setVariation] = useState("");
  const [isVariationChoose, setIsVariationChoose] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [deleteVariation, setDeleteVariation] = useState();
  const [isDeleteSelected, setIsDeleteSelected] = useState(false);
  const [selectedIdVariation, setSelectedIdVariation] = useState([]);
  const selectedProduct = useMemo(() => {
    return cartProducts.filter((item) =>
      selectedIdVariation.some(
        (e) => e.id === item.id && e.variation === item.variation
      )
    );
  }, [cartProducts, selectedIdVariation]);

  const {
    isVoucherShowing,
    toggleVoucher,
    isAddCartPopup,
    toggleIsAddCardPopup,
    isPopupShowing,
    togglePopup,
  } = useModal();

  // scrollToTop
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   if (location.state) {
  //     toggleIsAddCardPopup(true);
  //   }
  //   navigate(location.pathname, { replace: true });
  // }, [toggleIsAddCardPopup, location.state, location.pathname, navigate]);

  useEffect(() => {
    if (selectedProduct.length > 0) {
      const isVariationChoose = selectedProduct.every(
        (item) => item.variation?.length > 0 || item.variationList.length === 0
      );
      setIsVariationChoose(isVariationChoose);
    }
  }, [selectedProduct]);

  const getItemsTotal = (items) => {
    const result = items?.reduce(
      (checkoutItemTotal, item) => checkoutItemTotal + item.amount,
      0
    );
    return result ? result : 0;
  };

  const handleVariationClick = (event) => {
    const variation = event.currentTarget.innerText;
    setVariation(variation);
  };

  const handleVariationBack = (variation, id) => {
    setVariation("");
    changeVariationDisPlayCartItems(variation, id);
  };

  const handleVariationApply = (variation, id) => {
    changeCartItemsVariation(variation, id);
  };
  const handleCheckout = async (event) => {
    if (selectedProduct?.length === 0 || isVariationChoose === false) {
      event.preventDefault();
      togglePopup(!isPopupShowing);
    } else {
      const checkoutItems = selectedProduct.map((selectedEle) => {
        // return checkedItem without uneccessary field
        const { similarDisPlay, variationDisPlay, ...rest } = selectedEle;
        return rest;
      });
      checkoutDispatch({
        type: CHECKOUT_ACTIONTYPES.ADD_CHECKOUT,
        payload: checkoutItems,
      });
      addCartToFireStore({ user, cartProducts });
      // navigate("/checkout");
    }
  };

  const delCartItems = () => {
    const newCartProducts = cartProducts.filter((item) =>
      selectedIdVariation.every(
        (e) => e.id !== item.id || e.variation !== item.variation
      )
    );
    dispatch(deleteSelectedProducts(newCartProducts));
    // if (newCartItems.length === 0) {
    //   await saveCartItemsToFirebase(newCartItems);
    // }
  };

  const handleDelete = (id, variation) => {
    setDeleteID(id);
    setDeleteVariation(variation);
    togglePopup(!isPopupShowing);
  };

  const handleDeleteCartTrue = () => {
    dispatch(deleteProducts({ id: deleteID, variation: deleteVariation }));
    const newCheckedId = selectedIdVariation.filter(
      (e) => e.id !== deleteID || e.variation !== deleteVariation
    );
    setSelectedIdVariation(newCheckedId);
  };

  const handleDeleteSelection = () => {
    if (selectedIdVariation?.length > 0) {
      setIsDeleteSelected(true);
      togglePopup(!isPopupShowing);
    }
  };

  const handleDeleteSelectionTrue = () => {
    delCartItems();
    setSelectedIdVariation([]);
  };

  const changeAmountCartItem = (id, variation, amount) => {
    const newCartProducts = [...cartProducts];
    const indexOfItem = newCartProducts.findIndex(
      (item) => item.id === id && item.variation === variation
    );
    newCartProducts[indexOfItem] = {
      ...newCartProducts[indexOfItem],
      amount,
    };
    dispatch(updateProducts(newCartProducts));
  };

  const incrCartItem = (id, variation) => {
    const newCartProducts = [...cartProducts];
    const indexOfItem = newCartProducts.findIndex(
      (item) => item.id === id && item.variation === variation
    );
    newCartProducts[indexOfItem] = {
      ...newCartProducts[indexOfItem],
      amount: newCartProducts[indexOfItem].amount + 1,
    };
    dispatch(updateProducts(newCartProducts));
  };

  const decrCartItem = (id, variation) => {
    const newCartProducts = [...cartProducts];
    const indexOfItem = newCartProducts.findIndex(
      (item) => item.id === id && item.variation === variation
    );
    if (newCartProducts[indexOfItem].amount > 1) {
      newCartProducts[indexOfItem] = {
        ...newCartProducts[indexOfItem],
        amount: newCartProducts[indexOfItem].amount - 1,
      };
      dispatch(updateProducts(newCartProducts));
    }
  };

  const changeVariationDisPlayCartItems = (variation, id) => {
    const newCartProducts = cartProducts.map((item) =>
      item.id === id && item.variation === variation
        ? { ...item, variationDisPlay: !item.variationDisPlay }
        : item
    );
    dispatch(updateProducts(newCartProducts));
  };

  const changeCartItemsVariation = (oldVariation, id) => {
    const newCartProducts = cartProducts.map((item) =>
      item.id === id && item.variation === oldVariation
        ? {
            ...item,
            variation: variation,
            variationDisPlay: !item.variationDisPlay,
          }
        : item
    );
    dispatch(updateProducts(newCartProducts));
    const newCheckedId = selectedIdVariation.map((item) =>
      item.id === id ? { ...item, variation } : item
    );
    setSelectedIdVariation(newCheckedId);
  };

  const handlePopup = (variation, id) => {
    changeVariationDisPlayCartItems(variation, id);
    setVariation(variation);
  };

  const handleVoucherModal = (e) => {
    toggleVoucher(!isVoucherShowing);
  };

  const handleVoucherDelete = () => {
    resetVoucher();
  };

  const handleCheck = (item) => {
    if (isCheck(item)) {
      const newCheckedId = selectedIdVariation.filter(
        (e) => e.id !== item.id || e.variation !== item.variation
      );
      setSelectedIdVariation(newCheckedId);
      return;
    }
    setSelectedIdVariation([
      ...selectedIdVariation,
      { id: item.id, variation: item.variation },
    ]);
  };

  const isCheck = (item) => {
    const result = selectedIdVariation.some(
      (e) => e.id === item.id && e.variation === item.variation
    );
    return result;
  };

  const isCheckAll = () => {
    const result = selectedIdVariation?.length === cartProducts?.length;
    return result;
  };

  const handleCheckAll = () => {
    if (isCheckAll()) {
      setSelectedIdVariation([]);
    } else {
      const newCheckedId = cartProducts.map((e) => {
        return { id: e.id, variation: e.variation };
      });
      setSelectedIdVariation(newCheckedId);
    }
  };

  const isIDVariationExist = (id, variation) => {
    const result = cartProducts.some(
      (item) => item.variation === variation && item.id === id
    );
    return result;
  };

  return (
    <div className="main">
      {cartProducts.length > 0 && (
        <Grid2 container maxWidth="100%" width="120rem" m="0 auto">
          <Grid2
            sm={12}
            sx={{
              padding: "1.6rem 0",
              backgroundColor: "#f5f5f5",
            }}
          >
            <div className="cart-product__notify">
              <svg
                height="12"
                viewBox="0 0 20 12"
                width="20"
                className="app__free-ship-icon"
              >
                <g fill="none" fillRule="evenodd" transform="">
                  <rect
                    fill="#00bfa5"
                    fillRule="evenodd"
                    height="9"
                    rx="1"
                    width="12"
                    x="4"
                  ></rect>
                  <rect
                    height="8"
                    rx="1"
                    stroke="#00bfa5"
                    width="11"
                    x="4.5"
                    y=".5"
                  ></rect>
                  <rect
                    fill="#00bfa5"
                    fillRule="evenodd"
                    height="7"
                    rx="1"
                    width="7"
                    x="13"
                    y="2"
                  ></rect>
                  <rect
                    height="6"
                    rx="1"
                    stroke="#00bfa5"
                    width="6"
                    x="13.5"
                    y="2.5"
                  ></rect>
                  <circle cx="8" cy="10" fill="#00bfa5" r="2"></circle>
                  <circle cx="15" cy="10" fill="#00bfa5" r="2"></circle>
                  <path
                    d="m6.7082481 6.7999878h-.7082481v-4.2275391h2.8488017v.5976563h-2.1405536v1.2978515h1.9603297v.5800782h-1.9603297zm2.6762505 0v-3.1904297h.6544972v.4892578h.0505892c.0980164-.3134765.4774351-.5419922.9264138-.5419922.0980165 0 .2276512.0087891.3003731.0263672v.6210938c-.053751-.0175782-.2624312-.038086-.3762568-.038086-.5122152 0-.8758247.3017578-.8758247.75v1.8837891zm3.608988-2.7158203c-.5027297 0-.8536919.328125-.8916338.8261719h1.7390022c-.0158092-.5009766-.3446386-.8261719-.8473684-.8261719zm.8442065 1.8544922h.6544972c-.1549293.571289-.7050863.9228515-1.49238.9228515-.9864885 0-1.5903965-.6269531-1.5903965-1.6464843 0-1.0195313.6165553-1.6669922 1.5872347-1.6669922.9580321 0 1.5366455.6064453 1.5366455 1.6083984v.2197266h-2.4314412v.0351562c.0221328.5595703.373095.9140625.9169284.9140625.4110369 0 .6924391-.1376953.8189119-.3867187zm2.6224996-1.8544922c-.5027297 0-.853692.328125-.8916339.8261719h1.7390022c-.0158091-.5009766-.3446386-.8261719-.8473683-.8261719zm.8442064 1.8544922h.6544972c-.1549293.571289-.7050863.9228515-1.49238.9228515-.9864885 0-1.5903965-.6269531-1.5903965-1.6464843 0-1.0195313.6165553-1.6669922 1.5872347-1.6669922.9580321 0 1.5366455.6064453 1.5366455 1.6083984v.2197266h-2.4314412v.0351562c.0221328.5595703.373095.9140625.9169284.9140625.4110369 0 .6924391-.1376953.8189119-.3867187z"
                    fill="#fff"
                  ></path>
                  <path d="m .5 8.5h3.5v1h-3.5z" fill="#00bfa5"></path>
                  <path d="m0 10.15674h3.5v1h-3.5z" fill="#00bfa5"></path>
                  <circle cx="8" cy="10" fill="#047565" r="1"></circle>
                  <circle cx="15" cy="10" fill="#047565" r="1"></circle>
                </g>
              </svg>
              <span className="cart-product__text">
                {/* Nhấn vào mục Mã giảm giá ở cuối trang để hưởng miễn phí vận chuyển
              bạn nhé! */}
                Nhấn vào mục nhập mã shopee voucher để nhập mã giảm giá
              </span>
            </div>
            <div className="cart-product__header">
              <input
                name="all"
                onChange={handleCheckAll}
                checked={isCheckAll()}
                type="checkbox"
                className="grid__col cart-product__checkbox"
              />
              <div className="grid__col cart-product__product">Sản Phẩm</div>
              <div className="grid__col cart-product__price">Đơn Giá</div>
              <div className="grid__col cart-product__amount">Số Lượng</div>
              <div className="grid__col cart-product__header-total">
                Số Tiền
              </div>
              <div className="grid__col cart-product__action">Thao Tác</div>
            </div>
            {/* <div className="cart-shop">
              <input
                type="checkbox"
                onChange={selectOne}
                className="grid__col cart-shop__checkbox"
              />
              <div className="grid__col cart-shop__name">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="62"
                  height="16"
                  fill="none"
                  className="cart-shop__name-icon"
                >
                  <path
                    fill="#EE4D2D"
                    fillRule="evenodd"
                    d="M0 2C0 .9.9 0 2 0h58a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V2z"
                    clipRule="evenodd"
                  ></path>
                  <g clipPath="url(#clip0)">
                    <path
                      fill="#fff"
                      d="M8.7 13H7V8.7L5.6 6.3A828.9 828.9 0 004 4h2l2 3.3a1197.3 1197.3 0 002-3.3h1.6L8.7 8.7V13zm7.9-1.7h1.7c0 .3-.2.6-.5 1-.2.3-.5.5-1 .7l-.6.2h-.8c-.5 0-1 0-1.5-.2l-1-.8a4 4 0 01-.9-2.4c0-1 .3-1.9 1-2.6a3 3 0 012.4-1l.8.1a2.8 2.8 0 011.3.7l.4.6.3.8V10h-4.6l.2 1 .4.7.6.5.7.1c.4 0 .7 0 .9-.2l.2-.6v-.1zm0-2.3l-.1-1-.3-.3c0-.2-.1-.2-.2-.3l-.8-.2c-.3 0-.6.2-.9.5l-.3.5a4 4 0 00-.3.8h3zm-1.4-4.2l-.7.7h-1.4l1.5-2h1.1l1.5 2h-1.4l-.6-.7zm8.1 1.6H25V13h-1.7v-.5.1H23l-.7.5-.9.1-1-.1-.7-.4c-.3-.2-.4-.5-.6-.8l-.2-1.3V6.4h1.7v3.7c0 1 0 1.6.3 1.7.2.2.5.3.7.3h.4l.4-.2.3-.3.3-.5.2-1.4V6.4zM34.7 13a11.2 11.2 0 01-1.5.2 3.4 3.4 0 01-1.3-.2 2 2 0 01-.5-.3l-.3-.5-.2-.6V7.4h-1.2v-1h1.1V5h1.7v1.5h1.9v1h-2v3l.2 1.2.1.3.2.2h.3l.2.1c.2 0 .6 0 1.3-.3v1zm2.4 0h-1.7V3.5h1.7v3.4a3.7 3.7 0 01.2-.1 2.8 2.8 0 013.4 0l.4.4.2.7V13h-1.6V9.3 8.1l-.4-.6-.6-.2a1 1 0 00-.4.1 2 2 0 00-.4.2l-.3.3a3 3 0 00-.3.5l-.1.5-.1.9V13zm5.4-6.6H44V13h-1.6V6.4zm-.8-.9l1.8-2h1.8l-2.1 2h-1.5zm7.7 5.8H51v.5l-.4.5a2 2 0 01-.4.4l-.6.3-1.4.2c-.5 0-1 0-1.4-.2l-1-.7c-.3-.3-.5-.7-.6-1.2-.2-.4-.3-.9-.3-1.4 0-.5.1-1 .3-1.4a2.6 2.6 0 011.6-1.8c.4-.2.9-.3 1.4-.3.6 0 1 .1 1.5.3.4.1.7.4 1 .6l.2.5.1.5h-1.6c0-.3-.1-.5-.3-.6-.2-.2-.4-.3-.8-.3s-.8.2-1.2.6c-.3.4-.4 1-.4 2 0 .9.1 1.5.4 1.8.4.4.8.6 1.2.6h.5l.3-.2.2-.3v-.4zm4 1.7h-1.6V3.5h1.7v3.4a3.7 3.7 0 01.2-.1 2.8 2.8 0 013.4 0l.3.4.3.7V13h-1.6V9.3L56 8.1c-.1-.3-.2-.5-.4-.6l-.6-.2a1 1 0 00-.3.1 2 2 0 00-.4.2l-.3.3a3 3 0 00-.3.5l-.2.5V13z"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <path
                        fill="#fff"
                        d="M0 0h55v16H0z"
                        transform="translate(4)"
                      ></path>
                    </clipPath>
                  </defs>
                </svg>
                <span className="cart-shop-text">Bảo Hà Shop</span>
                <span className="cart-shop__chat">
                  <svg viewBox="0 0 16 16" className="cart-shop__chat-icon ">
                    <g fillRule="evenodd">
                      <path d="M15 4a1 1 0 01.993.883L16 5v9.932a.5.5 0 01-.82.385l-2.061-1.718-8.199.001a1 1 0 01-.98-.8l-.016-.117-.108-1.284 8.058.001a2 2 0 001.976-1.692l.018-.155L14.293 4H15zm-2.48-4a1 1 0 011 1l-.003.077-.646 8.4a1 1 0 01-.997.923l-8.994-.001-2.06 1.718a.5.5 0 01-.233.108l-.087.007a.5.5 0 01-.492-.41L0 11.732V1a1 1 0 011-1h11.52zM3.646 4.246a.5.5 0 000 .708c.305.304.694.526 1.146.682A4.936 4.936 0 006.4 5.9c.464 0 1.02-.062 1.608-.264.452-.156.841-.378 1.146-.682a.5.5 0 10-.708-.708c-.185.186-.445.335-.764.444a4.004 4.004 0 01-2.564 0c-.319-.11-.579-.258-.764-.444a.5.5 0 00-.708 0z"></path>
                    </g>
                  </svg>
                </span>
              </div>
            </div> */}
            {cartProducts.map((item) => (
              <div key={item.id} className="cart-product__item">
                <input
                  type="checkbox"
                  checked={isCheck(item)}
                  onChange={() => handleCheck(item)}
                  className="grid__col cart-product__checkbox"
                />
                {/*<Link*/}
                {/*  to={{*/}
                {/*    pathname: `/product/${item.metaTitle}/${item.id}`,*/}
                {/*    state: { id: item.id },*/}
                {/*  }}*/}
                {/*  className="grid__col cart-product__overview"*/}
                {/*>*/}
                {/*  <img*/}
                {/*    src={item.imageUrl}*/}
                {/*    alt=""*/}
                {/*    className="cart-product__img"*/}
                {/*  />*/}
                {/*  <span className="cart-product__name">{item.name}</span>*/}
                {/*</Link>*/}
                <div
                  data-name="variation"
                  onClick={handlePopup.bind(this, item.variation, item.id)}
                  className="grid__col cart-product__variation"
                >
                  <span className="cart-product__variation-label">
                    Phân Loại Hàng:
                    <span
                      href="# "
                      className={classNames("cart-product__variation-icon", {
                        "cart-product__variation-icon--rotate":
                          item.variationDisPlay,
                      })}
                    ></span>
                  </span>
                  <span className="cart-product__variation-numb">
                    {item.variation}
                  </span>
                </div>
                {item.variationDisPlay && (
                  <div className="cart-product__variation-notify">
                    <div className="cart-product__arrow-outer">
                      <div className="cart-product__notify-arrow"></div>
                    </div>
                    <div className="cart-product__notify-content">
                      <div className="cart-product__notify-label">Kích cỡ:</div>
                      <div className="cart-product__variation-container">
                        {item.variationList.length === 0 && "Không có"}
                        {item.variationList?.map((listItem, i) => (
                          <div
                            onClick={
                              !isIDVariationExist(item.id, listItem) ||
                              item.variation === listItem
                                ? handleVariationClick
                                : undefined
                            }
                            key={i}
                            className={
                              variation === listItem
                                ? "cart-product__notify-variation cart-product__notify-variation--active"
                                : isIDVariationExist(item.id, listItem) &&
                                  !(item.variation === listItem)
                                ? "cart-product__notify-variation cart-product__notify-variation--deactive"
                                : "cart-product__notify-variation"
                            }
                          >
                            {listItem}
                            {variation === listItem && (
                              <div className="cart-product__variation-tick">
                                <svg
                                  enableBackground="new 0 0 12 12"
                                  viewBox="0 0 12 12"
                                  x="0"
                                  y="0"
                                  className="cart-product__tick-icon"
                                >
                                  <g>
                                    <path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
                                  </g>
                                </svg>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="cart-product__notify-button">
                      <button
                        onClick={handleVariationBack.bind(
                          this,
                          item.variation,
                          item.id
                        )}
                        className="btn cart-product__notify-back"
                      >
                        Trở Lại
                      </button>
                      {item.variationList.length > 0 && (
                        <button
                          onClick={() =>
                            handleVariationApply(item.variation, item.id)
                          }
                          className="btn cart-product__notify-ok"
                        >
                          Xác nhận
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <div className="grid__col cart-product__price">
                  {/* cart-product__price-item--before  */}
                  {/* cart-product__price-item--after  */}
                  {/* <span className="cart-product__price-item cart-product__price-item--before">
                  {item.price}
                </span> */}
                  <span className="cart-product__price-item">
                    <NumericFormat
                      value={item.price}
                      thousandSeparator={true}
                      displayType="text"
                      prefix={"₫"}
                    ></NumericFormat>
                  </span>
                </div>
                <div className="grid__col cart-product__amount">
                  <div className="cart-product__amount-wrapper">
                    <button
                      onClick={() => {
                        decrCartItem(item.id, item.variation);
                      }}
                      href="# "
                      className="btn cart-product__amount-desc"
                    >
                      -
                    </button>
                    <input
                      data-id={item.id}
                      data-name="inputAmount"
                      data-variation={item.variation}
                      type="text"
                      className="cart-product__amount-numb"
                      value={item.amount}
                      onChange={(e) => {
                        e.target.value = e.target.value
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*)\./g, "$1");
                        const value = Number(e.target.value);
                        if (value > 0) {
                          changeAmountCartItem(item.id, item.variation, value);
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        incrCartItem(item.id, item.variation);
                      }}
                      href="# "
                      className="btn cart-product__amount-incr"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="grid__col cart-product__total">
                  <NumericFormat
                    value={item.price * item.amount}
                    thousandSeparator={true}
                    displayType="text"
                    prefix={"₫"}
                  ></NumericFormat>
                </div>
                <div className="grid__col cart-product__action">
                  <span
                    onClick={() => handleDelete(item.id, item.variation)}
                    className="cart-product__action-del"
                  >
                    Xóa
                  </span>
                  {/* <span
                    data-name="similar"
                    onClick={handlePopup.bind(this, index)}
                    className={classNames("cart-product__action-find", {
                      "cart-product__action-find--border":
                        cartItems[index].similarDisPlay,
                    })}
                  >
                    <span className="cart-product__action-label">
                      Tìm sản phẩm tương tự:
                    </span>
                    <span
                      className={classNames("cart-product__action-icon", {
                        "cart-product__action-icon--rotate":
                          cartItems[index].similarDisPlay,
                      })}
                    ></span>
                  </span>
                  {cartItems[index].similarDisPlay && (
                    <div className="grid cart-product__similar-list">
                      <ProductList
                        items={cartItems}

                      ></ProductList>
                      <Pagination
                      ></Pagination>
                    </div>
                  )} */}
                </div>
              </div>
            ))}

            {/* <div className="cart-product__voucher">
            <svg
              fill="none"
              viewBox="0 -2 23 22"
              className="grid__col cart-product__voucher-icon"
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
            <span className="grid__col cart-product__voucher-label">
              Thêm mã giảm giá của Shop
            </span>
          </div> */}
            {/* <div className="cart-product__shipping">
            <svg
              enableBackground="new 0 0 15 15"
              viewBox="0 0 15 15"
              x="0"
              y="0"
              className="grid__col cart-product__shipping-icon"
            >
              <g>
                <line
                  fill="none"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                  x1="8.6"
                  x2="4.2"
                  y1="9.8"
                  y2="9.8"
                ></line>
                <circle
                  cx="3"
                  cy="11.2"
                  fill="none"
                  r="2"
                  strokeMiterlimit="10"
                ></circle>
                <circle
                  cx="10"
                  cy="11.2"
                  fill="none"
                  r="2"
                  strokeMiterlimit="10"
                ></circle>
                <line
                  fill="none"
                  strokeMiterlimit="10"
                  x1="10.5"
                  x2="14.4"
                  y1="7.3"
                  y2="7.3"
                ></line>
                <polyline
                  fill="none"
                  points="1.5 9.8 .5 9.8 .5 1.8 10 1.8 10 9.1"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                ></polyline>
                <polyline
                  fill="none"
                  points="9.9 3.8 14 3.8 14.5 10.2 11.9 10.2"
                  strokeLinejoin="round"
                  strokeMiterlimit="10"
                ></polyline>
              </g>
            </svg>
            <span className="grid__col cart-product__shipping-label">
              Miễn Phí Vận Chuyển cho đơn hàng từ ₫50.000 (giảm tối đa ₫25.000);
              Miễn Phí Vận Chuyển cho đơn hàng từ ₫300.000 (giảm tối đa ₫70.000)
            </span>
            <span className="grid__col cart-product__shipping-more">
              Tìm hiểu thêm
            </span>
          </div> */}
            <div className="cart-product__footer">
              <div className="cart-product__anonymous-shopee"></div>
              <div className="cart-product__shopee-wrapper">
                <div className="cart-product__icon-wrapper">
                  <svg
                    fill="none"
                    viewBox="0 -2 23 22"
                    className="cart-product__shoppe-icon"
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
                  <span className="cart-product__shoppe-label">
                    Shopee Voucher
                  </span>
                </div>
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
              </div>
              {/* <div className="cart-product__checkbox-wrapper">
              <input type="checkbox" className="cart-product__coin-checkbox" />
            </div>
            <div className="cart-product__coin-wrapper">
              <svg
                fill="none"
                viewBox="0 0 18 18"
                className="cart-product__coin-icon"
              >
                <path
                  stroke="#FFA600"
                  strokeWidth="1.3"
                  d="M17.35 9A8.35 8.35 0 11.65 9a8.35 8.35 0 0116.7 0z"
                ></path>
                <path
                  fill="#FFA600"
                  fillRule="evenodd"
                  stroke="#FFA600"
                  strokeWidth=".2"
                  d="M6.86 4.723c-.683.576-.998 1.627-.75 2.464.215.725.85 1.258 1.522 1.608.37.193.77.355 1.177.463.1.027.2.051.3.08.098.03.196.062.294.096.06.021.121.044.182.067.017.006.107.041.04.014-.07-.028.071.03.087.037.286.124.56.27.82.44.114.076.045.024.151.111a2.942 2.942 0 01.322.303c.087.093.046.042.114.146.18.275.245.478.235.8-.01.328-.14.659-.325.867-.47.53-1.232.73-1.934.696a4.727 4.727 0 01-1.487-.307c-.45-.182-.852-.462-1.242-.737-.25-.176-.643-.04-.788.197-.17.279-.044.574.207.75.753.532 1.539.946 2.474 1.098.885.144 1.731.124 2.563-.224.78-.326 1.416-.966 1.607-1.772.198-.838-.023-1.644-.61-2.29-.683-.753-1.722-1.17-2.706-1.43a4.563 4.563 0 01-.543-.183c.122.048-.044-.02-.078-.035a4.77 4.77 0 01-.422-.212c-.594-.338-.955-.722-.872-1.369.105-.816.757-1.221 1.555-1.28.808-.06 1.648.135 2.297.554.614.398 1.19-.553.58-.947-1.33-.86-3.504-1.074-4.77-.005z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="cart-product__coin-label">Shopee Xu</span>
              <span className="cart-product__coin-notify">
                Bạn chưa có Shopee Xu
              </span>
              <svg
                enableBackground="new 0 0 15 15"
                viewBox="0 0 15 15"
                x="0"
                y="0"
                className="cart-product__notify-icon"
              >
                <g>
                  <circle
                    cx="7.5"
                    cy="7.5"
                    fill="none"
                    r="6.5"
                    strokeMiterlimit="10"
                  ></circle>
                  <path
                    d="m5.3 5.3c.1-.3.3-.6.5-.8s.4-.4.7-.5.6-.2 1-.2c.3 0 .6 0 .9.1s.5.2.7.4.4.4.5.7.2.6.2.9c0 .2 0 .4-.1.6s-.1.3-.2.5c-.1.1-.2.2-.3.3-.1.2-.2.3-.4.4-.1.1-.2.2-.3.3s-.2.2-.3.4c-.1.1-.1.2-.2.4s-.1.3-.1.5v.4h-.9v-.5c0-.3.1-.6.2-.8s.2-.4.3-.5c.2-.2.3-.3.5-.5.1-.1.3-.3.4-.4.1-.2.2-.3.3-.5s.1-.4.1-.7c0-.4-.2-.7-.4-.9s-.5-.3-.9-.3c-.3 0-.5 0-.7.1-.1.1-.3.2-.4.4-.1.1-.2.3-.3.5 0 .2-.1.5-.1.7h-.9c0-.3.1-.7.2-1zm2.8 5.1v1.2h-1.2v-1.2z"
                    stroke="none"
                  ></path>
                </g>
              </svg>
              <span className="cart-product__coin-value">-0</span>
            </div> */}
              <div className="cart-product__checkout-wrapper">
                <input
                  name="all"
                  onChange={handleCheckAll}
                  checked={isCheckAll()}
                  type="checkbox"
                  className="cart-product__checkout-checkbox"
                />
                <span
                  className="cart-product__checkout-label"
                  onClick={handleCheckAll}
                >
                  Chọn tất cả ({cartProducts.length})
                </span>
                <span
                  data-name="deleteSelected"
                  onClick={handleDeleteSelection}
                  className="cart-product__checkout-del"
                >
                  Xóa
                </span>
                {/* <span className="cart-product__checkout-favorite">
              Lưu vào mục Đã thích
            </span> */}
                <div className="cart-product__checkout-total-wrapper">
                  <div className="cart-product__checkout-total">
                    <span className="cart-product__total-label">
                      Tổng thanh toán ({getItemsTotal(selectedProduct)} sản
                      phẩm):
                    </span>
                    <span className="cart-product__total-all">
                      <NumericFormat
                        value={getItemsPriceTotal(selectedProduct)}
                        thousandSeparator={true}
                        displayType="text"
                        prefix={"₫"}
                      ></NumericFormat>
                    </span>
                  </div>
                  <div className="cart-product__checkout-saved">
                    <span className="cart-product__saved-label">
                      Tiết kiệm:
                    </span>
                    <span className="cart-product__saved-value">
                      <NumericFormat
                        value={getVoucherDiscount(voucher, selectedProduct)}
                        thousandSeparator={true}
                        displayType="text"
                        prefix={"₫"}
                      ></NumericFormat>
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn cart-product__checkout-btn"
                >
                  Mua hàng
                </button>
              </div>
            </div>
          </Grid2>
        </Grid2>
      )}
      {cartProducts.length === 0 && !cartItemsLoading && (
        <div className="grid cart-empty">
          <img src={noCartImg} alt="nocart-img" className="cart-empty__img" />
          <label className="cart-empty__label">
            Giỏ hàng của bạn còn trống
          </label>
          {/*<Link to="/" className="btn cart-empty__btn">*/}
          {/*  mua ngay*/}
          {/*</Link>*/}
        </div>
      )}

      {cartItemsLoading && <ClipLoading></ClipLoading>}

      {isAddCartPopup && (
        <AddCartModal
          isAddCartPopup={isAddCartPopup}
          toggleIsAddCardPopup={toggleIsAddCardPopup}
        ></AddCartModal>
      )}
      {isPopupShowing && (
        <PopupModal
          isCartPage={true}
          isVariationChoose={isVariationChoose}
          isPopupShowing={isPopupShowing}
          togglePopup={togglePopup}
          checked={selectedIdVariation}
          deleteID={deleteID}
          setDeleteID={setDeleteID}
          handleDeleteCartTrue={handleDeleteCartTrue}
          handleDeleteSelectionTrue={handleDeleteSelectionTrue}
          isDeleteSelected={isDeleteSelected}
          setIsDeleteSelected={setIsDeleteSelected}
        ></PopupModal>
      )}
    </div>
  );
}
export default withContainer(CartContainer, true);
