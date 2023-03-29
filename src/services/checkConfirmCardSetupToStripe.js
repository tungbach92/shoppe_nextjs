import { result } from "lodash";

export const checkConfirmCardSetupToStripe = async (
  stripe,
  shipInfos,
  setUpIntentSecret,
  cardEl,
  cardName,
  user,
  phone
) => {
  try {
    let result = null;
    let defaultshipInfo;
    shipInfos.forEach((item) => {
      if (item.isDefault) {
        defaultshipInfo = { ...item };
      }
    });
    result = await stripe.confirmCardSetup(setUpIntentSecret, {
      payment_method: {
        card: cardEl,
        billing_details: {
          address: {
            state: defaultshipInfo?.province.name || "",
            city: defaultshipInfo?.district.name || "",
            line1: defaultshipInfo?.ward.name || "",
            line2: defaultshipInfo?.street || "",
            country: "VN",
            postal_code: 10000,
          },
          name: cardName,
          email: user.email,
          phone: phone,
        },
      },
    });
    return result;
  } catch (error) {
    alert(error.message);
  }
};
