import { db } from "../configs/firebase";
import {userDocRef} from "../common/dbRef";

export default async function getCustomerID(user) {
  let customerID = "";
  if (!user) return customerID;
  try {
    const doc = await userDocRef(user?.uid).get();
    if (doc.exists) {
      customerID = doc.data().customerID;
    }
  } catch (error) {
    alert(error.message);
  }
  return customerID;
}
