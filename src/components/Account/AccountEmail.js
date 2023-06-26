import React, {useEffect, useState} from "react";
import useModal from "../../hooks/useModal";
import PopupModal from "../Modal/PopupModal";
import {auth} from '@/configs/firebase'
import {useUser} from "@/context/UserProvider";
import {signInWithEmailAndPassword} from "firebase/auth";

const AccountEmail = ({setEmail, email}) => {
  const {user} = useUser();
  const [verifyPassword, setVerifyPassword] = useState();
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isCheckSignInProcess, setIsCheckSignInProcess] = useState(false);
  const [isUpdatingEmailProcess, setIsUpdatingEmailProcess] = useState(false);
  const [isCredentialsValid, setIsCredentialsValid] = useState(false);
  const [isUpdateEmailSuccess, setIsUpdateEmailSuccess] = useState(false);

  const {isPopupShowing, togglePopup} = useModal();
  useEffect(() => {
    if (user) {
      const email = user.email;
      setEmail(email);
    }
  }, [setEmail, user]);

  const checkSignIn = () => {
    setIsCheckSignInProcess(true);
    signInWithEmailAndPassword(auth, email, verifyPassword)
      .then((userCredential) => {
        if (userCredential) {
          setIsCredentialsValid(true);
          setIsCheckSignInProcess(false);
        }
      })
      .catch((err) => {
        setIsCredentialsValid(false);
        setIsCheckSignInProcess(false);
        setIsWrongPassword(true);
        console.log(err);
      });
  };

  const updateEmail = () => {
    setIsUpdatingEmailProcess(true);
    signInWithEmailAndPassword(auth, email, verifyPassword)
      .then((userCredential) => {
        setIsCredentialsValid(true);
        userCredential.user
          .updateEmail(newEmail)
          .then(() => {
            togglePopup();
            setIsUpdateEmailSuccess(true);
            setEmail(newEmail);
            setIsUpdatingEmailProcess(false);
            //success
          })
          .catch((err) => {
            togglePopup();
            setIsUpdatingEmailProcess(false);
            console.log(err);
          });
      })
      .catch((err) => {
        setIsUpdatingEmailProcess(false);
        setIsCredentialsValid(false);
        setIsWrongPassword(true);
        console.log(err);
      });
  };

  const handleInputPwdKeyUp = (e) => {
    if (e.keyCode === 13) {
      checkSignIn(verifyPassword);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isCredentialsValid) {
      updateEmail(newEmail, verifyPassword);
    } else {
      checkSignIn(verifyPassword);
    }
  };
  return (
    <>
      <div className="user-profile__title-container">
        <div className="user-profile__title">
          <div className="user-profile__label">Hồ Sơ Của Tôi</div>
          <div className="user-profile__label-detail">
            Quản lý thông tin hồ sơ để bảo mật tài khoản
          </div>
        </div>
      </div>
      <div className="email-profile__content">
        {email && (
          <div className="email-profile__email-container">
            <label className="email-profile__email-label">
              {isCredentialsValid ? "Old email:" : "Email:"}
            </label>
            <span className="email-profile__email-text">{email}</span>
          </div>
        )}

        {isCredentialsValid ? (
          <form
            onSubmit={
              isUpdatingEmailProcess || isCheckSignInProcess
                ? undefined
                : handleSubmit
            }
            className="email-profile__newemail-container"
          >
            <label className="email-profile__newemail-label">New email:</label>
            <input
              type="email"
              onChange={(e) => setNewEmail(e.target.value)}
              className="email-profile__newemail-input"
              required
            />
            <button
              disabled={isUpdatingEmailProcess}
              type="submit"
              className="btn email-profile__submit-btn"
            >
              {isUpdatingEmailProcess ? "Xử lý..." : "Thay đổi"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={
              isUpdatingEmailProcess || isCheckSignInProcess
                ? undefined
                : handleSubmit
            }
            className="email-profile__pwd-container"
          >
            <label className="email-profile__pwd-label">Password:</label>
            <input
              type="password"
              onKeyUp={handleInputPwdKeyUp}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="email-profile__pwd-input"
              required
            />
            {isWrongPassword && (
              <div className="email-profile__pwd-error">
                Password incorrect! Please try again
              </div>
            )}
            <button
              disabled={isCheckSignInProcess}
              type="submit"
              className="btn email-profile__submit-btn"
            >
              {isCheckSignInProcess ? "Xử lý..." : "Xác nhận"}
            </button>
          </form>
        )}

        {isPopupShowing && (
          <PopupModal
            isAccountPage={true}
            isUpdateEmailSuccess={isUpdateEmailSuccess}
            isPopupShowing={isPopupShowing}
            togglePopup={togglePopup}
            isCheckoutPage></PopupModal>
        )}
      </div>
    </>
  );
};

export default AccountEmail;
