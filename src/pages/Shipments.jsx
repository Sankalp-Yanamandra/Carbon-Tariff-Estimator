import { useEffect, useState } from "react";
import api from "../services/api";
import RouteCard from "../components/RouteCard";

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

  return (
    <>
      <h1>Active Supply Chain Routes</h1>
      <div className="destinations">
        {/* Loop through our data and create a card for each route */}
        {routes.map((route) => (
          <RouteCard key={route.id} route={route} />
        ))}
      </div>
    </>
  );
}

export default Shipments;