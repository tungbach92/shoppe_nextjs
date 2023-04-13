import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchInput: "",
  searchItems: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    changeSearchInput: (state, action) => {
      state.searchInput = action.payload;
    },
    changeSearchItems: (state, action) => {
      if (state.searchInput.length === 0) {
        state.searchItems = [];
        return;
      }
      const items = action.payload;
      state.searchItems = items.filter((item) =>
        item.name.toLowerCase().includes(state.searchInput.trim().toLowerCase())
      );
    },
  },
});

export const { changeSearchInput, changeSearchItems } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
