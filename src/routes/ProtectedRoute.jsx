import { Navigate } from "react-router-dom";

// The 'children' prop represents whatever page we wrap this around i.e. <tag> whatever btwn these : children </tag>
function ProtectedRoute({ children }) {
    // check if user logged in or not?
  const user = JSON.parse(localStorage.getItem("user"));

  // If they aren't logged in, redirect them immediately to Login!
  if (!user) {
    alert(`Sorry, Please Login First to access more features...`)
    return <Navigate to="/login" replace />;
  }

  // If they are logged in, let them through to the page 
  return children;
}

export default ProtectedRoute;