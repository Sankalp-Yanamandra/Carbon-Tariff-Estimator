import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { useNavigate } from "react-router-dom";

// fn to calculate distance using Haversine formula
import { calculateDistance } from "../utils/haversine";

import { FaCalculator, FaUndo, FaArrowLeft, FaArrowUp } from "react-icons/fa";

// Fix Leaflet icons
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// A sub-component that purely listens for map clicks by user
function ClickHandler({ setOrigin, setDestination, origin, destination }) {
  // hook to listen to user click on map tile ( map made of millions of sq boxes stitched together - tile )
  useMapEvents({
    click(clickevent) {
      if (!origin || (origin && destination)) {
        // onclick, If map is empty : get exact latitude and longitude of mouse n sets a origin
        setOrigin(clickevent.latlng);
        // erase latitude and longitude of destination to start again.
        setDestination(null);
      } else {
        // If Origin exists but no Destination, set Destination
        setDestination(clickevent.latlng);
      }
    },
  });
  return null;
}

function Sandbox() {

  const navigate = useNavigate()


  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [transportMode, setTransportMode] = useState("Sea Freight");
  const [distance, setDistance] = useState(0);

  // state : hold city/country name
  const [originName, setOriginName] = useState("Origin");
  const [destName, setDestName] = useState("Destination");

  // Base Emission Factors (kg CO2 per km per ton of cargo)
  const emissionFactors = {
    "Sea Freight": 0.015,
    Truck: 0.105,
    "Air Freight": 0.5,
  };

  const assumedWeightTons = 20; // Assume a standard 20-ton shipping container
  const carbonPriceEUR = 85;

  // fetch name of city/country based on pin use OpenStreetMap's : Nominatim API
  const fetchLocationName = async (lat, lng, setNameFunction) => {
    setNameFunction("Locating..."); // Show loading state
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();

      // OpenStreetMap data is messy. We check for city, then town, then village, then fallback to state/region.
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state ||
        "Unknown Area";
      const country = data.address.country || "Ocean/Unknown";

      setNameFunction(`${city}, ${country}`);
    } catch (error) {
      setNameFunction("Unknown Location");
    }
  };

  // tracking change in coordinates and fetch names accordingly only when req
  useEffect(() => {
    if (origin) fetchLocationName(origin.lat, origin.lng, setOriginName);
    if (destination)
      fetchLocationName(destination.lat, destination.lng, setDestName);
  }, [origin, destination]);

  useEffect(() => {
    if (origin && destination) {
      // if coordinates of both origin and destination given, calculate the distance
      const dist = calculateDistance(
        origin.lat,
        origin.lng,
        destination.lat,
        destination.lng,
      );
      // set value of state : distance
      setDistance(dist);
    } else {
      // if coordinates not given set as distance = 0
      setDistance(0);
    }
    // run as and when change in states : origin and dest.
  }, [origin, destination]);

  // fn to reset map
  const resetMap = () => {
    setOrigin(null);
    setDestination(null);
    setOriginName("Origin");
    setDestName("Destination");
  };

  // Scroll to Top Function
  const ScrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const emissions =
    distance * emissionFactors[transportMode] * assumedWeightTons;
  // Convert kg to tonnes for pricing
  const tariff = (emissions / 1000) * carbonPriceEUR;

  return (
    <div style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>

    {/* go back to previous page button */}
    {/* NEW: The "Go Back" Button */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ 
          background: "transparent", 
          color: "#a1a1aa", 
          border: "none", 
          cursor: "pointer", 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          marginBottom: "20px", 
          fontSize: "1rem", 
          padding: 0,
          fontWeight: "500"
        }}
        // hover effect 
        onMouseEnter={(clickevent) => clickevent.currentTarget.style.color = "#fafafa"}
        onMouseLeave={(clickevent) => clickevent.currentTarget.style.color = "#a1a1aa"}
      >
        <FaArrowLeft /> Back
      </button>


      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <FaCalculator /> Interactive Route Simulator
        </h1>
        <p style={{ color: "#a1a1aa", fontSize: "1.1rem" }}>
          Click anywhere on the map to drop an Origin pin. Click again to drop a
          Destination.
        </p>
      </div>

      <div style={{ display: "flex", gap: "20px", flexDirection: "column" }}>
        {/* The Map */}
        <div
          style={{
            height: "500px",
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #27272a",
            position: "relative",
          }}
        >
          <MapContainer
            center={[20, 0]}
            zoom={2}
            minZoom={2} /* 1. Prevents zooming out too far into the grey abyss */
            maxBounds={[[-90, -180], [90, 180]]} /* 2. Locks the camera strictly to one Earth */
            maxBoundsViscosity={1.0} /* 3. Makes the map perfectly rigid when you hit the edge */
            style={{ height: "100%", width: "100%", background: "#ffffff" }}
          >

            <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            noWrap={true} /* 4. Tells OpenStreetMap to stop duplicating the image tiles */  
            />

            <ClickHandler
              setOrigin={setOrigin}
              setDestination={setDestination}
              origin={origin}
              destination={destination}
            />

            {origin && (
              <Marker position={origin}>
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -20]}
                  className="custom-tooltip"
                >
                  {originName}
                </Tooltip>
              </Marker>
            )}

            {destination && (
              <Marker position={destination}>
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -20]}
                  className="custom-tooltip"
                >
                  {destName}
                </Tooltip>
              </Marker>
            )}

            {origin && destination && (
              <Polyline
                positions={[origin, destination]}
                pathOptions={{
                  color: "#8b5cf6",
                  weight: 3,
                  dashArray: "5, 10",
                }}
              />
            )}
          </MapContainer>

          <button
            onClick={resetMap}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              zIndex: 1000,
              padding: "8px 16px",
              background: "#f43f5e",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "bold",
            }}
          >
            <FaUndo /> Reset
          </button>
        </div>

        <div
          style={{
            background: "#18181b",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #27272a",
            display: "flex",
            gap: "30px",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <label
              style={{
                color: "#a1a1aa",
                fontSize: "0.9rem",
                display: "block",
                marginBottom: "8px",
              }}
            >
              Transport Mode
            </label>
            <select
              value={transportMode}
              onChange={(e) => setTransportMode(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #3f3f46",
                background: "#09090b",
                color: "#fafafa",
                fontSize: "1rem",
              }}
            >
              <option value="Sea Freight">Sea Freight</option>
              <option value="Truck">Truck</option>
              <option value="Air Freight">Air Freight</option>
            </select>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: "150px",
              borderLeft: "1px solid #27272a",
              paddingLeft: "20px",
            }}
          >
            <p
              style={{
                color: "#a1a1aa",
                fontSize: "0.9rem",
                margin: "0 0 5px 0",
              }}
            >
              Direct Distance
            </p>
            <h3 style={{ margin: 0, color: "#fafafa" }}>
              {Math.round(distance).toLocaleString()} km
            </h3>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: "150px",
              borderLeft: "1px solid #27272a",
              paddingLeft: "20px",
            }}
          >
            <p
              style={{
                color: "#a1a1aa",
                fontSize: "0.9rem",
                margin: "0 0 5px 0",
              }}
            >
              Estimated CO2 (20-ton)
            </p>
            <h3 style={{ margin: 0, color: "#fafafa" }}>
              {Math.round(emissions).toLocaleString()} kg
            </h3>
          </div>

          <div
            style={{
              flex: 1,
              minWidth: "150px",
              borderLeft: "1px solid #27272a",
              paddingLeft: "20px",
            }}
          >
            <p
              style={{
                color: "#a1a1aa",
                fontSize: "0.9rem",
                margin: "0 0 5px 0",
              }}
            >
              Projected CBAM Tariff
            </p>
            <h3 style={{ margin: 0, color: "#f43f5e", fontSize: "1.8rem" }}>
              €{Math.round(tariff).toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      {/* back to top button */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
        <button 
          onClick={ScrollToTop}
          style={{ background: "transparent", color: "#a1a1aa", border: "1px solid #3f3f46", padding: "8px 20px", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#8b5cf6"; e.currentTarget.style.borderColor = "#8b5cf6"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "#3f3f46"; }}
        >
          <FaArrowUp /> Back to Top
        </button>
      </div>



    </div>
  );
}
export default Sandbox;
