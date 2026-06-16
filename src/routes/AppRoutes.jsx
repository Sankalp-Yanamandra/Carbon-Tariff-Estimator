import React from 'react'

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shipments from "../pages/Shipments";
import ShipmentDetails from "../pages/ShipmentDetails";

import AddShipment from '../pages/AddShipment';
import EditShipment from '../pages/EditShipment';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shipments" element={<Shipments />} />
      <Route path="/shipments/:id" element={<ShipmentDetails />} />
      <Route path="/add-shipment" element={<AddShipment />} />
      <Route path="/edit-shipment/:id" element={<EditShipment />}/>
    </Routes>
  );
}

export default AppRoutes;