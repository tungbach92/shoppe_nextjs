import { useState } from "react";
import { updateDefaultPaymentMethodIDToStripe } from "../services/updateDefaultPaymentMethodIDToStripe";

export const useUpdateDefaultPaymentMethodIDToStripe = () => {
  const [loading, setLoading] = useState(false);
  const updateDefaultPaymentMethodID = async (user, paymentMethodID) => {
    setLoading(true);
    const defaultPaymentMethodID = await updateDefaultPaymentMethodIDToStripe(
      user,
      paymentMethodID
    );
    setLoading(false);
    return defaultPaymentMethodID;
  };
  return {
    updateDefaultPaymentMethodID,
    updateDefaultPaymentMethodIDLoading: loading,
  };
};
