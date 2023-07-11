import {useUser} from "@/context/UserProvider";
import React, {useEffect, useState} from "react";
import useModal from "@/hooks/useModal";
import {getDoc, setDoc} from "firebase/firestore";
import {infoDocRef} from "@/common/dbRef";
import {updateProfile} from "firebase/auth";
import {getDownloadURL, ref, uploadBytesResumable} from "firebase/storage";
import {storage} from "@/configs/firebase";
import AccountMenu from "@/components/Account/AccountMenu";
import AccountProfile from "@/components/Account/AccountProfile";
import PopupModal from "@/components/Modal/PopupModal";
import withContainer from "@/components/withContainer";
import {useMediaQuery} from "@mui/material";

const AccountProfileContainer = () => {
  const {user, setIsPhotoExist} = useUser();
  const [userName, setUserName] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [fileImage, setFileImage] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isInfoUpdating, setIsInfoUpdating] = useState<boolean>(false);
  const [isUserUpdateFailed, setIsUserUpdateFailed] = useState<boolean>(false);
  const [isImageUploadFailed, setIsImageUploadFailed] = useState<boolean>(false);
  const {isPopupShowing, togglePopup} = useModal();
  const xsBreakpointMatches = useMediaQuery("(max-width:600px)");

  // set user info from db
  useEffect(() => {
    if (user) {
      const userName = user.displayName;
      const email = user.email;
      setUserName(userName ? userName : "");
      setEmail(email ? email : "");
      setPreviewImage(user?.photoURL ?? '');

      user && getDoc(infoDocRef(user.uid))
        .then((doc) => {
          setName(doc?.data()?.name ? doc?.data()?.name : "");
          setGender(doc?.data()?.gender ? doc?.data()?.gender : "");
          setBirthday(doc?.data()?.birthday ? doc?.data()?.birthday : "");
          setPhone(doc?.data()?.phone ? doc?.data()?.phone : "");
        })
        .catch((err) => alert(err.message));
    }
  }, [user]); // rerender if upload success
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
      {!xsBreakpointMatches &&
        <AccountMenu user={user}/>
      }
      <div className="user-content">
        <AccountProfile userName={userName} email={email} name={name} previewImage={previewImage}
                        setFileImage={setFileImage} isInfoUpdating={isInfoUpdating}
                        birthday={birthday} gender={gender} handleInfoSubmit={handleInfoSubmit} phone={phone}/>
      </div>
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
  )
}

export default withContainer(AccountProfileContainer, true);
