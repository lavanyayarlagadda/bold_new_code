import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedClient: null,
  selectedStatus: null,
};

const dropdownSlice = createSlice({
  name: "dropdown",
  initialState,
  reducers: {
    setSelectedClient: (state, action) => {
      state.selectedClient = action.payload;
    },
    setSelectedStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    clearSelections: (state) => {
      state.selectedClient = null;
      state.selectedStatus = null;
    },
  },
});

export const { setSelectedClient, setSelectedStatus, clearSelections } = dropdownSlice.actions;
export default dropdownSlice.reducer;
