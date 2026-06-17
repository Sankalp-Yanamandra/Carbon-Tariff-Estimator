import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import api from "../services/api";

function Navbar() {

  const navigate = useNavigate();

  // Check the browser's memory to see if someone is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  // JSON.parse() : json obj => js obj

  // State to track if the dropdown is open
  const [dropdownOpen, setDropdownOpen] = useState(false);


  // Function to handle deleting the account
  async function handleDeleteAccount() {
    // Always confirm before a destructive action
    const confirmDelete = window.confirm("Are you sure you want to permanently delete your corporate account?");

    // if user logged in and confirms deleteting the account
    if (confirmDelete && user) {
      try {
        // 1. Delete the user from the JSON database
        await api.delete(`/users/${user.id}`);
        
        // 2. Clear local storage
        localStorage.removeItem("user");
        
        alert("Corporate Account Deleted Successfully.");
        
        // 3. redirect to the registration page and refresh
        navigate("/register");
        window.location.reload();

      } catch (error) {
        console.log("Error deleting account:", error);
      }
    }
  }


  return (
    <nav>
      {/* ii. navbar component : instead of <a> anchor tag using <Link> tag to ensure no page reloading, 
          just components swapped on clicking the hyperlink.

          <Link> alternative to useNavigate() hook.
      */}

      {/* left side of navbar */}
      <div className="nav-left">
        <Link to="/">Home</Link>
        <Link to="/shipments">Shipment Routes</Link>
      </div>

      {/* right side of navbar */}
      <div className="nav-right">
      
          {/* conditional rendering of Register-Login and Logout Links */}
          {/* If there is NO user (!user), show these links */}
            {!user && (
              <>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
              </>
            )}

{/* NEW: The Avatar and Dropdown Menu */}
        {user && (
          <div className="user-menu">
            {/* The Trigger (Clicking this toggles the menu) : onclick, if open then close, if close then open dropdown menu */}
            <div className="user-profile" onClick={() => setDropdownOpen(!dropdownOpen)}>
              {/* get first letter of their name and make it uppercase */}
              <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
              <span className="username">{user.name}</span>
            </div>

            {/* The Dropdown Menu (Only shows if dropdownOpen is true) */}
            {dropdownOpen && (
              <div className="dropdown">
                <Link to="/logout" className="dropdown-item">Logout</Link>
                <button onClick={handleDeleteAccount} className="dropdown-item delete-text">
                  Delete Account
                </button>
              </div>
            )}
          </div>
        )}
      </div>

    </nav>
  );
}

export default Navbar;