import {userDocRef} from "@/common/dbRef";
import {setDoc} from "firebase/firestore";

export const updateCustomerIDToFirebase = async (user, customerID) => {
  if (!user || !customerID) {
    return;
  }
  try {
    await setDoc(userDocRef(user?.uid), {
      customerID: customerID,
    });
  } catch (error) {
    alert("customerID:" + error.message);
  }
};
