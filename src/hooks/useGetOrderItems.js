import {useLayoutEffect, useState} from "react";
import {orderRef} from "@/common/dbRef";
import {onSnapshot} from "firebase/firestore";

const useGetOrderItems = (user) => {
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const resetOrderItems = () => {
    setOrderItems([]);
  };

  useLayoutEffect(() => {
    let isMounted = true;
    if (!user?.uid) return setOrderItems([]);
    const observer = onSnapshot(orderRef(user?.uid),
      (snapshot) => {
        if (!isMounted) {
          setOrderItems([]);
          return;
        }
        if (snapshot.empty) {
          setOrderItems([]);
        } else {
          setOrderItems(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }))
          );
        }
        setLoading(false);
      },
      (err) => {
        alert("Lỗi lấy đơn hàng:" + err.message);
        setLoading(false);
      }
    );
    return () => {
      isMounted = false;
      observer();
    };
  }, [user]);
  return {orderItems, resetOrderItems, orderItemsLoading: loading};
};
export default useGetOrderItems;
