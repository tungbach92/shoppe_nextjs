import React, {useCallback, useContext, useEffect, useState} from "react";
import {auth} from "../configs/firebase";
import useGetUserByObserver from "../hooks/useGetUserByObserver";
import useCheckPhotoURL from "../hooks/useCheckPhotoURL";
// import {useNavigate} from "react-router-dom";
import {useCheckFirebaseIdTokenAuthTime} from "../hooks/useCheckFirebaseIdTokenAuthTime";
import {useDispatch, useSelector} from "react-redux";
import {resetCart} from "../redux/cartSlice";
import {useAddCartToFireStoreMutation} from "../services/cartApi";

const UserContext = React.createContext();
export const useUser = () => {
  return useContext(UserContext);
};

const UserProvider = ({children}) => {

  const {user, userLoading} = useGetUserByObserver();
  const {checkingPhotoURL, isPhotoExist, setIsPhotoExist} =
    useCheckPhotoURL(user);
  const cartProducts = useSelector((state) => state.cart.products);
  const [addCartToFireStore] = useAddCartToFireStoreMutation();
  const dispatch = useDispatch();
  //TODO
  // const navigate = useNavigate();

  const signOut = useCallback(async () => {
    addCartToFireStore({user, cartProducts});
    dispatch(resetCart());
    await auth.signOut();
    // navigate("/login", { replace: true });
  }, [addCartToFireStore, dispatch, user]);

  useCheckFirebaseIdTokenAuthTime(user, signOut);

  const signIn = ({email, password}) => {
    return auth.signInWithEmailAndPassword(email, password);
  };

  const register = ({email, password}) => {
    return auth.createUserWithEmailAndPassword(email, password);
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
