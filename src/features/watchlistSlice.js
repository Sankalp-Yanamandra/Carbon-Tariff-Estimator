import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

// If there is saved data, parse it. If not, default to an empty array.
const initialState = JSON.parse(localStorage.getItem("watchlist")) || [];

// created a Slice(department in the store-global vault)
export const watchlistSlice = createSlice({
    // this name would be used by useDispatch (send data to store): to update state value
  name: "watchlist",
  
  // The initial state : check local storage for any data, if there get it else take empty
  initialState,
  
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

        // 2. SAVE TO LOCALSTORAGE: Stringify the array and save it permanently
        localStorage.setItem("watchlist", JSON.stringify(state));

      } else {
        // If its duplicate don't save , alert the user 
        toast.error("This specific route is already pinned to your Watchlist!")
      }
    },

    // Action 2: Unpinning a route
    unpinRoute: (state, action) => {
      // 'action.payload' will be the ID of the route we want to remove
      // filter() : to dynamically update the watchlist [] by ignoring routes we want to unpin
      // Filter out the deleted route
      const updatedWatchlist = state.filter((route) => route.id !== action.payload);

      // 3. UPDATE LOCALSTORAGE: Overwrite the old saved data with the new array
      localStorage.setItem("watchlist", JSON.stringify(updatedWatchlist));

      toast.warning(`Unpinned Route from watchlist`)
      // Return the updated state to Redux
      return updatedWatchlist;
    }

  }
});

// export the "Actions" (so our buttons can trigger them) via Destructuing (extracting values from obj/array and store in a variable)
export const { pinRoute, unpinRoute } = watchlistSlice.actions;

//export the "Reducer" (so the Store can use it)
export default watchlistSlice.reducer;