import {useLayoutEffect, useState} from "react";
import {getDefaultPaymentMethodID} from "@/services/getDefaultPaymentMethodID";

const useDefaultPaymentMethodID = (user) => {
  const [defaultPaymentMethodID, setDefaultPaymentMethodID] = useState("");
  const [loading, setLoading] = useState(false);
  useLayoutEffect(() => {
    let isMounted = true;
    (async () => {
      setLoading(true);
      const defaultPaymentMethodID = await getDefaultPaymentMethodID(user);
      if (!isMounted) {
        return;
      }
      setLoading(false);
      setDefaultPaymentMethodID(defaultPaymentMethodID);
    })();
    return () => {
      isMounted = false;
    };
  }, [user]);
  return {
    defaultPaymentMethodID,
    setDefaultPaymentMethodID,
    defaultPaymentMethodIDLoading: loading,
  };
};

export default useDefaultPaymentMethodID;
