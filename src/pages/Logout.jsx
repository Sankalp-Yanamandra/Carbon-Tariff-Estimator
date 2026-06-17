import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  // useEffect runs the moment this invisible page tries to load
  useEffect(() => {

    // 1. Erase the user from the browser's memory
    localStorage.removeItem("user");

    // 2. Send them back to the login page 
    navigate("/login");
    
    // 3. Force a refresh so the Navbar updates
    window.location.reload();
  }, []);

  return null; // Don't show anything on the screen of Logout Component
}

export default Logout;