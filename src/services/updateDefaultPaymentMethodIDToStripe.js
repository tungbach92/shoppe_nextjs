import axios from "../configs/axios";
import getCustomerID from "./getCustomerID";

export const updateDefaultPaymentMethodIDToStripe = async (
  user,
  paymentMethodID
) => {
  const customerID = await getCustomerID(user);
  let defaultPaymentMethodID = "";
  if (!customerID) {
    return defaultPaymentMethodID;
  }
  try {
    const result = await axios({
      method: "POST",
      url: "/update-customer-payment-method",
      data: {
        customerID: customerID,
        paymentMethodID: paymentMethodID,
      },
    });
    defaultPaymentMethodID =
      result.data.customer.invoice_settings.default_payment_method;
  } catch (error) {
    alert(error.message);
  }
  return defaultPaymentMethodID;
};
