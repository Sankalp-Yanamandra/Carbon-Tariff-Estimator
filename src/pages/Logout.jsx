import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


import { toast } from "react-toastify";

function Logout() {
  const navigate = useNavigate();

  // useEffect runs the moment this invisible page tries to load
  useEffect(() => {

    // 1. Erase the user from the browser's memory
    localStorage.removeItem("user");

    toast.success('Logged Out successfully. Do visit again.');

      // after 2s to let alert() show properly
    setTimeout(() => {
        // 2. Send them back to the login page 
      navigate("/login");
      // 3. Force a refresh so the Navbar updates
      window.location.reload();
    }, 2000); // 2000 milliseconds = 2 seconds

  }, []);

  return null; // Don't show anything on the screen of Logout Component
}

export default Logout;