import getCustomerID from "./getCustomerID";
import axios from "../configs/axios";

export const getPaymentMethodList = async (user) => {
  const customerID = await getCustomerID(user);
  let paymentMethodList = [];
  if (!customerID) {
    return paymentMethodList;
  }
  try {
    const result = await axios({
      method: "POST",
      url: "/get-payment-method-list",
      data: { customerID: customerID },
    });
    paymentMethodList = result.data.paymentMethodList;
  } catch (error) {
    alert(error.message);
  }
  return paymentMethodList;
};
