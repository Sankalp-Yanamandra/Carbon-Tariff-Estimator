import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

import { Link } from "react-router-dom";
import { toast } from "react-toastify";


function EditShipment() {
    // Grab the dynamic parameter : ID from the URL
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    productCategory: "",
    transportMode: "",
    weightTons: "",
    distanceKm: "",
    image: ""
  });

  // Fetch the existing shipment data when the page loads
  useEffect(() => {
    getShipmentDetails();
  }, []);

  async function getShipmentDetails() {
    try {
      const response = await api.get(`/routes/${id}`);
      // Pre-fill the form with data fetched, so before filling the form , the user knows what the old data is
      setFormData(response.data); 
    } catch (error) {
      console.log("Error fetching shipment due to : ", error);
    }
  }

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Recalculate everything in case user changed the weight, distance, or mode
    let emissionFactor = 0.015; // default : Sea Freight
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

    // emissions in kg
    const emissionsKg = distance * weight * emissionFactor;
    const euCarbonPriceEUR = 85;
    // 1 ton = 1000kg => 1kg = 1/1000 ton => xkg = x/1000 tonnes
    // so total price = total tonnes x cost of 1 ton 
    const estimatedTariffEUR = (emissionsKg / 1000) * euCarbonPriceEUR;

    const finalPayload = {
      ...formData,
      weightTons: weight,
      distanceKm: distance,
      emissionsKg: emissionsKg.toFixed(2),
      euCarbonPriceEUR: euCarbonPriceEUR,
      estimatedTariffEUR: estimatedTariffEUR.toFixed(2),
    };

    try {
      // Use HTTP PUT request to update existing data : http://localhost:3000/routes => baseurl/routes 
      await api.put(`/routes/${id}`, finalPayload);

      toast.success('Shipment Route Updated.')
    //   automatically navigate to Shipments pages on Updation.
      navigate("/shipments");
    } catch (error) {
      toast.warning('Shipment Route Update failed.')
      console.log("Failed to update shipment", error);
    }
  }

  return (
    <div className="form-container">
      <h2>Edit Shipment Route</h2>
      
      <form onSubmit={handleSubmit}>
        <input type="text" name="origin" value={formData.origin} onChange={handleChange} required />
        <input type="text" name="destination" value={formData.destination} onChange={handleChange} required />
        
        <select name="productCategory" value={formData.productCategory} onChange={handleChange}>
            <option value="">Select Shipment Type</option>
          <option value="Aluminum/Steel">Aluminum/Steel</option>
          <option value="Cement/Fertilizer">Cement/Fertilizer</option>
          <option value="Electronics">Electronics</option>
        </select>

        <select name="transportMode" value={formData.transportMode} onChange={handleChange}>
            <option value="">Select Mode Of Transport</option>
          <option value="Sea Freight">Sea Freight (Lowest CO2 emission)</option>
          <option value="Truck">Land/Truck (Medium CO2 emission)</option>
          <option value="Air Freight">Air Freight (Highest CO2 emission)</option>
        </select>

        {/* Optional Image URL Field */}
        <input 
          type="url" 
          name="image" 
          placeholder="Image URL (Optional)" 
          value={formData.image} 
          onChange={handleChange} 
        />


        <input type="number" name="weightTons" value={formData.weightTons} onChange={handleChange} required />
        <input type="number" name="distanceKm" value={formData.distanceKm} onChange={handleChange} required />

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            Update & Recalculate Route
          </button>
          
          <Link to="/shipments" className="cancel-btn">
            Cancel Editing
          </Link>
        </div>

      </form>
    </div>
  );
}

export default EditShipment;