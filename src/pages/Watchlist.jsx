import { useSelector, useDispatch } from "react-redux";
import { unpinRoute } from "../features/watchlistSlice";
import { Link } from "react-router-dom";

function Watchlist() {
    // Destructure for using hook
  const dispatch = useDispatch();
  
  // Read the pinned routes from the vault
  const pinnedRoutes = useSelector((state) => state.watchlist);

  // to handle issue in loading of images using the url
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494412651409-8963ce7935a7";

  return (
    <>
      <div className="dashboard-header">
        <h1>Critical Focus Routes</h1>

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
                <p>🚛 Mode: <strong>{route.transportMode}</strong></p>
                <p>⚖️ Weight: {route.weightTons} Tons</p>
                <p style={{ color: "#ef4444", fontWeight: "bold" }}>☁️ CO2: {route.emissionsKg} kg</p>
                <p style={{ color: "#ef4444", fontWeight: "bold" }}>💶 Tariff: €{route.estimatedTariffEUR}</p>
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