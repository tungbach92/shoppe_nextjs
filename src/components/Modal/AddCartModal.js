import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {useUser} from "../../context/UserProvider";

export default function AddCartModal(props) {
  const {isAddCartPopup, toggleIsAddCardPopup} = props;
  //   const { toggleIsAddCardPopup } = useModal();
  const handleModalClick = () => {
    toggleIsAddCardPopup(!isAddCartPopup);
  };
  useEffect(() => {
    //   effect

    let idValue = setTimeout(() => {
      toggleIsAddCardPopup(!isAddCartPopup);
    }, 2000);
    return () => {
      //   cleanup
      clearTimeout(idValue);
    };
  }, [toggleIsAddCardPopup, isAddCartPopup]);
  if (typeof window !== 'undefined') {
    return ReactDOM.createPortal(
      <div onClick={handleModalClick} className="app-product__modal">
        <div className="app-product__modal-overlay"></div>
        <div className="app-product__modal-container">
          <div className="app-product__modal-header">
            <svg
              enableBackground="new 0 0 12 12"
              viewBox="0 0 12 12"
              x="0"
              y="0"
              className="app-product__modal-icon"
            >
              <g>
                <path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
              </g>
            </svg>
            <span className="app-product__popup-label">
            Sản phẩm đã được thêm vào Giỏ hàng
          </span>
          </div>
        </div>
      </div>,
    );
  }

}
