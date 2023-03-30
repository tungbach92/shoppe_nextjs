import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { cartApi } from "@/services/cartApi";
import {cartReducer} from "@/redux/cartSlice";
import {searchReducer} from "@/redux/searchSlice";

const rootReducer = {
  cart: cartReducer,
  [cartApi.reducerPath]: cartApi.reducer,
  search: searchReducer,
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      cartApi.middleware
    ),
});
setupListeners(store.dispatch);
