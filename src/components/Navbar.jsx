import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

import api from "../services/api";

import { useSelector } from "react-redux";

import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

function Navbar() {

  const navigate = useNavigate();

  // Check the browser's memory to see if someone is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  // JSON.parse() : json obj => js obj

  // State to track if the dropdown is open
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // get watchlist data from the store
  const watchlist = useSelector((state) => state.watchlist);

// Function to handle deleting the account
  function handleDeleteAccount() {
    // 1. Launch the custom modal
    confirmAlert({
      title: 'Confirm Account Deletion',
      message: 'Are you sure you want to permanently delete your corporate account? This action cannot be undone.',
      buttons: [
        {
          label: 'Yes, Delete It',
          // 2. If they click yes, we run your EXACT asynchronous logic!
          onClick: async () => {
            // only for logged in user
            if (user) {
              try {
                // Delete the user from the JSON database
                await api.delete(`/users/${user.id}`);
                
                // Clear local storage
                localStorage.removeItem("user");
                
                // Show the success toast
                toast.success(`Corporate Account deleted successfully. Sorry to see you go.`); 

                // Wait 2 seconds, then redirect and refresh
                setTimeout(() => {
                    navigate("/register");
                    window.location.reload();
                }, 2000);

              } catch (error) {
                toast.error("Couldn't delete the account.");
                console.log("Error deleting account:", error);
              }
            }
          }
        },
        {
          label: 'Cancel',
          // If they click cancel, the modal simply closes and does nothing.
          onClick: () => {} 
        }
      ]
    });
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

        {/* <Link> to navigate to `Watchlist` page when user clicks it, also shows no of items in the watchlist : only for logged in users */}
        {user && (
            <Link to="/watchlist" style={{ color: "#fbbf24" }}>
              ⭐ Watchlist ({watchlist.length})
            </Link>
          )}


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