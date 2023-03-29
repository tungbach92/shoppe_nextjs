import axios from "../configs/axios";

export const detachPaymentMethodID = async (customerID, paymentMethodID) => {
  let paymentMethod;
  if (!customerID || !paymentMethodID) {
    return paymentMethod;
  }
  try {
    const result = await axios({
      method: "POST",
      url: "/detach-payment-method",
      data: { paymentMethodID: paymentMethodID, customerID: customerID },
    });
    paymentMethod = result.data.paymentMethod;
  } catch (error) {
    alert(error.message);
  }
  return paymentMethod;
};
