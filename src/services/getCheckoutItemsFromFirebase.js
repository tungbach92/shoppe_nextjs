import {db} from "../configs/firebase";
import {checkoutDocRef} from "../common/dbRef";

export const getCheckoutItemsFromFirebase = (user) => {
  return checkoutDocRef(user?.uid).get();
};
