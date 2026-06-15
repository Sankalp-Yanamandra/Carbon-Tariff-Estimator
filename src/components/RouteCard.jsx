import { Link } from "react-router-dom";

// The 'route' prop is passed down from the parent Shipments page, destructured i.e. (here) rather than props.route.something
// use just route.something
function RouteCard({ route }) {
  return (
    <div className="card">
      <img src={route.image} alt={`${route.origin} to ${route.destination}`} />
      
      <h3>{route.origin} → {route.destination}</h3>
      <p className="category">{route.productCategory}</p>
      
      <div className="card-metrics">
        <p>🚛 Mode: {route.transportMode}</p>
        <p>☁️ CO2: {route.emissionsKg} kg</p>
        <p>💶 Tariff: €{route.estimatedTariffEUR}</p>
      </div>
        {/*
            Dynamic routing using dynamic id parameter,
            on clicking this link, render 'ShipmentDetails' component 
         */}
      <Link to={`/shipments/${route.id}`}>View Analysis</Link>
    </div>
  );
}

export default RouteCard;