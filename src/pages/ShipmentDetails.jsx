import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

// Import the specific spinner component you want to use
import { Oval } from "react-loader-spinner";




function ShipmentDetails() {


  // Grab the dynamic ID from the URL (e.g., /shipments/1) using useParams()
  const { id } = useParams();
  // state that stores details of each route
  const [route, setRoute] = useState(null);

  const navigate = useNavigate();

  // load side effects only once : when the page/component reloads
  useEffect(() => {
    getRouteDetails();
  }, []);

  async function getRouteDetails() {
    try {
    // fetch data from : eg. /routes/2 get converted to : http://localhost:3000/routes/2 (id = 2)
      const response = await api.get(`/routes/${id}`);
      // save fettched data into the state 'route'
      setRoute(response.data);
    } catch (error) {
      toast.warning('Failed fetching route details')
      console.log("Error fetching route details : ", error);
    }
  }

  // render loading state until the data arrives from the API
if (!route) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "100px" }}>
        <Oval
          height={80}
          width={80}
          color="#3b82f6"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel='oval-loading'
          secondaryColor="#bfdbfe"
          strokeWidth={4}
          strokeWidthSecondary={4}
        />
        <h2 style={{ marginTop: "20px", color: "#475569" }}>Calculating Emissions & Tariffs...</h2>
      </div>
    );
  }
  
  //handling image loading issue
  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1494412651409-8963ce7935a7"; // Reliable sea freight image 


//   render data stored inside state 'route'
  return (
    <div className="details">

      {/* escape latch to return JUST THE PREVIOUS PAGE,user came from : Dynamic History Navigation Maps(-1) */}
      <button 
        onClick={() => navigate(-1)} 
        className="back-link" 
        style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
      >
        ← Go Back
      </button>

      <img 
        src={route.image || DEFAULT_IMAGE} 
        alt="Trade Route" 
        onError={(e) => {
          // Swap to default if broken
          e.target.src = DEFAULT_IMAGE;
          // Prevent infinite loop if default also breaks
          e.target.onerror = null;
        }}
      />
      
      <h1>{route.origin} to {route.destination} Analysis</h1>
      <p>{route.description}</p>
      
      <div className="details-grid">
        <div>
          <h3>Product Category</h3>
          <p>{route.productCategory}</p>
        </div>
        <div>
          <h3>Transport Mode</h3>
          <p>{route.transportMode}</p>
        </div>
        <div>
          <h3>Cargo Weight</h3>
          <p>{route.weightTons} Tons</p>
        </div>
        <div>
          <h3>Distance</h3>
          <p>{route.distanceKm} km</p>
        </div>
      </div>

      <div className="impact-box">
        <h3>Environmental & Financial Impact</h3>
        <p><strong>Total Carbon Emissions:</strong> {route.emissionsKg} kg of CO2</p>
        <p><strong>Current EU Carbon Price:</strong> €{route.euCarbonPriceEUR} per Ton</p>
        <p className="highlight"><strong>Projected CBAM Tariff:</strong> €{route.estimatedTariffEUR}</p>
      </div>
    </div>
  );
}

export default ShipmentDetails;