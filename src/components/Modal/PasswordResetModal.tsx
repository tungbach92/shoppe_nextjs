import React, {useEffect, useState} from "react";
import {auth} from "@/configs/firebase";
import {BaseModal} from "@/components/base";
import {sendPasswordResetEmail} from "firebase/auth";

function PasswordResetModal(props: any) {
  const {user, isPasswordResetShowing, togglePasswordReset, email, setEmail} =
    props;
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailSentProcess, setIsEmailSentProcess] = useState(false);

  const handleClick = () => {
    setIsEmailSent(false);
    togglePasswordReset(!isPasswordResetShowing);
  };
  const handleSendEmailClick = () => {
    handleSendPasswordResetEmail();
  };

  const handleSendPasswordResetEmail = () => {
    setIsEmailSentProcess(true);
    sendPasswordResetEmail(auth, email)
      .then(() => {
        setIsEmailSent(true);
        setIsEmailSentProcess(false);
      })
      .catch((error) => {
        setIsEmailSentProcess(false);
        console.log(error);
      });
  };

  useEffect(() => {
    if (user) {
      const email = user.email;
      setEmail(email);
    }
  }, [setEmail, user]);
  return (
    <BaseModal isOpen={isPasswordResetShowing} handleClose={togglePasswordReset}>
      <div className="forgot-password__modal-header">
              <span className="forgot-password__header-label">
                Đặt Lại Mật Khẩu
              </span>
        {!isEmailSent && (
          <span className="forgot-password__select-label">
                  Vui lòng chọn phương thức bạn muốn đặt lại mật khẩu
                </span>
        )}
      </div>
      <div className="forgot-password__modal-content">
        {isEmailSent ? (
          <div className="forgot-password__confirm-container">
            <svg
              viewBox="0 0 77 50"
              className="forgot-password__confirm-icon"
            >
              <path
                stroke="none"
                d="M59.4 0H6.6C2.96 0 0 2.983 0 6.667v36.667C0 47.017 2.953 50 6.6 50h42.826c.7-.008 1.653-.354 1.653-1.497 0-1.156-.814-1.482-1.504-1.482h-.15v-.023H6.6c-1.823 0-3.568-1.822-3.568-3.664V6.667c0-1.842 1.745-3.623 3.568-3.623h52.8c1.824 0 3.6 1.78 3.6 3.623V18c0 .828.538 1.468 1.505 1.468S66 18.828 66 18v-.604-10.73C66 2.983 63.047 0 59.4 0zm-.64 5.76c.374.713.35 1.337-.324 1.733L33.84 21.53c-.423.248-1.575.923-3.124-.004L7.465 7.493c-.672-.396-.52-.896-.146-1.6s.753-1.094 1.426-.698L32.065 19.4 57.202 5.186c.672-.396 1.183-.14 1.556.574zm14.335 26.156l.277.078c.34.092.5.148.45.168 1.862.8 3.178 2.735 3.178 5v7.47c0 2.967-2.28 5.38-5.08 5.38H57.08c-2.8 0-5.08-2.413-5.08-5.38V37.15c0-2.538 1.67-4.665 3.905-5.23v-1.807C55.905 25.087 59.76 21 64.5 21c3.52 0 6.63 2.234 7.944 5.635l.02.05.006.016a9.55 9.55 0 0 1 .625 3.415v1.8zM70.48 28.17a1.28 1.28 0 0 1-.028-.081c-.83-2.754-3.223-4.604-5.954-4.604-3.447 0-6.25 2.974-6.25 6.63v1.655h12.505v-1.655c0-.677-.096-1.33-.275-1.946h.001zm4.18 16.45h-.002c0 1.596-1.227 2.892-2.737 2.892H57.08c-1.507 0-2.737-1.3-2.737-2.893v-7.47c0-1.597 1.227-2.893 2.738-2.893h14.84c1.508 0 2.737 1.3 2.737 2.893v7.47z"
                fillOpacity=".87"
                fillRule="evenodd"
              ></path>
              <rect
                stroke="none"
                x="63"
                y="38"
                width="3"
                height="6"
                viewBox="0 0 3 6"
                rx="1.5"
                fillOpacity=".87"
              ></rect>
            </svg>
            <div className="forgot-password__email-confirm">
              Mã xác minh đã được gửi đến địa chỉ email
            </div>
            <div className="forgot-password__email-txt">{email}</div>
            <div className="forgot-password__email-confirm">
              Vui lòng xác minh
            </div>
          </div>
        ) : (
          <div
            onClick={handleSendEmailClick}
            className="forgot-password__email-select"
          >
            <svg
              className="forgot-password__email-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.1738 5.21875H18.295V5.2196C19.4783 5.2196 20.4697 6.21103 20.4313 7.3934V16.6632C20.4313 17.8455 19.4399 18.837 18.2575 18.837H5.1738C3.99142 18.837 3 17.8455 3 16.6632V7.39425C3 6.21188 3.99142 5.21875 5.1738 5.21875ZM18.8305 17.7697C19.1357 17.7697 19.3641 17.5787 19.3641 17.2352V17.2343V6.85974C19.3641 6.55455 19.1357 6.32524 18.8305 6.32524H4.6411C4.33591 6.32524 4.1066 6.55455 4.1066 6.85974V17.2352C4.10639 17.2438 4.10639 17.2524 4.1066 17.2611C4.11375 17.5491 4.35305 17.7768 4.6411 17.7697H18.8305Z"
                fill="black"
                fillOpacity="0.54"
              ></path>
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.8088 8.61317L12.1185 12.5422C11.8892 12.7707 11.584 12.7707 11.3172 12.5422L6.62434 8.61317C6.39588 8.46058 6.09069 8.46058 5.89974 8.65153C5.67128 8.87999 5.67128 9.2619 5.9381 9.45285L11.2405 13.8772C11.5073 14.1056 11.9651 14.1056 12.2319 13.8772L17.5343 9.45285C17.7627 9.22268 17.8011 8.84163 17.5718 8.65153V8.65153C17.355 8.4687 17.0428 8.45301 16.8088 8.61317V8.61317Z"
                fill="black"
                fillOpacity="0.54"
              ></path>
            </svg>
            <span className="forgot-password__email-text">
                    Email ({email})
                  </span>
          </div>
        )}
      </div>
      <div className="forgot-password__popup-footer">
        <button
          onClick={isEmailSentProcess ? undefined : handleClick}
          className={
            isEmailSentProcess
              ? "btn forgot-password__popup-apply forgot-password__popup-apply--disabled"
              : "btn forgot-password__popup-apply"
          }
        >
          Thoát
        </button>
      </div>
    </BaseModal>
  )
}

export default PasswordResetModal;
