import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();

  // states to store email n password used by user to log-in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(submit_event) {
    
    submit_event.preventDefault();

    try {
      // Asking JSON server: "Do you have a user with this EXACT email and password?"
      const response = await api.get(`/users?email=${email}&password=${password}`);

    //   console.log(response.data[0].name)
    //   if user with these very credentials found, then log them in
      if (response.data.length > 0) {
        // SUCCESS! Save the user object to the browser's permanent memory
        // We have to use JSON.stringify because localStorage ONLY accepts strings :  js obj => json obj
        localStorage.setItem("user", JSON.stringify(response.data[0]));
        
         
        toast.success(`Logged In successfully. Welcome Back , ${response.data[0].name.toUpperCase()} !!!`)

        // after 2s to let alert() show properly
        setTimeout(() => {
        navigate("/shipments");
        
        // Force a quick page reload so our Navbar updates to show the logged-in state(since login n shipment not related, so to
        // reflect changes in localStorage for Shipments page)
        window.location.reload(); 
        }, 2000); // 2000 milliseconds = 2 seconds

      } else {
        toast.error("Invalid Corporate Credentials. Please try again.")
      }
    } catch (error) {
      toast.error('Login Failed. Try again.')
      console.log("Login error due to :", error);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Logistics Portal Login</h1>
        
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Corporate Email" onChange={(type_event) => setEmail(type_event.target.value)} required />
          <input type="password" placeholder="Password" onChange={(type_event) => setPassword(type_event.target.value)} required />
          
          <button type="submit" className="auth-btn">Authenticate</button>
        </form>

        <p>New to the portal? <Link to="/register">Register Here</Link></p>
      </div>
    </div>
  );
}

export default Login;