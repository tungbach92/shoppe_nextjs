import axios from "../configs/axios";
import getCustomerID from "./getCustomerID";

export const getDefaultPaymentMethodID = async (user) => {
  const customerID = await getCustomerID(user);
  let defaultPaymentMethodID = "";
  if (!customerID) {
    return defaultPaymentMethodID;
  }
  try {
    const result = await axios({
      method: "POST",
      url: "/retrieve-customer-by-id",
      data: { customerID: customerID },
    });
    defaultPaymentMethodID =
      result.data.customer.invoice_settings.default_payment_method;
    defaultPaymentMethodID = defaultPaymentMethodID
      ? defaultPaymentMethodID
      : result.data.customer.default_source;
  } catch (error) {
    alert(error.message);
  }

  return defaultPaymentMethodID;
};
