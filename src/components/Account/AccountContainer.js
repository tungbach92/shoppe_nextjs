import React, { useState, useEffect } from "react";
// import { Link, Route, Navigate, NavLink, Routes } from "react-router-dom";
import AccountEmail from "./AccountEmail";
import AccountPassword from "./AccountPassword";
import AccountAddress from "./AccountAddress";
import AccountPayment from "./AccountPayment";
import AccountOrder from "./AccountOrder";
import AccountProfile from "./AccountProfile";
import useModal from "../../hooks/useModal";
import PopupModal from "../Modal/PopupModal";
import { useUser } from "../../context/UserProvider";
import withContainer from "../../pages/withContainer";
import {db, storage} from "@/configs/firebase";
import {infoDocRef} from "../../common/dbRef";

const AccountContainer = () => {
  const { user, setIsPhotoExist } = useUser();
  const [userName, setUserName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [fileImage, setFileImage] = useState();
  const [previewImage, setPreviewImage] = useState(null);
  const [isInfoUpdating, setIsInfoUpdating] = useState(false);
  const [isUserUpdateFailed, setIsUserUpdateFailed] = useState(false);
  const [isImageUploadFailed, setIsImageUploadFailed] = useState(false);
  const { isPopupShowing, togglePopup } = useModal();
  const userAvatar = user?.photoURL;

  // set user info from db
  useEffect(() => {
    if (user) {
      const userName = user.displayName;
      const email = user.email;
      setUserName(userName ? userName : "");
      setEmail(email ? email : "");
      setPreviewImage(userAvatar);

      infoDocRef(user?.uid).get()
        .then((doc) => {
          if (doc.exists) {
            const name = doc.data().name;
            const gender = doc.data().gender;
            const birthday = doc.data().birthday;
            const phone = doc.data().phone;
            setName(name ? name : "");
            setGender(gender ? gender : "");
            setBirthday(birthday ? birthday : "");
            setPhone(phone ? phone : "");
          }
        })
        .catch((err) => alert(err.message));
    }
  }, [user, userAvatar]); // rerender if upload success

  const handleInfoSubmit = async ({
    user: userName,
    name,
    phone,
    gender,
    birthday,
    previewImage,
  }) => {
    try {
      //upadating info
      setIsInfoUpdating(true);
      await user.updateProfile({
        displayName: userName,
      });

      await infoDocRef(user?.uid).set({
          name: name,
          gender: gender,
          birthday: birthday,
          phone: phone,
        });
      setIsInfoUpdating(false);
    } catch (error) {
      togglePopup(!isPopupShowing);
      setIsInfoUpdating(false);
      setIsUserUpdateFailed(true);
    }

    //updating image
    if (previewImage && fileImage) {
      // dont upload if no fileImage or without choose fileImage again
      const storageRef = storage.ref(`users/${user.uid}/avatar`);
      const uploadTask = storageRef.put(fileImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "running":
              setIsInfoUpdating(true);
              break;
            case "pause":
              setIsInfoUpdating(false);
              break;
            default:
              break;
          }
        },
        //Handle unsuccessful uploads
        (error) => {
          setIsInfoUpdating(false);
          setIsImageUploadFailed(true);
          togglePopup(!isPopupShowing);
        },
        //handle successful uploads
        () => {
          uploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadURL) => {
              setIsPhotoExist(true);
              user.updateProfile({
                photoURL: downloadURL,
              });
            })
            .then(() => {
              setIsInfoUpdating(false);
              togglePopup(!isPopupShowing);
            });
        }
      );
    } else {
      togglePopup(!isPopupShowing);
    }
  };

  return (
    <div className="main">
      <div className="user-profile">
        <div className="user-profile__name-container">
          <div className="user-profile__image-container">
            {userAvatar ? (
              <img
                className="user-profile__image-user"
                src={userAvatar}
                alt=""
              />
            ) : (
              <svg
                enableBackground="new 0 0 15 15"
                viewBox="0 0 15 15"
                x="0"
                y="0"
                className="user-profile__image-svg"
              >
                <g>
                  <circle
                    cx="7.5"
                    cy="4.5"
                    fill="none"
                    r="3.8"
                    strokeMiterlimit="10"
                  ></circle>
                  <path
                    d="m1.5 14.2c0-3.3 2.7-6 6-6s6 2.7 6 6"
                    fill="none"
                    strokeLinecap="round"
                    strokeMiterlimit="10"
                  ></path>
                </g>
              </svg>
            )}
          </div>
          <div className="user-profile__name">{user?.displayName}</div>

          {/*<Link to="profile" className="user-profile__name-btn">*/}
          {/*  Sửa Hồ Sơ*/}
          {/*</Link>*/}
        </div>
        {/*<div className="user-profile__category">*/}
        {/*  /!* <div className="user-profile__my-user">Tài Khoản Của Tôi</div> *!/*/}
        {/*  <NavLink to="profile" className="user-profile__my-info" replace>*/}
        {/*    Hồ sơ*/}
        {/*  </NavLink>*/}
        {/*  <NavLink to="payment" className="user-profile__my-bank" replace>*/}
        {/*    Thẻ tín dụng/ghi nợ*/}
        {/*  </NavLink>*/}
        {/*  <NavLink to="address" className="user-profile__my-adress" replace>*/}
        {/*    Địa chỉ*/}
        {/*  </NavLink>*/}
        {/*  <NavLink*/}
        {/*    to="password"*/}
        {/*    className="user-profile__change-password"*/}
        {/*    replace*/}
        {/*  >*/}
        {/*    Đổi mật khẩu*/}
        {/*  </NavLink>*/}
        {/*  <NavLink to="purchase" className="user-profile__order" replace>*/}
        {/*    Đơn Mua*/}
        {/*  </NavLink>*/}
        {/*</div>*/}
      </div>
      {/*<div className="user-content">*/}
      {/*  <Routes>*/}
      {/*    <Route*/}
      {/*      path="profile"*/}
      {/*      element={*/}
      {/*        <AccountProfile*/}
      {/*          userName={userName}*/}
      {/*          name={name}*/}
      {/*          email={email}*/}
      {/*          phone={phone}*/}
      {/*          gender={gender}*/}
      {/*          birthday={birthday}*/}
      {/*          fileImage={fileImage}*/}
      {/*          previewImage={previewImage}*/}
      {/*          setFileImage={setFileImage}*/}
      {/*          isInfoUpdating={isInfoUpdating}*/}
      {/*          handleInfoSubmit={handleInfoSubmit}*/}
      {/*        ></AccountProfile>*/}
      {/*      }*/}
      {/*    ></Route>*/}
      {/*    <Route index element={<Navigate to="profile" replace />} />*/}
      {/*    <Route*/}
      {/*      path="email"*/}
      {/*      element={*/}
      {/*        <AccountEmail email={email} setEmail={setEmail}></AccountEmail>*/}
      {/*      }*/}
      {/*    ></Route>*/}
      {/*    <Route*/}
      {/*      path="password"*/}
      {/*      element={*/}
      {/*        <AccountPassword*/}
      {/*          email={email}*/}
      {/*          setEmail={setEmail}*/}
      {/*        ></AccountPassword>*/}
      {/*      }*/}
      {/*    ></Route>*/}
      {/*    <Route*/}
      {/*      path="address"*/}
      {/*      element={<AccountAddress></AccountAddress>}*/}
      {/*    ></Route>*/}
      {/*    <Route*/}
      {/*      path="payment"*/}
      {/*      element={<AccountPayment></AccountPayment>}*/}
      {/*    ></Route>*/}
      {/*    <Route*/}
      {/*      path="purchase"*/}
      {/*      element={<AccountOrder></AccountOrder>}*/}
      {/*    ></Route>*/}
      {/*  </Routes>*/}
      {/*</div>*/}

      {isPopupShowing && (
        <PopupModal
          isUserUpdateFailed={isUserUpdateFailed}
          isAccountPage={true}
          isImageUploadFailed={isImageUploadFailed}
          isPopupShowing={isPopupShowing}
          togglePopup={togglePopup}
        ></PopupModal>
      )}
    </div>
  );
};

export default withContainer(AccountContainer, true);
