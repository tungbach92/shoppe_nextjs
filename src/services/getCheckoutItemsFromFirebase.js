import {checkoutDocRef} from "@/common/dbRef";

export const getCheckoutItemsFromFirebase = (user) => {
  return user?.uid ? checkoutDocRef(user.uid).get() : Promise.reject();
};
