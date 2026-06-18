import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

import { toast } from 'react-toastify';

function Register() {
    // destructure to use useNavigate hook
  const navigate = useNavigate();

//   state to store user data during registration
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: ""
  });

//   update state : `user` on typing
  function handleChange(type_event) {
    setUser({
        // spread operator : deep copy
      ...user,
      [type_event.target.name]: type_event.target.value
    });
  }

  async function handleSubmit(submit_event) {
    // disable auto pg reload
    submit_event.preventDefault();

    try {
      // Create the user in our mock database :baseurl/users : 2nd enpoint -> http://localhost:3000/users
      await api.post("/users", user);
        //inform user of successful registration   

      toast.success(`Account for ${user.email} created! Please log in.`);
      // auto navigate : Send them to the login page
      navigate("/login");

    } catch (error) {
        // send alert to user
        toast.error("Registration failed. Please try again.");
        console.log("Registration failed due to : ", error);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Register Corporate Account</h1>
        
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Company / Manager Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Corporate Email ID" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Create a Secure Password" onChange={handleChange} required />
          
          <button type="submit" className="auth-btn">Register Account</button>
        </form>

        <p>Already have an account? <Link to="/login">Log In Here</Link></p>
      </div>
    </div>
  );
}

export default Register;