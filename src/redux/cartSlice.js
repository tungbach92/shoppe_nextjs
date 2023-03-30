import { createSlice } from "@reduxjs/toolkit";
import {cartApi} from "@/services/cartApi";

const saveCartItemsToStorage = (cartProduct) => {
  const savedCartItems = cartProduct.map((item) => ({
    ...item,
    similarDisPlay: undefined,
    variationDisPlay: undefined,
  }));
  localStorage.setItem("cartProduct", JSON.stringify(savedCartItems));
};

const getCartItemsFromStorage = () => {
  if (typeof window === 'undefined') return []
  let savedCartItems = localStorage.getItem("cartProduct");
  return savedCartItems ? JSON.parse(savedCartItems) : savedCartItems;
};

const products = getCartItemsFromStorage()
  ? getCartItemsFromStorage().map((item) => ({
      ...item,
      similarDisPlay: false,
      variationDisPlay: false,
    }))
  : [];

const initialState = {
  products,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProducts: (state, action) => {
      state.products.push(action.payload);
      saveCartItemsToStorage(state.products);
    },
    updateProducts: (state, action) => {
      state.products = action.payload;
      saveCartItemsToStorage(state.products);
    },
    deleteProducts: (state, action) => {
      const newProducts = state.products.filter(
        (item) =>
          item.id !== action.payload.id ||
          item.variation !== action.payload.variation
      );
      state.products = newProducts;
      saveCartItemsToStorage(state.products);
    },
    deleteSelectedProducts: (state, action) => {
      state.products = action.payload;
      saveCartItemsToStorage(state.products);
    },
    resetCart: (state) => {
      state.products = [];
      localStorage.clear();
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      cartApi.endpoints.fetchCart.matchFulfilled,
      (state, action) => {
        if (state.products.length === 0) {
          state.products = action.payload;
        }
      }
    );
  },
});

export const {
  addProducts,
  updateProducts,
  deleteProducts,
  deleteSelectedProducts,
  resetCart,
} = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
