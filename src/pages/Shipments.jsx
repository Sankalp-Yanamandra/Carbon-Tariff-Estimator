import { useEffect, useState } from "react";
import api from "../services/api";
import RouteCard from "../components/RouteCard";
import { Link } from "react-router-dom";


function Shipments() {
  // states to store route data
  const [routes, setRoutes] = useState([]);

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
      console.log("Error fetching routes : ", error);
    }
  }

  // fn to delete shipment route :HTTP DELETE request
  async function deleteRoute(route_id, route_transport_mode,route_origin, route_destination) {
    try{
        // HTTP DELETE req to : http://localhost:3000/routes => baseurl/routes
        await api.delete(`/routes/${route_id}`)

        // send alert to user to inform about the deletion
        alert(`Custom ${route_transport_mode} route from ${route_origin} to ${route_destination} Deleted Successfully.`)

        // Update UI by filter() instead of HTTP GET request
        setRoutes(routes.filter((route) => {
          return route.id !== route_id;
        }))
    }
    catch(error)
    {
      console.log(`Error deleting Route ID : ${route_id} due to : ${error}`)
    }
  }

  return (
    <>
      <div className="dashboard-header">
        
        <h1>Active Supply Chain Routes</h1>

        {/* button that triggers navigation to AddShipment page  : USER has to click it so <Link>*/}
        <Link to="/add-shipment" className="add-btn">+ Draft New Route</Link>
      </div>


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