import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { pinRoute, unpinRoute } from "../features/watchlistSlice";
import { toast } from "react-toastify";

// IMPORT REACT-ICONS 
import { FaTruck, FaPlane, FaShip, FaCloud, FaEuroSign } from "react-icons/fa";

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

    //send alert to user
    toast.success(`📌 PINNED ${route.origin} ⟶ ${route.destination} via ${route.transportMode}`)
  }

  // 5. Function to handle unpinning (so they can toggle it right from the dashboard!)
  function handleUnpin() {
    // send to route id to store for unpinning
    dispatch(unpinRoute(route.id));

    toast.warning(`UNPINNED ${route.origin} ⟶ ${route.destination} via ${route.transportMode}`)
  }

  // render correct SVG based on mode of transport
const getTransportIcon = (mode) => {
    if (mode === "Air Freight") return <FaPlane style={{ marginRight: "8px", color: "#64748b" }} />;
    if (mode === "Truck") return <FaTruck style={{ marginRight: "8px", color: "#64748b" }} />;
    return <FaShip style={{ marginRight: "8px", color: "#64748b" }} />;
  };


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
      {/* Implement the clean SVG icons with Flexbox alignment */}
        <p style={{ display: "flex", alignItems: "center" }}>
          {getTransportIcon(route.transportMode)}
          <strong>Mode:</strong> <span style={{ marginLeft: "5px" }}>{route.transportMode}</span>
        </p>
        
        <p style={{ display: "flex", alignItems: "center", color: "#ef4444" }}>
          <FaCloud style={{ marginRight: "8px" }} /> 
          <strong>CO2:</strong> <span style={{ marginLeft: "5px" }}>{route.emissionsKg} kg</span>
        </p>
        
        <p style={{ display: "flex", alignItems: "center", color: "#f59e0b" }}>
          <FaEuroSign style={{ marginRight: "8px" }} /> 
          <strong>Tariff:</strong> <span style={{ marginLeft: "5px" }}>€{route.estimatedTariffEUR}</span>
        </p>
      </div>

      <div className="card-actions">
        {/*
        Dynamic routing using dynamic id parameter,
        on clicking this link BY USER, render 'ShipmentDetails' component 
        */}
        {/* view feature available to all */}
        <Link className="view-btn" to={`/shipments/${route.id}`}>View Route Details</Link>


        {/* edit, delete, pin feature only for logged in users : conditional rendering */}
        <div style={{ padding: "0 15px 15px 15px" }}>
        
          {/* If user IS logged in, show the normal functional buttons */}
          {user ? (
            isPinned ? (
              <button className="pinned-btn" onClick={handleUnpin}>
                📌 Pinned to Watchlist
              </button>
            ) : (
              <button className="pin-btn" onClick={handlePin}>
                ⭐ Pin to Watchlist
              </button>
            )
          ) : (
            
            /* If user IS NOT logged in, show a "teaser" button that triggers a toast */
            <button 
              className="pin-btn" 
              onClick={() => toast.info("🔒 Please log in to pin routes to your Watchlist!")}
              // Make it look slightly disabled
              style={{ opacity: 0.8, borderStyle: "dashed" }} 
            >
              ⭐ Pin to Watchlist
            </button>
            
          )}
          </div>
      </div>
  </div>
  );
}

export default RouteCard;