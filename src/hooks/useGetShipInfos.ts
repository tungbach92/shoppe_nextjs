import {useLayoutEffect, useState} from "react";
import {getDoc, onSnapshot, setDoc, updateDoc} from "firebase/firestore";
import {shipInfoDocRef} from "@/common/dbRef";

const useGetShipInfos = (user: any) => {
  const [shipInfos, setShipInfos] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false);

  useLayoutEffect(() => {
    let isMounted = true;
    const shipInfosObserver =
      onSnapshot(shipInfoDocRef(user?.uid),
        (doc) => {
          if (!isMounted) {
            return;
          }
          if (doc.exists()) {
            const shipInfos = doc?.data()?.shipInfos;
            setShipInfos(shipInfos || []);
          } else {
            setShipInfos([]);
          }
          setLoading(false);
        },
        (err) => {
          alert("Lỗi lấy địa chỉ ship:" + err.message);
          setLoading(false);
        }
      );
    return () => {
      isMounted = false;
      shipInfosObserver();
    };
  }, [user]);

  const updateShipInfoToFirebase = async (shipInfos: any) => {
    try {
      setUpdateLoading(true);
      const doc = await getDoc(shipInfoDocRef(user?.uid));
      if (!doc.exists) {
        await setDoc(shipInfoDocRef(user?.uid), {shipInfos: []});
      } else {
        await updateDoc(shipInfoDocRef(user?.uid), {
          shipInfos: shipInfos,
        });
      }
    } catch (error: any) {
      alert("Lôi cập nhật địa chỉ ship:" + error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  return {
    shipInfos,
    setShipInfos,
    shipInfosLoading: loading,
    shipInfosUpdateLoading: updateLoading,
    updateShipInfoToFirebase,
  };
};
export default useGetShipInfos;
