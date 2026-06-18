import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store";

// i. React Router configuring : BrowserRouter wraps around the 'App' to enable Routing. 
ReactDOM.createRoot(document.getElementById("root")).render(
  // wrap entire App inside Provider(react-redux connects react with redux) : so the Store(global vault with various depts -Slices) 
  // available[Read/Write access to Store's Slice's States] to all components
  // inside the App.jsx
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);