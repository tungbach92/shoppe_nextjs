import axios from "../configs/axios";

export const createSetupIntentAndCustomerIDInStripe = async (
  cardName,
  user,
  customerID
) => {
  try {
    const response = await axios({
      method: "POST",
      url: "/create-setup-intent",
      data: {
        name: cardName,
        email: user.email,
        customerID: customerID,
      },
    });
    return response.data;
  } catch (error) {
    alert(error.message);
  }
};
