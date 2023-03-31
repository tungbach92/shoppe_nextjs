import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import {BaseModal} from "@/components/base";

interface AddCartModalProps {
  isAddCartPopup: boolean,
  toggleIsAddCardPopup: (value: boolean) => void
}

export default function AddCartModal({isAddCartPopup, toggleIsAddCardPopup}: AddCartModalProps) {
  const handleModalClick = () => {
    toggleIsAddCardPopup(!isAddCartPopup);
  };
  useEffect(() => {
    let idValue = isAddCartPopup && setTimeout(() => {
      toggleIsAddCardPopup(!isAddCartPopup);
    }, 2000);
    return () => {
      idValue && clearTimeout(idValue);
    };
  }, [toggleIsAddCardPopup, isAddCartPopup]);
  return (
    <BaseModal isOpen={isAddCartPopup} handleClose={handleModalClick}>
      <div className='flex flex-col items-center gap-3'>
        <svg
          enableBackground="new 0 0 12 12"
          viewBox="0 0 12 12"
          x="0"
          y="0"
          className="app-product__modal-icon"
        >
          <g>
            <path
              d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
          </g>
        </svg>
        <div className="">
          Sản phẩm đã được thêm vào Giỏ hàng
        </div>
      </div>
    </BaseModal>
    // <div onClick={handleModalClick} className="app-product__modal">
    //   <div className="app-product__modal-overlay"></div>
    //   <div className="app-product__modal-container">
    //     <div className="app-product__modal-header">
    //       <svg
    //         enableBackground="new 0 0 12 12"
    //         viewBox="0 0 12 12"
    //         x="0"
    //         y="0"
    //         className="app-product__modal-icon"
    //       >
    //         <g>
    //           <path d="m5.2 10.9c-.2 0-.5-.1-.7-.2l-4.2-3.7c-.4-.4-.5-1-.1-1.4s1-.5 1.4-.1l3.4 3 5.1-7c .3-.4 1-.5 1.4-.2s.5 1 .2 1.4l-5.7 7.9c-.2.2-.4.4-.7.4 0-.1 0-.1-.1-.1z"></path>
    //         </g>
    //       </svg>
    //       <span className="app-product__popup-label">
    //       Sản phẩm đã được thêm vào Giỏ hàng
    //     </span>
    //     </div>
    //   </div>
    // </div>
  )
}
