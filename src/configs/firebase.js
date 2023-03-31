import {initializeApp} from 'firebase/app';
import {getFirestore} from 'firebase/firestore';
import {getAuth} from "firebase/auth";
import {getStorage} from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAz3_V9bnetvEeV7vpgvNjzTsLHIf7n4jo",
  authDomain: "shopee-demo-c6d2b.firebaseapp.com",
  databaseURL:
    "https://shopee-demo-c6d2b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shopee-demo-c6d2b",
  storageBucket: "shopee-demo-c6d2b.appspot.com",
  messagingSenderId: "889142901917",
  appId: "1:889142901917:web:e00c1bfb3ab0cd151d6874",
  measurementId: "G-9G0B5LV3HD",
};

//create firebase app instance
const firebaseApp = initializeApp(firebaseConfig);
//create db
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)
const storage = getStorage(firebaseApp)
export {db, auth, storage};
