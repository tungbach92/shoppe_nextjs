import {useLayoutEffect, useState} from "react";
import {onSnapshot} from "firebase/firestore";
import {shipInfoDocRef} from "../common/dbRef";

const useGetShipInfos = (user) => {
  const [shipInfos, setShipInfos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  useLayoutEffect(() => {
    let isMounted = true;
    const shipInfosObserver =
      onSnapshot(shipInfoDocRef(user?.uid),
        (doc) => {
          if (!isMounted) {
            return;
          }
          if (doc.exists) {
            const shipInfos = doc.data().shipInfos;
            setShipInfos(shipInfos);
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

  const updateShipInfoToFirebase = async (shipInfos) => {
    try {
      setUpdateLoading(true);
      const doc = await shipInfoDocRef(user?.uid).get();
      if (!doc.exists) {
        await shipInfoDocRef(user?.uid).set({shipInfos: []});
      } else {
        await shipInfoDocRef(user?.uid).update({
          shipInfos: shipInfos,
        });
      }
    } catch (error) {
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
