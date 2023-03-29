import React from "react";
import ReactDOM from "react-dom";
// import {Link} from "react-router-dom";
import {useUser} from "../../context/UserProvider";

export default function ErrorModal() {
  if (typeof window !== 'undefined') {
    return ReactDOM.createPortal(
      <div className="cart-product__modal">
        <div className="cart-product__modal-overlay"></div>
        <div className="cart-product__modal-container">
          <div className="cart-product__error-label">Không có sản phẩm.</div>
          <div className="cart-product__modal-footer">
            {/*<Link to="/cart" className="btn cart-product__error-btn">*/}
            {/*  OK*/}
            {/*</Link>*/}
          </div>
        </div>
      </div>,
    );
  }
}
