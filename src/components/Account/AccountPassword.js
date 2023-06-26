import React, {useEffect, useState} from "react";
import {auth} from "@/configs/firebase";
import useModal from "../../hooks/useModal";
import PopupModal from "../Modal/PopupModal";
import PasswordResetModal from "../Modal/PasswordResetModal";
import {styled} from "@mui/material";
import {useUser} from "../../context/UserProvider";

const StyledInput = styled("input", {
  shouldForwardProp: (props) => props !== "isValid",
})(({ isValid }) => ({
  borderColor: isValid === false && "red",
}));

function AccountPassword({ setEmail, email }) {
  const { user } = useUser();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isPasswordValid, setIsPasswordValid] = useState(null);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(null);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(null);
  const [isUpdatingPasswordProcess, setIsUpdatingPasswordProcess] =
    useState(false);
  const [isUpdatePasswordSuccess, setIsUpdatePasswordSuccess] = useState(false);
  const {
    isPopupShowing,
    togglePopup,
    isPasswordResetShowing,
    togglePasswordReset,
  } = useModal();

  useEffect(() => {
    if (user) {
      const email = user.email;
      setEmail(email);
    }
  }, [setEmail, user]);

  const handleForgotPasswordClick = () => {
    togglePasswordReset(!isPasswordResetShowing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validatePassword();
    validateNewPassword();
    validateConfirmPassword();
    if (isPasswordValid && isNewPasswordValid && isConfirmPasswordValid) {
      setNewPassword("");
      setConfirmPassword("");
      updatePassword();
    }
  };
  const updatePassword = () => {
    setIsUpdatingPasswordProcess(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        userCredential.user
          .updatePassword(newPassword)
          .then(() => {
            setIsUpdatingPasswordProcess(false);
            togglePopup();
            setIsUpdatePasswordSuccess(true);
          })
          .catch((err) => {
            setIsUpdatingPasswordProcess(false);
            setIsUpdatePasswordSuccess(false);
            console.log(err);
          });
      })
      .catch((err) => {
        let errors;
        errors = "Mật khẩu cũ không đúng";
        setErrors((prevErrors) => ({ ...prevErrors, password: errors }));
        setIsUpdatingPasswordProcess(false);
        setIsUpdatePasswordSuccess(false);
        console.log(err);
      });
  };

  const validatePassword = () => {
    let errors;
    setIsPasswordValid(true);
    if (!password) {
      setIsPasswordValid(false);
      errors = "Vui lòng nhập mật khẩu cũ";
    } else if (password.length < 6) {
      setIsPasswordValid(false);
      errors = "Mật khẩu phải chứa ít nhất 6 ký tự";
    }
    setErrors((prevErrors) => ({ ...prevErrors, password: errors }));
  };
  const validateNewPassword = () => {
    let errors;
    setIsNewPasswordValid(true);
    if (!newPassword) {
      setIsNewPasswordValid(false);
      errors = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 6) {
      setIsNewPasswordValid(false);
      errors = "Mật khẩu mới phải chứa ít nhất 6 ký tự";
    }
    setErrors((prevErrors) => ({ ...prevErrors, newPassword: errors }));
  };
  const validateConfirmPassword = () => {
    let errors;
    setIsConfirmPasswordValid(true);
    if (!confirmPassword) {
      setIsConfirmPasswordValid(false);
      errors = "Vui lòng nhập lại mật khẩu mới";
    } else if (newPassword !== confirmPassword) {
      setIsConfirmPasswordValid(false);
      errors = "Mật khẩu mới không khớp nhau";
    }

    setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: errors }));
  };

  return (
    <>
      <div className="user-profile__title-container">
        <div className="user-profile__title">
          <div className="user-profile__label">Đổi Mật Khẩu</div>
          <div className="user-profile__label-detail">
            Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
          </div>
        </div>
      </div>
      <div className="user-profile__password-content">
        <form
          onSubmit={isUpdatingPasswordProcess ? undefined : handleSubmit}
          className="user-profile__password-form"
        >
          <label className="user-profile__oldpassword-label">
            Mật khẩu hiện tại:
          </label>
          <StyledInput
            isValid={isPasswordValid}
            onBlur={validatePassword}
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="user-profile__oldpassword-input"
          />
          <div className="user-profile__password-error">{errors.password}</div>

          <div
            onClick={handleForgotPasswordClick}
            className="user-profile__forgot-password"
          >
            Quên mật khẩu?
          </div>
          <PasswordResetModal
            setEmail={setEmail}
            user={user}
            email={email}
            isPasswordResetShowing={isPasswordResetShowing}
            togglePasswordReset={togglePasswordReset}
          ></PasswordResetModal>
          <label className="user-profile__newpassword-label">
            Mật Khẩu Mới:
          </label>
          <StyledInput
            isValid={isNewPasswordValid}
            onBlur={validateNewPassword}
            name="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="user-profile__newpassword-input"
          />
          <div className="user-profile__newPassword-error">
            {errors.newPassword}
          </div>

          <label className="user-profile__confirmPassword-label">
            Xác Nhận Mật Khẩu Mới:
          </label>
          <StyledInput
            isValid={isConfirmPasswordValid}
            onBlur={validateConfirmPassword}
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="user-profile__confirmPassword-input"
          />

          <div className="user-profile__confirmPassword-error">
            {errors.confirmPassword}
          </div>
          <button
            disabled={isUpdatingPasswordProcess}
            type="submit"
            className="btn user-profile__password-btn"
          >
            {isUpdatingPasswordProcess ? "Xử lý..." : "Xác nhận"}
          </button>
        </form>
        {isPopupShowing && (
          <PopupModal
            isAccountPage={true}
            isUpdatePasswordSuccess={isUpdatePasswordSuccess}
            isPopupShowing={isPopupShowing}
            togglePopup={togglePopup}
          ></PopupModal>
        )}
      </div>
    </>
  );
}

export default AccountPassword;
