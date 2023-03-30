import {createApi, fakeBaseQuery} from "@reduxjs/toolkit/query/react";
import {cartDocRef} from "@/common/dbRef";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    fetchCart: builder.query({
      async queryFn(user) {
        try {
          const doc = await cartDocRef(user?.uid).get();
          let products = [];
          if (doc.exists) {
            products = doc.data().basket.map((item) => ({
              ...item,
              similarDisPlay: false,
              variationDisPlay: false,
            }));
          }
          return {data: products};
        } catch (error) {
          // alert("Lỗi lấy giỏ hàng từ firestore:" + error.message);
          return {error: error};
        }
      },
    }),
    addCartToFireStore: builder.mutation({
      async queryFn({user, cartProducts}) {
        try {
          let savedCartItems = [];
          const created = Date.now();
          if (cartProducts?.length > 0) {
            savedCartItems = cartProducts.map((item) => {
              const {similarDisPlay, variationDisPlay, ...rest} = item;
              return rest;
            });
          }
          await cartDocRef(user?.uid).set({
              basket: savedCartItems,
              created: created,
            });
          return {data: "ok"};
        } catch (error) {
          //   alert("Lỗi lưu giỏ hàng:" + error.message);
          return {error: error};
        }
      },
    }),
  }),
});
export const {useFetchCartQuery, useAddCartToFireStoreMutation} = cartApi;
