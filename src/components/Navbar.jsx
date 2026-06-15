import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      {/* ii. navbar component : instead of <a> anchor tag using <Link> tag to ensure no page reloading, 
          just components swapped on clicking the hyperlink.

          <Link> alternative to useNavigate() hook.
      */}
      <Link to="/">Home</Link>
      <Link to="/shipments">Shipment Routes</Link>
    </nav>
  );
}

export default Navbar;