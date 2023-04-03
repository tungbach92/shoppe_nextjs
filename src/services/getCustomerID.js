import {userDocRef} from "@/common/dbRef";
import {getDoc} from "firebase/firestore";

export default async function getCustomerID(user) {
  let customerID = "";
  if (!user) return customerID;
  try {
    const doc = await getDoc(userDocRef(user?.uid));
    if (doc.exists()) {
      customerID = doc.data().customerID;
    }
  } catch (error) {
    alert(error.message);
  }
  return customerID;
}
