import { configureStore } from "@reduxjs/toolkit";


import watchlistReducer from "../features/watchlistSlice";

// configureStore creates our giant global vault
export const store = configureStore({
    // fn to manipulate states globally
  reducer: {
    // We register our specific "department" (slice) in the store : watchlist (name must match the name defined in the slice)
    watchlist: watchlistReducer,
  },
});