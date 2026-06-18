import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { pinRoute, unpinRoute } from "../features/watchlistSlice";


// The 'route' prop is passed down from the parent Shipments page, destructured i.e. (here) rather than props.route.something
// use just route.something
function RouteCard({ route, onDelete }) {

  // Reliable sea freight image
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494412651409-8963ce7935a7"; 

  // Check if someone is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Initialize Redux dispatcher
  const dispatch = useDispatch();

  // 2. Read the current watchlist from the Redux Vault
  const watchlist = useSelector((state) => state.watchlist);

  // 3. Check if THIS specific route is already inside the watchlist
  const isPinned = watchlist.some((item) => item.id === route.id);

  // 4. Function to handle pinning
  function handlePin() {
    // send complete route obj to store
    dispatch(pinRoute(route));
  }

  // 5. Function to handle unpinning (so they can toggle it right from the dashboard!)
  function handleUnpin() {
    // send to route id to store for unpinning
    dispatch(unpinRoute(route.id));
  }


  return (
    <div className="card">
      <img 
        src={route.image || DEFAULT_IMAGE} 
        alt={`${route.origin} to ${route.destination}`} 
        onError={(e) => {
          // Swap to default if broken
          e.target.src = DEFAULT_IMAGE; 
          // Prevent infinite loop if default also breaks
          e.target.onerror = null; 
        }}
      />
      
      <h3>{route.origin} → {route.destination}</h3>
      <p className="category">{route.productCategory}</p>
      
      <div className="card-metrics">
        <p>🚛 Mode: {route.transportMode}</p>
        <p>☁️ CO2: {route.emissionsKg} kg</p>
        <p>💶 Tariff: €{route.estimatedTariffEUR}</p>
      </div>

      <div className="card-actions">
        {/*
        Dynamic routing using dynamic id parameter,
        on clicking this link BY USER, render 'ShipmentDetails' component 
        */}
        {/* view feature available to all */}
        <Link className="view-btn" to={`/shipments/${route.id}`}>View Route Details</Link>


        {/* edit, delete feature only for logged in users : conditional rendering */}
        {user && (
          <>
            <Link className="edit-btn" to={`/edit-shipment/${route.id}`}>Edit Route Details</Link>
            <button className="delete-btn" onClick={() => onDelete(route.id, route.transportMode, route.origin, route.destination)}>
              Delete Route
            </button>
          </>
        )}
      </div>

      {/* Watchlist Pin Button Only for logged-in users*/}
      {user && (
        <div style={{ padding: "0 15px 15px 15px" }}>
          {/* if pinned: show pinned button, if clicked triggers fn to unpin */}
          {isPinned ? (
            <button className="pinned-btn" onClick={handleUnpin}>
              📌 Pinned to Watchlist
            </button>
            // if unpinned, show pin button, if clicked triggeres fn to pin
          ) : (
            <button className="pin-btn" onClick={handlePin}>
              ⭐ Pin to Watchlist
            </button>
          )}
        </div>
      )}

    </div>
  );
}

export default RouteCard;