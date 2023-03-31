import {collection, doc, orderBy, query} from "firebase/firestore";
import {db} from "@/configs/firebase";


const productCollRef = () => collection(db, 'products')

const productDocRef = (id: string) => doc(db, 'products', id)
const productQuery = () => {
  return query(
    collection(db, "products"),
  );
};

const userRef = () => {
  return query(collection(db, "users"))
}

const userDocRef = (userId: string) => doc(db, "users", userId)
const shipInfoDocRef = (userId: string) => {
  return doc(db, "users", `/${userId}`, 'shipInfos', "shipInfoDoc")
}
const checkoutDocRef = (userId: string) => {
  return doc(db, "users", userId, 'checkout', 'checkoutItems')
}

const cartDocRef = (userId: string) => doc(db, 'users', userId, 'cart', 'cartItems')

const orderRef = (userId: string) => {
  return query(collection(db, 'users', userId, 'orders'),
    orderBy("created", "desc")
  )
}
const orderDocRef = (userId: string, orderId: string) => doc(db, 'users', userId, 'orders', orderId)
const searchHistoryDocRef = (userId: string) => doc(db, 'users', userId, 'searchHistory', 'searchHistoryItems')
const infoDocRef = (userId: string) => doc(db, 'users', userId, 'infos', 'infoItems')


export {
  productCollRef,
  productDocRef,
  productQuery,
  shipInfoDocRef,
  checkoutDocRef,
  cartDocRef,
  userDocRef,
  orderRef,
  searchHistoryDocRef,
  infoDocRef,
  orderDocRef
}
