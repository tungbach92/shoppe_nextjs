import { useEffect } from "react";
import { useState } from "react";
import getCustomerID from "../services/getCustomerID";

export const useCustomerID = (user) => {
  const [customerID, setCustomerID] = useState("");

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const customerID = await getCustomerID(user);
      if (!isMounted) {
        return;
      }
      setCustomerID(customerID);
    })();
    return () => {
      isMounted = false;
    };
  }, [user]);
  return { customerID };
};
