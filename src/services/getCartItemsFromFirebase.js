import { db } from "../configs/firebase";
import {cartDocRef} from "../common/dbRef";

const getCartItemsFromStorage = () => {
  let savedCartItems = localStorage.getItem("cartProduct");
  return savedCartItems ? JSON.parse(savedCartItems) : savedCartItems;
};

export const getCartItemsFromFirebase = async (user) => {
  let cartItems = [];

  const savedCartItems = getCartItemsFromStorage();
  if (savedCartItems) {
    cartItems = savedCartItems.map((item) => ({
      ...item,
      similarDisPlay: false,
      variationDisPlay: false,
    }));
    return cartItems;
  }

  try {
    const doc = cartDocRef(user?.uid).get();

    if (doc.exists) {
      cartItems = doc.data().basket;
      cartItems = cartItems.map((item) => ({
        ...item,
        similarDisPlay: false,
        variationDisPlay: false,
      }));
    }
  } catch (error) {
    alert("Lỗi lấy giỏ hàng từ firestore:" + error.message);
  }

  return cartItems;
};
