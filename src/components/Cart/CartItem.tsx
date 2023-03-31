import Link from "next/link";
import classNames from "classnames";
import {NumericFormat} from "react-number-format";
import React from "react";

interface Props {
  item: any,
  isCheck: (item: any) => boolean
  handleCheck: (item: any) => void
  handlePopup: (variation: any, id: any) => void
  isIDVariationExist: (id: string, listItem: any) => boolean
  handleVariationClick: (value: any) => void
  variation: any,
  handleVariationBack: (variation: any, id: any) => void
  handleVariationApply: (variation: any, id: any) => void
  decrCartItem: (id: any, variation: any) => void
  incrCartItem: (id: any, variation: any) => void
  changeAmountCartItem: (id: any, variation: any, value: any) => void
  handleDelete: (id: any, variation: any) => void
}

export default function CartItem({
                                   item,
                                   isCheck,
                                   handleCheck,
                                   handlePopup,
                                   isIDVariationExist,
                                   handleVariationClick,
                                   variation,
                                   handleVariationBack,
                                   handleVariationApply,
                                   decrCartItem,
                                   incrCartItem,
                                   changeAmountCartItem,
                                   handleDelete
                                 }: Props) {
  return (
    <div key={item.id} className="cart-product__item">
      <input
        type="checkbox"
        checked={isCheck(item)}
        onChange={() => handleCheck(item)}
        className="grid__col cart-product__checkbox"
      />
      <Link
        // href={{
        //   pathname: `/product/${item.metaTitle}/${item.id}`,
        //   state: { id: item.id },
        // }}
        href={`/product/${item.metaTitle}/${item.id}`}
        className="grid__col cart-product__overview"
      >
        <img
          src={item.imageUrl}
          alt=""
          className="cart-product__img"
        />
        <span className="cart-product__name">{item.name}</span>
      </Link>
      <div
        data-name="variation"
        onClick={() => handlePopup(item.variation, item.id)}
        className="grid__col cart-product__variation"
      >
                  <span className="cart-product__variation-label">
                    Phân Loại Hàng:
                    <span
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
              {item.variationList?.map((listItem: any, i: number) => (
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
                          <path
                            d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
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
              onClick={() => handleVariationBack(
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
      </div>
    </div>
  )
}
