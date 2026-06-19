import { Link } from "react-router-dom";

// for fetching routes from db, sort and take top emitters
import { useState, useEffect } from "react";
import api from "../services/api";
import RouteMap from "../components/RouteMap";
import { Oval } from "react-loader-spinner";
import { toast } from "react-toastify";

// 1. icons req
import {
  FaShip,
  FaPlane,
  FaTruck,
  FaBox,
  FaSmog,
  FaInfoCircle,
  FaGlobeAmericas,
  FaGlobeEurope,
  FaExclamationTriangle,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowUp
} from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";

function Home() {
  // state : for tracking top route
  const [topRoutes, setTopRoutes] = useState([]);
  // state : for using react-spinner-loader library to display loading animation, initially loading is on
  const [isLoading, setIsLoading] = useState(true);

  // get data,sort->highest to lowest, get top 2
  async function fetchTopRoutes() {
    try {
      const response = await api.get("/routes");
      // Sort highest CO2 first, then grab the top 2
      const sorted = response.data.sort(
        (a, b) => parseFloat(b.emissionsKg) - parseFloat(a.emissionsKg),
      );
      setTopRoutes(sorted.slice(0, 2));
    } catch (error) {
      toast.info("Failed To Render homepage routes");
      console.error("Error fetching homepage routes:", error);
    } finally {
      // irrespective of execution result of try-catch, set loading to off
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // start fetch
    fetchTopRoutes();
  }, []);

  // fn to define action : scroll on clicking button 'What's its about' on the Home page
  function ScrollToInfoSection() {
    // get id of destination to which we have to 'scroll' until to.
    const cbam_info_id = document.getElementById("cbam-info");
    // if collected the id properly, then scroll to this point
    if (cbam_info_id) {
      // ensure 'scrolling is SMOOTH'
      cbam_info_id.scrollIntoView({ behavior: "smooth" });
    }
  }

  // fn to define action : scroll on clicking button 'section 3' on the Home page
  function ScrollToDataSection() {
    // get id of destination to which we have to 'scroll' until to.
    const cbam_data_id = document.getElementById("cbam-data");
    // if collected the id properly, then scroll to this point
    if (cbam_data_id) {
      // ensure 'scrolling is SMOOTH'
      cbam_data_id.scrollIntoView({ behavior: "smooth" });
    }
  }

  // fn to scroll back to top
  function ScrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // 2. fn to return the correct React Icon based on the mode
  const getTransportIcon = (mode) => {
    if (mode === "Sea Freight") return <FaShip />;
    if (mode === "Air Freight") return <FaPlane />;
    if (mode === "Truck") return <FaTruck />;
    return <FaBox />;
  };

  return (
    <div className="home-container">
      {/* SECTION 1: The Hero / Hook */}
      <section className="hero-section">
        <h1>Carbon Offset & Tariff Estimator</h1>
        <p className="subtitle">
          Calculate your global supply chain emissions and projected CBAM
          tariffs instantly. Plan greener, more cost-effective trade routes.
        </p>

        {/* The Call to Action buttons */}
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={ScrollToInfoSection}
            className="cta-button"
            style={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <FaInfoCircle /> What's it About
          </button>

          <button
            onClick={ScrollToDataSection}
            className="cta-button"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#3f3f46",
              color: "#fafafa",
            }}
          >
            <FaGlobeAmericas /> View Live Hotspots
          </button>
        </div>
      </section>

      {/* Section 2 : design principle called "Chunking i.e breaking big paragraph into blocks, and give color coded */}
      <section
        id="cbam-info"
        className="info-section"
        style={{
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
          padding: "80px 20px",
        }}
      >
        <h2
          style={{
            fontSize: "2.5rem",
            marginBottom: "40px",
            textAlign: "center",
          }}
        >
          What is the Carbon Tariff?
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            textAlign: "left",
          }}
        >
          {/* Block 1: The Basic info */}
          <div
            style={{
              background: "#18181b",
              padding: "30px",
              borderRadius: "16px",
              border: "1px solid #27272a",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            <h4
              style={{
                color: "#8b5cf6",
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <FaGlobeEurope /> The European Union's CBAM
            </h4>
            <p
              style={{
                color: "#d4d4d8",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              The <strong>Carbon Border Adjustment Mechanism (CBAM)</strong>{" "}
              levels the playing field. If you manufacture goods in a country
              with low environmental regulations and export them to the EU, you
              must pay a tax (tariff) equivalent to the carbon pollution created
              during production and transport.
            </p>
          </div>

          {/* Block 2: Carbon Leakage explanation */}
          <div
            style={{
              background: "rgba(244, 63, 94, 0.05)",
              padding: "30px",
              borderRadius: "16px",
              border: "1px solid rgba(244, 63, 94, 0.2)",
            }}
          >
            <h4
              style={{
                color: "#f43f5e",
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <FaExclamationTriangle /> The Threat: Carbon Leakage
            </h4>
            <p
              style={{
                color: "#d4d4d8",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                margin: 0,
              }}
            >
              <strong>Carbon leakage</strong> occurs when companies based in the
              EU move carbon-intensive production abroad to countries where less
              stringent climate policies are in place, or when EU products get
              replaced by more carbon-intensive imports.
            </p>
          </div>

          {/* Block 3: The Solution/Aim of this traiff */}
          <div
            style={{
              background: "rgba(16, 185, 129, 0.05)",
              padding: "30px",
              borderRadius: "16px",
              border: "1px solid rgba(16, 185, 129, 0.2)",
            }}
          >
            <h4
              style={{
                color: "#10b981",
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <FaShieldAlt /> The Solution & Aim
            </h4>
            <p
              style={{
                color: "#d4d4d8",
                fontSize: "1.1rem",
                lineHeight: "1.6",
                marginBottom: "16px",
              }}
            >
              CBAM is a system to confirm that a price has been paid for the
              embedded carbon emissions generated in the production of imported
              goods. This ensures that:
            </p>
            <ul
              style={{
                listStyleType: "none",
                padding: "0",
                margin: "0",
                color: "#a1a1aa",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontSize: "1.05rem",
              }}
            >
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <FaCheckCircle
                  style={{ color: "#10b981", marginTop: "4px", flexShrink: 0 }}
                />
                <span>
                  The carbon price of imports is equivalent to the carbon price
                  of domestic production.
                </span>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <FaCheckCircle
                  style={{ color: "#10b981", marginTop: "4px", flexShrink: 0 }}
                />
                <span>
                  The EU's and non-EU countries' (e.g., India, China) climate
                  objectives are not undermined.
                </span>
              </li>
            </ul>
          </div>

          {/* final info */}
          <p
            style={{
              textAlign: "center",
              color: "#fafafa",
              fontSize: "1.2rem",
              fontWeight: "600",
              marginTop: "30px",
              padding: "20px",
              borderTop: "1px solid #27272a",
              borderBottom: "1px solid #27272a",
            }}
          >
            Our tool helps businesses visualize and manage these hidden
            geopolitical costs before their cargo ever leaves the port.
          </p>

          {/* back to top button */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <button 
              onClick={ScrollToTop}
              style={{ background: "transparent", color: "#a1a1aa", border: "1px solid #3f3f46", padding: "8px 20px", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#8b5cf6"; e.currentTarget.style.borderColor = "#8b5cf6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "#3f3f46"; }}
            >
              <FaArrowUp /> Back to Top
            </button>
          </div>



        </div>
      </section>

      {/* SECTION 3: Geopolitical Impact & Data */}
      <section
        id="cbam-data"
        className="stats-section"
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
          paddingBottom: "10px", 
          minHeight: "auto"      
        }}
      >
        <h2 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>
          Live Global Hotspots
        </h2>
        <p
          style={{ color: "#a1a1aa", fontSize: "1.1rem", marginBottom: "40px" }}
        >
          Tracking the highest-impact routes currently active in our database.
        </p>

        {isLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "40px 0",
            }}
          >
            <Oval
              height={60}
              width={60}
              color="#8b5cf6"
              secondaryColor="#a78bfa"
              strokeWidth={4}
            />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
              gap: "40px",
              width: "100%",
            }}
          >
            {topRoutes.map((route) => (
              // Added className="hotspot-card" for the CSS hover effect
              <div
                key={route.id}
                className="hotspot-card"
                style={{
                  background: "#18181b",
                  padding: "24px",
                  borderRadius: "16px",
                  border: "1px solid #27272a",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* MOVED TO TOP: Data Badges acting as a header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#27272a",
                      color: "#e4e4e7",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "500",
                    }}
                  >
                    {getTransportIcon(route.transportMode)}{" "}
                    {route.transportMode}
                  </span>
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(244, 63, 94, 0.1)",
                      color: "#f43f5e",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "0.85rem",
                      fontWeight: "600",
                    }}
                  >
                    <FaSmog /> {parseFloat(route.emissionsKg).toLocaleString()}{" "}
                    kg CO2
                  </span>
                </div>

                {/* The Map */}
                <RouteMap
                  origin={route.origin}
                  destination={route.destination}
                  transportMode={route.transportMode}
                />

                {/* CENTERED: Typography Hierarchy */}
                <h3
                  style={{
                    marginTop: "24px",
                    color: "#fafafa",
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    letterSpacing: "-0.5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {route.origin}
                  <FaArrowRightLong
                    style={{ color: "#52525b", fontSize: "1.2rem" }}
                  />
                  {route.destination}
                </h3>

                <p
                  style={{
                    color: "#f43f5e",
                    fontWeight: "700",
                    fontSize: "1.25rem",
                    marginTop: "8px",
                    marginBottom: "0",
                  }}
                >
                  Estimated Tariff: €{route.estimatedTariffEUR.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* back to top button */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <button 
              onClick={ScrollToTop}
              style={{ background: "transparent", color: "#a1a1aa", border: "1px solid #3f3f46", padding: "8px 20px", borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", transition: "all 0.2s ease" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#8b5cf6"; e.currentTarget.style.borderColor = "#8b5cf6"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#a1a1aa"; e.currentTarget.style.borderColor = "#3f3f46"; }}
            >
              <FaArrowUp /> Back to Top
            </button>
          </div>




      </section>
    </div>
  );
}

export default Home;
