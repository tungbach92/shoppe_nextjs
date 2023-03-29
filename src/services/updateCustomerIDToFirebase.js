import { db } from "../configs/firebase";
import {userDocRef} from "../common/dbRef";

export const updateCustomerIDToFirebase = async (user, customerID) => {
  if (!user || !customerID) {
    return;
  }
  try {
    await userDocRef(user?.uid).set({
      customerID: customerID,
    });
  } catch (error) {
    alert("customerID:" + error.message);
  }
};
