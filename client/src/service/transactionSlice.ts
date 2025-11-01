import { createSlice } from "@reduxjs/toolkit";
import type { transactionType } from "../types/transaction";
import type { PayloadAction } from "@reduxjs/toolkit";

interface transactionState {
  list: transactionType[];
}

const initialState: transactionState = {
  list: [],
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<transactionType>) => {
      state.list.push(action.payload);
    },
    removeTransaction: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((txn) => txn._id !== action.payload);
    },
    setTransaction: (state, action: PayloadAction<transactionType[]>) => {
      state.list = action.payload;
    },
    updateTransaction: (state, action: PayloadAction<transactionType>) => {
      const index = state.list.findIndex(
        (txn) => txn._id === action.payload._id
      );
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    }
  },
});

export const {
    addTransaction, removeTransaction, setTransaction, updateTransaction
} = transactionSlice.actions;

export default transactionSlice.reducer;
