import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function AddShipment() {
    // destructure for using useNavigate() hook
  const navigate = useNavigate();

  // state to hold data typed by user
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    // Default value
    productCategory: "Aluminum/Steel", 
    // Default value
    transportMode: "Sea Freight",      
    weightTons: "",
    distanceKm: "",
    // Default image
    image: "https://images.unsplash.com/photo-1494412651409-8963ce7935a7" 
  });

  // update data in state : `formData` as soon as typing
  function handleChange(event) {
    setFormData({
        // Keep all existing data
      ...formData, 
      // Update only the field that was changed
      [event.target.name]: event.target.value 
    });
  }

  // define action on submission of form
  async function handleSubmit(event) {
    // stop page frm reloading
    event.preventDefault(); 

    
    // Emission factors (kg of CO2 per ton-km) : 
    // How much CO₂ is emitted per unit of production input or output.
    let emissionFactor = 0.015; // Sea Freight default
    if (formData.transportMode === "Air Freight") 
        {
            emissionFactor = 0.500;
        }
    if (formData.transportMode === "Truck")
        {
            emissionFactor = 0.100;
        } 

    // string -> number
    const weight = parseFloat(formData.weightTons);
    const distance = parseFloat(formData.distanceKm);

    // total emissions (kg) = total distance to travel * total wt of units * amt of Co2 produced per unit
    const emissionsKg = distance * weight * emissionFactor;
    
    // solve for EU Tariff (Current price: €85 per Ton of CO2)
    // 1 ton = €85, no of tons = ?
    const euCarbonPriceEUR = 85;
    // 1 ton = 1000 kg => 1kg = 0.001 ton => xkg = x/1000 tons
    // total tariff = total tonnes * cost of each ton
    const estimatedTariffEUR = (emissionsKg / 1000) * euCarbonPriceEUR;

    // final update formData with our calculated data
    const finalPayload = {
      ...formData,
      weightTons: weight,
      distanceKm: distance,
      // truncate to 2 decimal places for simplicity
      emissionsKg: emissionsKg.toFixed(2), 
      euCarbonPriceEUR: euCarbonPriceEUR,
      // truncate to 2 decimal places for simplicity
      estimatedTariffEUR: estimatedTariffEUR.toFixed(2),
      description: `Custom ${formData.transportMode} route from ${formData.origin} to ${formData.destination}.`
    };

    // now the final formData entered by user MUST be stored into database : HTTP POST request.
    try {
      // HTTP POST request to => http://localhost:3000/routes => baseurl/routes (baseurl in services/api.js)
      await api.post("/routes", finalPayload);
        
      console.log(formData)

     // an alert sent to user to inform about the ADDITION
      toast.success(`Custom ${formData.transportMode} route from ${formData.origin} to ${formData.destination} has been drafted successfully.`)

      // as soon as POST request sent automatically navigate back to Shipments page
      navigate("/shipments");

    } catch (error) {
      toast.warning('Draft Failed');
      console.log("Failed to add shipment due to : ", error);
    }
  }

  return (
    // the form as seen by user
    <div className="form-container">
      <h2>Draft New Shipment Route</h2>
      
      {/* as soon as form is submitted, trigger fn : handleSubmit */}
      <form onSubmit={handleSubmit}>
        
        <input
          type="text"
          name="origin"
          placeholder="Origin Country/City"
        //   as soon as user starts typing(onChange event), start update the state variable using fn : handleChange 
          onChange={handleChange}
        //   required field
          required
        />

        <input
          type="text"
          name="destination"
          placeholder="Destination Country/City (e.g., Germany)"
          // as soon as user starts typing(onChange event), start update the state variable using fn : handleChange
          onChange={handleChange}
          required
        />

        {/* dropdown menu to select type of shipment */}
        <select name="productCategory" onChange={handleChange}>
            {/* acts as placeholder */}
          <option value="">Select Shipment Type</option>
          <option value="Aluminum/Steel">Aluminum/Steel</option>
          <option value="Cement/Fertilizer">Cement/Fertilizer</option>
          <option value="Electronics">Electronics</option>
        </select>

        <select name="transportMode" onChange={handleChange}>
          <option value="">Select Mode of Transport</option>
          <option value="Sea Freight">Sea Freight (Lowest CO2 emission)</option>
          <option value="Truck">Land/Truck (Medium CO2 emission)</option>
          <option value="Air Freight">Air Freight (Highest CO2 emission)</option>
        </select>

        {/* Optional Image URL Field */}
        <input
          type="url"
          name="image"
          placeholder="Image URL (Optional)"
          onChange={handleChange}
        />

        <input
          type="number"
          name="weightTons"
          placeholder="Cargo Weight (in Tons)"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="distanceKm"
          placeholder="Total Distance (in km)"
          onChange={handleChange}
          required
        />

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Calculate & Draft New Route 
          </button>
          
          <Link to="/shipments" className="cancel-btn">
            Cancel Draft
          </Link>
        </div>
        
      </form>
    </div>
  );
}

export default AddShipment;