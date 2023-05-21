import {checkoutDocRef} from "@/common/dbRef";
import {getDoc} from "firebase/firestore";

export const getCheckoutItemsFromFirebase = (user) => {
  return user?.uid ? getDoc(checkoutDocRef(user.uid)) : Promise.reject('no user');
};
