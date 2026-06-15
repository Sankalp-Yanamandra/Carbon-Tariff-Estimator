import React from 'react'

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shipments from "../pages/Shipments";
import ShipmentDetails from "../pages/ShipmentDetails";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shipments" element={<Shipments />} />
      <Route path="/shipments/:id" element={<ShipmentDetails />} />
    </Routes>
  );
}

export default AppRoutes;