import React, {useContext, useEffect, useReducer} from "react";
import {ACTIONTYPES, CHECKOUT_ACTIONTYPES} from "@/constants/actionType";
import {getCheckoutItemsFromFirebase} from "@/services/getCheckoutItemsFromFirebase";
import {useUser} from "./UserProvider";

const CheckoutContext = React.createContext();
export const useCheckoutContext = () => {
  return useContext(CheckoutContext);
};

const INITIAL_STATE = {checkoutItems: [], loading: false, error: ""};

const checkoutReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ACTIONTYPES.FETCH_PENDING:
      return {...state, loading: true};
    case ACTIONTYPES.FETCH_FULFILLED:
      return {...state, loading: false, checkoutItems: action.payload};
    case ACTIONTYPES.FETCH_REJECTED:
      return {...state, loading: false, error: action.error};
    case CHECKOUT_ACTIONTYPES.ADD_CHECKOUT:
      return {...state, checkoutItems: action.payload};
    default:
      return state;
  }
};

const CheckoutProvider = ({children}) => {
  const {user} = useUser();
  const [state, dispatch] = useReducer(checkoutReducer, INITIAL_STATE);
  const {checkoutItems} = state;


  useEffect(() => {
    // get checkout item from localstorage or firebase
    dispatch({type: ACTIONTYPES.FETCH_PENDING});
    if (getCheckoutItemsFromStorage().length > 0) {
      const checkoutItems = getCheckoutItemsFromStorage();
      dispatch({type: ACTIONTYPES.FETCH_FULFILLED, payload: checkoutItems});
    } else {
      getCheckoutItemsFromFirebase(user)
        .then((doc) => {
          if (doc.exists) {
            const checkoutItems = doc.data().basket;
            dispatch({
              type: ACTIONTYPES.FETCH_FULFILLED, payload: checkoutItems,
            });
          }
        })
        .catch((err) => {
          dispatch({type: ACTIONTYPES.FETCH_REJECTED, error: err?.message ? err.message : err});
        });
    }
  }, [user]);

  const saveCheckoutItemsToStorage = () => {
    localStorage.setItem("checkoutProduct", JSON.stringify(checkoutItems === null ? [] : checkoutItems));
  };

  const getCheckoutItemsFromStorage = () => {
    let savedCheckoutItems = localStorage.getItem("checkoutProduct");
    return savedCheckoutItems === null ? [] : JSON.parse(savedCheckoutItems);
  };

  const value = {
    checkoutState: state, checkoutDispatch: dispatch,
  };
  return (<CheckoutContext.Provider value={value}>
    {children}
  </CheckoutContext.Provider>);
};

export default CheckoutProvider;
