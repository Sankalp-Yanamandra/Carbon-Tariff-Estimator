import { useSelector, useDispatch } from "react-redux";
import { unpinRoute } from "../features/watchlistSlice";
import { Link } from "react-router-dom";

// importing svg icons
import { FaTruck, FaPlane, FaShip, FaWeightHanging, FaCloud, FaEuroSign } from "react-icons/fa";

function Watchlist() {
    // Destructure for using hook
  const dispatch = useDispatch();
  
  // Read the pinned routes from the vault
  const pinnedRoutes = useSelector((state) => state.watchlist);

  // to handle issue in loading of images using the url
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494412651409-8963ce7935a7";

  // render icon based on mode of transport
const getTransportIcon = (mode) => {
    if (mode === "Air Freight") return <FaPlane style={{ marginRight: "8px", color: "#64748b" }} />;
    if (mode === "Truck") return <FaTruck style={{ marginRight: "8px", color: "#64748b" }} />;
    return <FaShip style={{ marginRight: "8px", color: "#64748b" }} />;
  };


  return (
    <>
      <div className="dashboard-header">
        <h1>My Critical Shipment Routes</h1>

        {/* Link : when user clicks, takes them back to `Shipments` page */}
        <Link to="/shipments" className="back-link" style={{ fontSize: "1rem" }}>
          ← Back to All Shipments
        </Link>
      </div>

        {/* conditional rendering of pinnned routes  */}

       {/* if no pinned routes found : display appropriate msg guiding the usr */}
      {pinnedRoutes.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2 style={{ color: "#64748b" }}>Your Watchlist is empty.</h2>
          <p style={{ marginTop: "10px" }}>Go to your Shipment Routes and click "⭐ Pin to Watchlist" to track critical routes here.</p>
          {/* <Link> when clicked by user, take them back to `Shipments` page */}
          <Link to="/shipments" className="add-btn" style={{ marginTop: "20px" }}>View All Routes</Link>
        </div>
        // if pinned routes found, display them using map()
      ) : (
        <div className="destinations">
          {pinnedRoutes.map((route) => (
            <div key={route.id} className="card" style={{ border: "2px solid #f59e0b" }}>
              <img 
                src={route.image || DEFAULT_IMAGE} 
                alt="Route" 
                onError={(loaderror) => {
                  // Swap to default if broken
                  loaderror.target.src = DEFAULT_IMAGE;
                  // Prevent infinite loop if default also breaks
                  loaderror.target.onerror = null;
                }}
              />
              <h3>{route.origin} → {route.destination}</h3>
              <p className="category">{route.productCategory}</p>
              
              <div className="card-metrics">
<p style={{ display: "flex", alignItems: "center" }}>
                  {getTransportIcon(route.transportMode)}
                  <strong>Mode:</strong> <span style={{ marginLeft: "5px" }}>{route.transportMode}</span>
                </p>

                <p style={{ display: "flex", alignItems: "center" }}>
                  <FaWeightHanging style={{ marginRight: "8px", color: "#64748b" }} />
                  <strong>Weight:</strong> <span style={{ marginLeft: "5px" }}>{route.weightTons} Tons</span>
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
                {/* <Link> when clicked by user takes to `Shipment-Details` page for detailed analysis */}
                <Link className="view-btn" to={`/shipments/${route.id}`}>Full Details</Link>
                {/* Button : to unpin the route */}
                <button 
                  className="delete-btn" 
                  onClick={() => dispatch(unpinRoute(route.id))}
                >
                  Unpin Route
                </button>

              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Watchlist;