import {useEffect, useState} from "react";
import {storage} from "@/configs/firebase";
import {ref, getDownloadURL} from 'firebase/storage'
import {updateProfile} from "firebase/auth"

const useCheckPhotoURL = (user) => {
  const [isPhotoExist, setIsPhotoExist] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!user) {
      return;
    }
    setLoading(true);
    const path = `users/${user.uid}/avatar`;
    const storageRef = ref(storage, path)

    getDownloadURL(storageRef)
      .then((photoURL) => {
        setIsPhotoExist(true);
        user.updateProfile({
          photoURL,
        });
      })
      .catch((error) => {
        // 404
        setIsPhotoExist(false);
        updateProfile(user, {
          photoURL: null,
        }).then();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);
  return {checkingPhotoURL: loading, isPhotoExist, setIsPhotoExist};
};

export default useCheckPhotoURL;
