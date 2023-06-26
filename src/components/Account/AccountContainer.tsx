import React, {ReactNode, useEffect, useState} from "react";
import useModal from "../../hooks/useModal";
import PopupModal from "../Modal/PopupModal";
import {useUser} from "@/context/UserProvider";
import withContainer from "../withContainer";
import {storage} from "@/configs/firebase";
import {infoDocRef} from "@/common/dbRef";
import {updateProfile} from "firebase/auth";
import {getDoc, setDoc} from "firebase/firestore";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";

interface Props {
  children: ReactNode
}

const AccountContainer = ({children}: Props) => {
  const {user, setIsPhotoExist} = useUser();
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
  const {isPopupShowing, togglePopup} = useModal();
  const userAvatar = user?.photoURL;

  // set user info from db
    useEffect(() => {
      if (user) {
        const userName = user.displayName;
        const email = user.email;
        setUserName(userName ? userName : "");
        setEmail(email ? email : "");
        setPreviewImage(userAvatar);

        user && getDoc(infoDocRef(user.uid))
          .then((doc) => {
            setName(doc?.data()?.name ? doc?.data()?.name : "");
            setGender(doc?.data()?.gender ? doc?.data()?.gender : "");
            setBirthday(doc?.data()?.birthday ? doc?.data()?.birthday : "");
            setPhone(doc?.data()?.phone ? doc?.data()?.phone : "");
          })
          .catch((err) => alert(err.message));
      }
    }, [user, userAvatar]); // rerender if upload success
  const handleInfoSubmit = async (values: any) => {
    const {
      userName,
      name,
      phone,
      gender,
      birthday,
      previewImage,
    } = values
    try {
      //upadating info
      setIsInfoUpdating(true);
      await updateProfile(user, {
        displayName: userName,
      });

      await setDoc(infoDocRef(user?.uid), {
        name: name,
        gender: gender,
        birthday: birthday,
        phone: phone,
      });
      setIsInfoUpdating(false);
    } catch (error) {
      togglePopup();
      setIsInfoUpdating(false);
      setIsUserUpdateFailed(true);
    }

    //updating image
    if (previewImage && fileImage) {
      // dont upload if no fileImage or without choose fileImage again
      const storageRef = ref(storage, `users/${user.uid}/avatar`);
      const uploadTask = uploadBytesResumable(storageRef, fileImage);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          switch (snapshot.state) {
            case "paused":
              setIsInfoUpdating(false);
              break;
            case "running":
              setIsInfoUpdating(true);
              break;
          }
        },
        //Handle unsuccessful uploads
        (error) => {
          setIsInfoUpdating(false);
          setIsImageUploadFailed(true);
          togglePopup();
        },
        //handle successful uploads
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setIsPhotoExist(true);
              updateProfile(user, {
                photoURL: downloadURL,
              });
            })
            .then(() => {
              setIsInfoUpdating(false);
              togglePopup();
            });
        }
      );
    } else {
      togglePopup();
    }
  };

  return (
    <div className="main">
      {children}
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
