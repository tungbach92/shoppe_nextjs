import axios from "../configs/axios";
import getCustomerID from "./getCustomerID";
import {getDefaultPaymentMethodID} from "./getDefaultPaymentMethodID";
import {getPaymentMethodList} from "./getPaymentMethodList";

export const updateCustomerBillingAddressStripe = async (user, shipInfos) => {
  const customerID = await getCustomerID(user);
  const defaultPaymentMethodID = await getDefaultPaymentMethodID(user);
  const paymentMethodList = await getPaymentMethodList(user);
  if (customerID && paymentMethodList && defaultPaymentMethodID) {
    let defaultshipInfo;
    let cardName = "";

    paymentMethodList.forEach((item) => {
      if (item.id === defaultPaymentMethodID) {
        cardName = item.billing_details.name;
      }
    });

    shipInfos.forEach((item) => {
      if (item.isDefault) {
        defaultshipInfo = { ...item };
      }
    });

    try {
      await axios({
        method: "POST",
        url: "/update-customer-billing-address",
        data: {
          customerID: customerID,
          userName: cardName.length > 0 ? cardName : defaultshipInfo.name,
          shipName: defaultshipInfo.name,
          phone: defaultshipInfo.phone,
          province: defaultshipInfo.province.name,
          district: defaultshipInfo.district.name,
          ward: defaultshipInfo.ward.name,
          street: defaultshipInfo.street,
        },
      });
    } catch (error) {
      alert(error);
    }
  }
};
