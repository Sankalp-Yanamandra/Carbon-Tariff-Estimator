import { useEffect, useState } from "react";
import api from "../services/api";
import RouteCard from "../components/RouteCard";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// 1. Import the spinner
import { Oval } from "react-loader-spinner";

function Shipments() {
  // states to store route data
  const [routes, setRoutes] = useState([]);

  // check if any user logged in (only logged in users will be allowed to add-shipments)
  const user = JSON.parse(localStorage.getItem("user"));

// 2. Add a loading state, defaulting to true
  const [isLoading, setIsLoading] = useState(true);


  // Fetch the data as soon as the page loads i.e. ONly Once
  useEffect(() => {
    getRoutes();
  }, []);

  async function getRoutes() {
    try {
      // fetch data from :  /routes get converted to : http://localhost:3000/routes
      const response = await api.get("/routes");
      // Save the response data into our state
      setRoutes(response.data);
    } catch (error) {
      toast.warning('Failed to Fetch routes.')
      console.log("Error fetching routes : ", error);
    }
    finally {
      // 3. The finally block runs whether the request succeeds OR fails, 
      // ensuring the spinner always turns off!
      setIsLoading(false); 
    }
  }

  // fn to delete shipment route :HTTP DELETE request
  async function deleteRoute(route_id, route_transport_mode,route_origin, route_destination) {
    try{
        // HTTP DELETE req to : http://localhost:3000/routes => baseurl/routes
        await api.delete(`/routes/${route_id}`)

        // send alert to user to inform about the deletion
        toast.error(`Custom ${route_transport_mode} route from ${route_origin} to ${route_destination} Deleted Successfully.`)

        // Update UI by filter() instead of HTTP GET request
        setRoutes(routes.filter((route) => {
          return route.id !== route_id;
        }))
    }
    catch(error)
    {
      toast.warning(`Error deleting Route ID : ${route_id} due to : ${error}`)
      console.log(`Error deleting Route ID : ${route_id} due to : ${error}`)
    }
  }

  // 4. Render the spinner if we are still loading data
  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
        <Oval
          height={80}
          width={80}
          color="#3b82f6"
          secondaryColor="#bfdbfe"
          strokeWidth={4}
        />
        <h2 style={{ marginTop: "20px", color: "#475569" }}>Loading Global Logistics Network...</h2>
      </div>
    );
  }



  return (
    <>
      <div className="dashboard-header">
        
        <h1>Active Supply Chain Routes</h1>

      {user ? (
        // if logged in, allows this feature
          <Link to="/add-shipment" className="add-btn">+ Draft New Route</Link>
        ) : (
          // A locked version of the Add button for logged-out users */
          <Link to="/login" className="add-btn" style={{ background: "#64748b" }}>
            🔒 Login to Draft Routes
          </Link>
        )}
      </div>

        {/* A msg informing users about features they want access if they login, followed by a link that directs them to register page */}
      {!user && (
        <div style={{
          background: "#f8fafc", 
          border: "2px dashed #cbd5e1", 
          padding: "20px", 
          textAlign: "center", 
          borderRadius: "10px",
          marginBottom: "30px"
        }}>
          <h3 style={{ color: "#0f172a", marginBottom: "10px" }}>Want to customize your logistics?</h3>
          <p style={{ color: "#475569", marginBottom: "15px" }}>
            Create a free corporate account to draft custom routes, edit existing route details, remove routes which don't fit in your business area, and pin high-priority routes, critical for your business to your personal Watchlist.
          </p>
          <Link to="/register" style={{ color: "#2563eb", fontWeight: "bold", textDecoration: "none" }}>
            Create an Account →
          </Link>
        </div>
      )}



      <div className="destinations">
        {/* Loop through our data and create a card for each route */}
        {routes.map((route) => (
          // pass route data and delete fn as props to RouteCard
          <RouteCard key={route.id} route={route} onDelete={deleteRoute}/>
        ))}
      </div>
    </>
  );
}

export default Shipments;