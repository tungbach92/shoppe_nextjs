import React from "react";
import noCartImg from "../../img/no-cart.png";
import classNames from "classnames";
// import { Link, useLocation, useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useMediaQuery } from "@mui/material";
import { useUser } from "../../context/UserProvider";
import { useSelector } from "react-redux";
import { useFetchCartQuery } from "../../services/cartApi";

const HeaderCart = () => {
  const { user } = useUser();
  const cartProducts = useSelector((state) => state.cart.products);
  const { isLoading: cartItemsLoading } = useFetchCartQuery(user);

  // const navigate = useNavigate();
  // const location = useLocation();
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");

  return (
    <div className="header__cart">
      <div
        className="header__cart-wrapper"
        onClick={() => {
          // if (location.pathname !== "cart") {
          //   navigate("/cart");
          // }
        }}
      >
        <div className="header__cart-icon-link">
          <i className="header__cart-icon bi bi-cart">
            {/* <!-- No cart: empty --> */}
            {user && (
              <div className="header__cart-numb">
                {!cartItemsLoading && cartProducts?.length}
              </div>
            )}
          </i>
        </div>
        {!xsBreakpointMatches && user && (
          <div
            className={classNames("header__cart-list", {
              "header__cart-list--empty": cartProducts?.length === 0,
            })}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="header__cart-arrow"></div>
            <div className="header__cart-list-container">
              <div className="header__cart-title">Sản phẩm mới thêm</div>
              <div className="header__cart-list-item">
                {cartProducts?.map((item, index) => (
                  <div key={index} className="header__cart-item">
                    <div className="header__cart-link">
                      <img
                        className="header__cart-img"
                        src={item.imageUrl}
                        alt="item-ao"
                      />
                      <div className="header__cart-name">{item.name}</div>
                      <div className="header__cart-price">
                        <NumericFormat
                          value={item.price}
                          prefix={"₫"}
                          thousandSeparator={true}
                          displayType="text"
                        ></NumericFormat>
                      </div>
                      <span>x</span>
                      <div className="header__cart-amount">{item.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <img
              src={noCartImg}
              className="header__cart-empty-img"
              alt="no-cart"
            />
            <div className="header__cart-empty-info">Chưa có sản phẩm</div>
            {/*<Link to="/cart" className="btn header__cart-button">*/}
            {/*  Xem giỏ hàng*/}
            {/*</Link>*/}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderCart;
