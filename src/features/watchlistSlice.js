import { createSlice } from "@reduxjs/toolkit";

// created a Slice(department in the store-global vault)
export const watchlistSlice = createSlice({
    // this name would be used by useDispatch (send data to store): to update state value
  name: "watchlist",
  
  // The initial state is just an empty array (no pinned routes yet)
  initialState: [],
  
  // Reducers are the "Bank Tellers" - the functions that actually change the data (similar to setstate() in react)
  reducers: {
    
    // Action 1: Pinning a route to the watchlist
    pinRoute: (state, action) => {
      // 'action.payload' is the entire route object we click on to save (payload : data sent by user)
      const newRoute = action.payload;

      // Look through our current state to see if this EXACT route already exists (checking for duplicates) using find() : returns true/false
      const exists = state.find((route) => route.id === newRoute.id);

      // if not a duplicate, then save to the state   
      if (!exists) {
        // use .push() to safely add the item
        state.push(newRoute); 
      } else {
        // If its duplicate don't save , alert the user 
        alert("This specific route is already pinned to your Watchlist!");
      }
    },

    // Action 2: Unpinning a route
    unpinRoute: (state, action) => {
      // 'action.payload' will be the ID of the route we want to remove
      // filter() : to dynamically update the watchlist [] by ignoring routes we want to unpin
      return state.filter((route) => {
        return route.id !== action.payload
      });
    }

  }
});

// export the "Actions" (so our buttons can trigger them) via Destructuing (extracting values from obj/array and store in a variable)
export const { pinRoute, unpinRoute } = watchlistSlice.actions;

//export the "Reducer" (so the Store can use it)
export default watchlistSlice.reducer;