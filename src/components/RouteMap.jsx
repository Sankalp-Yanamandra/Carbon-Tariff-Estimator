import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
// Leaflet needs its CSS
import "leaflet/dist/leaflet.css"; 
import L from "leaflet";
// coordinates list to map
import { getCoordinates } from "../utils/coordinates";

// ensure Leaflet marker icons don't disappear(eg. default blue pin and its shadow) in React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// A smart sub-component that forces the map camera to zoom and fit both markers
function MapBounds({ bounds }) {
    // get the leaflet camera for :
  const map = useMap();
  //  : Only auto-zoom if we actually found real coordinates
  if (bounds[0][0] !== 0 && bounds[1][0] !== 0) {
    // fitbounds() : zoom out enough for both origin and destination to be visible in the section, padding for pins
    map.fitBounds(bounds, { padding: [40, 40] });
  }
//   don't render this fn
  return null;
}

// take origin , destination, transportMode objects as props from db.json
function RouteMap({ origin, destination, transportMode }) {
    // get origin and destination coordinates from `coordinates.js`
  const originCoords = getCoordinates(origin);
  const destCoords = getCoordinates(destination);
  const bounds = [originCoords, destCoords];

  // Route Mapping via a Line(joining origin and destination) based on Transport Mode
  // Default Violet (if no transport given)
  let lineStyle = { color: "#8b5cf6", weight: 3, dashArray: "" }; 
  // Blue Dashed for sea
  if (transportMode === "Sea Freight") lineStyle = { color: "#3b82f6", weight: 3, dashArray: "5, 10" };
  // Gray Dotted for air 
  if (transportMode === "Air Freight") lineStyle = { color: "#22d3ee", weight: 3, dashArray: "1, 5" }; 
  // Solid Green for land
  if (transportMode === "Truck") lineStyle = { color: "#10b981", weight: 3, dashArray: "" }; 

//   render the map
  return (
    // positon relative for legend explain meaning of each line mapped on map
    <div style={{ height: "320px", width: "100%", borderRadius: "8px", overflow: "hidden", border: "1px solid #27272a", position: "relative" }}>

        {/* Mapcontainer : has the map with limits as `bounds`, 
        scrollWheelZoom={false} : ensures when the user scrolls down your homepage, 
        they don't accidentally get trapped zooming into the map instead of scrolling the page */}
      <MapContainer bounds={bounds} zoom={3} scrollWheelZoom={false} style={{ height: "100%", width: "100%", background: "#ffffff" }}>
        
        {/* Dark Theme Map Tiles matching the dashboard style  : MAP is just millions of tiny square images(tiles) together and
        this gives dark themed color*/}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        {/* map is drawn : Marker -> puts pin on origin & dest. */}
        <Marker position={originCoords} />
        <Marker position={destCoords} />
        
        {/* Draw the route connection using styles defined above based on mode of transport */}
        <Polyline positions={bounds} pathOptions={lineStyle} />
        
        {/* ensures  map doesn't go beyond the bounded coordinates */}
        <MapBounds bounds={bounds} />
      </MapContainer>

        {/* legend on map */}
      <div style={{
        position: "absolute",
        bottom: "15px",
        left: "15px",
        // Translucent dark zinc
        background: "rgba(24, 24, 27, 0.85)", 
        backdropFilter: "blur(4px)",
        padding: "6px 12px",
        borderRadius: "6px",
        border: "1px solid #3f3f46",
        // Keeps it above the map tiles
        zIndex: 1000, 
        color: "#fafafa",
        fontSize: "0.85rem",
        fontWeight: "500",
        display: "flex",
        alignItems: "center",
        gap: "8px"
      }}>
        {/* Dynamic colored line indicator inside the legend */}
        <span style={{
          display: "inline-block",
          width: "20px",
          height: "3px",
          background: lineStyle.dashArray ? "transparent" : lineStyle.color,
          borderBottom: lineStyle.dashArray ? `3px dashed ${lineStyle.color}` : "none"
        }}></span>
        {transportMode} Route
      </div>


    </div>
  );
}

export default RouteMap;