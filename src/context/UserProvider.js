import React, {useCallback, useContext} from "react";
import {useCheckFirebaseIdTokenAuthTime} from "@/hooks/useCheckFirebaseIdTokenAuthTime";
import {useDispatch, useSelector} from "react-redux";
import {resetCart} from "@/redux/cartSlice";
import {useAddCartToFireStoreMutation} from "@/services/cartApi";
import useGetUserByObserver from "@/hooks/useGetUserByObserver";
import useCheckPhotoURL from "@/hooks/useCheckPhotoURL";
import {useRouter} from "next/router";
import {signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth"
import {auth} from "@/configs/firebase";

const UserContext = React.createContext();
export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({children}) => {
  const router = useRouter()
  const {user, userLoading} = useGetUserByObserver();
  const {checkingPhotoURL, isPhotoExist, setIsPhotoExist} =
    useCheckPhotoURL(user);
  const cartProducts = useSelector((state) => state.cart.products);
  const [addCartToFireStore] = useAddCartToFireStoreMutation();
  const dispatch = useDispatch();
  const signOut = useCallback(async () => {
    addCartToFireStore({user, cartProducts});
    dispatch(resetCart());
    await auth.signOut();
    await router.replace('/login')
  }, [addCartToFireStore, dispatch, user]);

  useCheckFirebaseIdTokenAuthTime(user, signOut);

  const signIn = ({email, password}) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = ({email, password}) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const value = {
    user,
    userLoading,
    checkingPhotoURL,
    isPhotoExist,
    setIsPhotoExist,
    signIn,
    signOut,
    register,
  };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
