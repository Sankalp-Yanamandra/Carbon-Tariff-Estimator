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


  // states to store user's choices for filters
  const [search, setSearch] = useState("");
  // initially filtered by All Categories
  const [category, setCategory] = useState("All");
  // initially filtered by All modes of transport
  const [transportMode, setTransportMode] = useState("All");
  const [sort, setSort] = useState("");


  // PAGINATION
  // states to track pages, intially on pg-1
  const [currentPage, setCurrentPage] = useState(1);
  //  6 cards per page
  const routesPerPage = 6; 



  // Fetch the data as soon as the page loads i.e. ONly Once
  useEffect(() => {
    getRoutes();
  }, []);

  // If the user types in the search bar or changes a filter, 
  // bring them to Page 1, otherwise they might see a blank screen!
  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, transportMode, sort]);

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


  // applying filter logic for search states
  const filteredRoutes = routes.filter((route) => {
    // match search based on origin/destination
    const searchMatch = 
      // convert search text by user to lowercase for `CASE-INSENSITIVITY`
      route.origin.toLowerCase().includes(search.toLowerCase()) || 
      route.destination.toLowerCase().includes(search.toLowerCase());

    // if no category given, filter by 'ALl' else filter by category given
    const categoryMatch = category === "All" || route.productCategory === category;

    // if no mode given, filter by 'ALl' else filter by mode given
    const modeMatch = transportMode === "All" || route.transportMode === transportMode;

    // filter cond : must match each of search AND category AND mode given by user
    return searchMatch && categoryMatch && modeMatch;
  });

  // sorting logic
  // get the updated filtered array data, on which apply the sort logic [to get results based on both search n sort] 
  let finalRoutes = [...filteredRoutes];
    if (sort === "high-co2") {
    // Sort High to Low by Emissions
    finalRoutes.sort((a, b) => parseFloat(b.emissionsKg) - parseFloat(a.emissionsKg));
  } else if (sort === "low-co2") {
    // Sort Low to High by Emissions
    finalRoutes.sort((a, b) => parseFloat(a.emissionsKg) - parseFloat(b.emissionsKg));
  }


  // Find the exact slice of the array we need for the current page
  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  
  //  small array containing ONLY the routes for the current page slice(a,b) : [a,b)
  const currentRoutes = finalRoutes.slice(indexOfFirstRoute, indexOfLastRoute);
  
  // Calculate total pages needed
  const totalPages = Math.ceil(finalRoutes.length / routesPerPage);

  // Pagination Handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));


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

      {/* form for search n sort filters */}
      <div className="filters" style={{ display: "flex", gap: "15px", flexWrap: "wrap", marginBottom: "30px" }}>


        <input 
          type="text" 
          placeholder="Search Origin or Destination..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ flex: 1, minWidth: "200px", padding: "12px", borderRadius: "8px", border: "1px solid #27272a", background: "#09090b", color: "#fafafa" }}
        />

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #27272a", background: "#09090b", color: "#fafafa" }}>
          <option value="All">All Categories</option>
          <option value="Aluminum/Steel">Aluminum/Steel</option>
          <option value="Electronics">Electronics</option>
          <option value="Cement/Fertilizer">Cement/Fertilizer</option>
        </select>

        <select value={transportMode} onChange={(e) => setTransportMode(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #27272a", background: "#09090b", color: "#fafafa" }}>
          <option value="All">All Modes</option>
          <option value="Sea Freight">Sea Freight</option>
          <option value="Air Freight">Air Freight</option>
          <option value="Truck">Truck</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: "12px", borderRadius: "8px", border: "1px solid #27272a", background: "#09090b", color: "#fafafa" }}>
          <option value="">Sort by Impact</option>
          <option value="high-co2">Emissions: High to Low</option>
          <option value="low-co2">Emissions: Low to High</option>
        </select>


      </div>


      {/* rendering final destinations after applying sorted and searched filters :
       conditional rendering,
      to ensure map() doesnt fail if no data exists.*/}


      <div className="destinations">
        {currentRoutes.length > 0 ? (
          // Loop through our data and create a card for each route
          currentRoutes.map((route) => (
            // pass route data and delete fn as props to RouteCard
            <RouteCard key={route.id} route={route} onDelete={deleteRoute} />
          ))
        ) : 
          // if no data, show a message accordingly.
        (
          // gridColumn: "1 / -1" : gridcolstart = 1(at 1st grid line) and gridend : -1(at last grid line)
          // h3 element will span the entire width of the grid
          <h3 style={{ color: "#a1a1aa", gridColumn: "1 / -1", textAlign: "center", marginTop: "20px" }}>
            No routes match your search criteria.
          </h3>
        )}

      </div>

      {/* UI for page switching */}
      {/* render this only if more than 1 pg */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginTop: "40px", paddingBottom: "40px" }}>
          
          {/* go to prev page button */}
          <button 
            onClick={prevPage} 
            // disable this button if on pg 1(since can't go back more)
            disabled={currentPage === 1}
            style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #27272a", background: currentPage === 1 ? "transparent" : "#27272a", color: currentPage === 1 ? "#52525b" : "#fafafa", cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            Prev
          </button>

          {/* Dynamically create a button for every page number */}
          {/* create an empty array of size : total pages, in map() : we aren't req items, just req index .*/}
          {[...Array(totalPages)].map((_, index) => (

            // button to go to prev page
            <button
              // unique key for react 
              key={index + 1}
              // since index start at 0 so index + 1, onclick we set current pg number : state `currentPage`
              onClick={() => paginate(index + 1)}
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                border: "1px solid",
                borderColor: currentPage === index + 1 ? "#8b5cf6" : "#27272a",
                background: currentPage === index + 1 ? "rgba(139, 92, 246, 0.1)" : "transparent",
                color: currentPage === index + 1 ? "#8b5cf6" : "#a1a1aa",
                fontWeight: currentPage === index + 1 ? "bold" : "normal",
                cursor: "pointer"
              }}
            >
              {index + 1}
            </button>
          ))}

          {/* button to go to next page */}
          <button 
            onClick={nextPage}
            // if on last page, diasable the button (since can't go any further) 
            disabled={currentPage === totalPages}
            style={{ padding: "8px 16px", borderRadius: "6px", border: "1px solid #27272a", background: currentPage === totalPages ? "transparent" : "#27272a", color: currentPage === totalPages ? "#52525b" : "#fafafa", cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
          >
            Next
          </button>
          
        </div>
      )}


    </>
  );
}

export default Shipments;