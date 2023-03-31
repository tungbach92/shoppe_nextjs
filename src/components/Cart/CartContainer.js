import React, {useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import useModal from "../../hooks/useModal";
import VoucherModal from "../Modal/VoucherModal";
import noCartImg from "../../../public/img/no-cart.png";
import AddCartModal from "../Modal/AddCartModal";
import PopupModal from "../Modal/PopupModal";
import {NumericFormat} from "react-number-format";
import Grid2 from "@mui/material/Unstable_Grid2";
import {getItemsPriceTotal} from "@/services/getItemsPriceTotal";
import {getVoucherDiscount} from "@/services/getVoucherDiscount";
import {useCheckoutContext} from "@/context/CheckoutProvider";
import {CHECKOUT_ACTIONTYPES} from "@/constants/actionType";
import {ClipLoading} from "../ClipLoading";
import {useUser} from "@/context/UserProvider";
import {useSelector} from "react-redux";
import {
  deleteProducts, deleteSelectedProducts, updateProducts,
} from "@/redux/cartSlice";
import {useDispatch} from "react-redux";
import {
  useAddCartToFireStoreMutation, useFetchCartQuery,
} from "@/services/cartApi";
import useVoucher from "@/hooks/useVoucher";
import withContainer from "@/components/withContainer";
import Link from "next/link";
import CartItem from "@/components/Cart/CartItem";
import CartVoucher from "@/components/Cart/CartVoucher";

function CartContainer() {
  const {user} = useUser();
  const {voucher, resetVoucher} = useVoucher();
  const {isLoading: cartItemsLoading} = useFetchCartQuery(user);
  const cartProducts = useSelector((state) => state.cart.products);
  const [addCartToFireStore] = useAddCartToFireStoreMutation();
  const dispatch = useDispatch();
  const {checkoutDispatch} = useCheckoutContext();
  const [variation, setVariation] = useState("");
  const [isVariationChoose, setIsVariationChoose] = useState(false);
  const [deleteID, setDeleteID] = useState(null);
  const [deleteVariation, setDeleteVariation] = useState();
  const [isDeleteSelected, setIsDeleteSelected] = useState(false);
  const [selectedIdVariation, setSelectedIdVariation] = useState([]);
  const selectedProduct = useMemo(() => {
    return cartProducts.filter((item) => selectedIdVariation.some((e) => e.id === item.id && e.variation === item.variation));
  }, [cartProducts, selectedIdVariation]);

  const {
    isVoucherShowing, toggleVoucher, isAddCartPopup, toggleIsAddCardPopup, isPopupShowing, togglePopup,
  } = useModal();
  const [domLoaded, setDomLoaded] = useState(false);
  useEffect(() => {
    setDomLoaded(true);
  }, []);
  // scrollToTop
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  // }, []);

  // useEffect(() => {
  //   if (location.state) {
  //     toggleIsAddCardPopup(true);
  //   }
  //   navigate(location.pathname, { replace: true });
  // }, [toggleIsAddCardPopup, location.state, location.pathname, navigate]);

  useEffect(() => {
    if (selectedProduct.length > 0) {
      const isVariationChoose = selectedProduct.every((item) => item.variation?.length > 0 || item.variationList.length === 0);
      setIsVariationChoose(isVariationChoose);
    }
  }, [selectedProduct]);

  const getItemsTotal = (items) => {
    const result = items?.reduce((checkoutItemTotal, item) => checkoutItemTotal + item.amount, 0);
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
        const {similarDisPlay, variationDisPlay, ...rest} = selectedEle;
        return rest;
      });
      checkoutDispatch({
        type: CHECKOUT_ACTIONTYPES.ADD_CHECKOUT, payload: checkoutItems,
      });
      addCartToFireStore({user, cartProducts});
      // navigate("/checkout");
    }
  };

  const delCartItems = () => {
    const newCartProducts = cartProducts.filter((item) => selectedIdVariation.every((e) => e.id !== item.id || e.variation !== item.variation));
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
    dispatch(deleteProducts({id: deleteID, variation: deleteVariation}));
    const newCheckedId = selectedIdVariation.filter((e) => e.id !== deleteID || e.variation !== deleteVariation);
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
    const indexOfItem = newCartProducts.findIndex((item) => item.id === id && item.variation === variation);
    newCartProducts[indexOfItem] = {
      ...newCartProducts[indexOfItem], amount,
    };
    dispatch(updateProducts(newCartProducts));
  };

  const incrCartItem = (id, variation) => {
    const newCartProducts = [...cartProducts];
    const indexOfItem = newCartProducts.findIndex((item) => item.id === id && item.variation === variation);
    newCartProducts[indexOfItem] = {
      ...newCartProducts[indexOfItem], amount: newCartProducts[indexOfItem].amount + 1,
    };
    dispatch(updateProducts(newCartProducts));
  };

  const decrCartItem = (id, variation) => {
    const newCartProducts = [...cartProducts];
    const indexOfItem = newCartProducts.findIndex((item) => item.id === id && item.variation === variation);
    if (newCartProducts[indexOfItem].amount > 1) {
      newCartProducts[indexOfItem] = {
        ...newCartProducts[indexOfItem], amount: newCartProducts[indexOfItem].amount - 1,
      };
      dispatch(updateProducts(newCartProducts));
    }
  };

  const changeVariationDisPlayCartItems = (variation, id) => {
    const newCartProducts = cartProducts.map((item) => item.id === id && item.variation === variation ? {...item, variationDisPlay: !item.variationDisPlay} : item);
    dispatch(updateProducts(newCartProducts));
  };

  const changeCartItemsVariation = (oldVariation, id) => {
    const newCartProducts = cartProducts.map((item) => item.id === id && item.variation === oldVariation ? {
      ...item, variation: variation, variationDisPlay: !item.variationDisPlay,
    } : item);
    dispatch(updateProducts(newCartProducts));
    const newCheckedId = selectedIdVariation.map((item) => item.id === id ? {...item, variation} : item);
    setSelectedIdVariation(newCheckedId);
  };

  const handlePopup = (variation, id) => {
    changeVariationDisPlayCartItems(variation, id);
    setVariation(variation);
  };

  const handleVoucherModal = () => {
    toggleVoucher(!isVoucherShowing);
  };

  const handleVoucherDelete = () => {
    resetVoucher();
  };

  const handleCheck = (item) => {
    if (isCheck(item)) {
      const newCheckedId = selectedIdVariation.filter((e) => e.id !== item.id || e.variation !== item.variation);
      setSelectedIdVariation(newCheckedId);
      return;
    }
    setSelectedIdVariation([...selectedIdVariation, {id: item.id, variation: item.variation},]);
  };

  const isCheck = (item) => {
    const result = selectedIdVariation.some((e) => e.id === item.id && e.variation === item.variation);
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
        return {id: e.id, variation: e.variation};
      });
      setSelectedIdVariation(newCheckedId);
    }
  };

  const isIDVariationExist = (id, variation) => {
    const result = cartProducts.some((item) => item.variation === variation && item.id === id);
    return result;
  };

  return (<div className="main">
    {cartProducts.length > 0 && domLoaded && (<Grid2 container maxWidth="100%" width="120rem" m="0 auto">
      <Grid2
        sm={12}
        sx={{
          padding: "1.6rem 0", backgroundColor: "#f5f5f5",
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
        {cartProducts.map((item) => (
          <CartItem key={item.id} item={item} decrCartItem={decrCartItem} variation={variation} changeAmountCartItem={changeAmountCartItem} handleVariationBack={handleVariationBack}
                    handleVariationClick={handleVariationClick} handlePopup={handlePopup} handleCheck={handleCheck} handleDelete={handleDelete} handleVariationApply={handleVariationApply}
                    incrCartItem={incrCartItem} isCheck={isCheck} isIDVariationExist={isIDVariationExist}/>))}
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
            <CartVoucher voucher={voucher} handleVoucherDelete={handleVoucherDelete} handleVoucherModal={handleVoucherModal}/>
          </div>
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
    </Grid2>)}
    {cartProducts.length === 0 && !cartItemsLoading && (<div className="grid cart-empty">
      <img src={'/img/no-cart.png'} alt="nocart-img" className="cart-empty__img"/>
      <label className="cart-empty__label">
        Giỏ hàng của bạn còn trống
      </label>
      <Link href="/" className="btn cart-empty__btn">
        mua ngay
      </Link>
    </div>)}

    {cartItemsLoading && <ClipLoading></ClipLoading>}

    <AddCartModal
      isAddCartPopup={isAddCartPopup}
      toggleIsAddCardPopup={toggleIsAddCardPopup}
    />
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
    />
  </div>);
}

export default withContainer(CartContainer, true);
