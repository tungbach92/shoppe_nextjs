import { useLayoutEffect, useState } from "react";
import { getPaymentMethodList } from "../services/getPaymentMethodList";

const usePaymentMethodList = (user, setDefaultPaymentMethodID) => {
  const [paymentMethodList, setPaymentMethodList] = useState([]);
  const [loading, setLoading] = useState(false);

  const deletePaymentMethod = (id) => {
    const newPaymentMethodList = paymentMethodList.filter(
      (item) => item.id !== id
    );
    setPaymentMethodList(newPaymentMethodList);
  };
  useLayoutEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const paymentMethodList = await getPaymentMethodList(user);
      if (!isMounted) {
        return;
      }
      setPaymentMethodList(paymentMethodList);
      if (paymentMethodList.length === 1) {
        setDefaultPaymentMethodID(paymentMethodList[0].id);
      }
      setLoading(false);
    })();
    return () => {
      isMounted = false;
    };
  }, [setDefaultPaymentMethodID, user]);
  return {
    paymentMethodList,
    setPaymentMethodList,
    deletePaymentMethod,
    paymentMethodListLoading: loading,
  };
};

export default usePaymentMethodList;
