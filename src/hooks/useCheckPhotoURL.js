import { useEffect, useState } from "react";
import { storage } from "../configs/firebase";

const useCheckPhotoURL = (user) => {
  const [isPhotoExist, setIsPhotoExist] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!user) {
      return;
    }
    setLoading(true);
    const path = `users/${user.uid}/avatar`;
    const storageRef = storage.ref(path);

    storageRef
      .getDownloadURL()
      .then((photoURL) => {
        setIsPhotoExist(true);
        user.updateProfile({
          photoURL,
        });
      })
      .catch((error) => {
        // 404
        setIsPhotoExist(false);
        user.updateProfile({
          photoURL: null,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);
  return { checkingPhotoURL: loading, isPhotoExist, setIsPhotoExist };
};

export default useCheckPhotoURL;
