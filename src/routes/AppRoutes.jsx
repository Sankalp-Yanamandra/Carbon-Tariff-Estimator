import React from 'react'

import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Shipments from "../pages/Shipments";
import ShipmentDetails from "../pages/ShipmentDetails";

import AddShipment from '../pages/AddShipment';
import EditShipment from '../pages/EditShipment';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Logout from '../pages/Logout';
import ProtectedRoute from './ProtectedRoute';


import Watchlist from '../pages/Watchlist';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/shipments" element={<Shipments />} />
      <Route path="/shipments/:id" element={<ShipmentDetails />} />
      
      {/* Add, Edit, Watchlist features only available after logging in */}
      <Route path="/add-shipment" element={
        <ProtectedRoute>
          <AddShipment />
        </ProtectedRoute>
        } />

      <Route path="/edit-shipment/:id" element={
        <ProtectedRoute>
          <EditShipment />
        </ProtectedRoute>
        }/>

      <Route 
        path="/watchlist" 
        element={
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        } 
      />


      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path='/logout' element={<Logout />} /> 
    </Routes>
  );
}

export default AppRoutes;