import { Link } from "react-router-dom";

function Home() {


  // fn to define action : scroll on clicking button 'What's its about' on the Home page
  function ScrollToInfoSection(){
    // get id of destination to which we have to 'scroll' until to.
    const cbam_info_id = document.getElementById('cbam-info')
    // if collected the id properly, then scroll to this point
    if(cbam_info_id){
      // ensure 'scrolling is SMOOTH'
      cbam_info_id.scrollIntoView({behavior : "smooth"})
    }
  }


  return (
    <div className="home-container">
      
      {/* SECTION 1: The Hero / Hook */}
      <section className="hero-section">
        <h1>Carbon Offset & Tariff Estimator</h1>
        <p className="subtitle">
          Calculate your global supply chain emissions and projected CBAM tariffs instantly.
          Plan greener, more cost-effective trade routes.
        </p>
        {/* The Call to Action button */}
        <button onClick={ScrollToInfoSection} className="cta-button">What's it About 👀</button>
      </section>

      {/* SECTION 2: The Explanation */}
      <section id = "cbam-info" className="info-section">
        <h2>What is the Carbon Tariff?</h2>
        <div className="info-content">
          <p>
            The European Union's <strong>Carbon Border Adjustment Mechanism (CBAM)</strong> levels the playing field. 
            If you manufacture goods in a country with low environmental regulations and export them to the EU, 
            you must pay a tax (tariff) equivalent to the carbon pollution created during production and transport.
          </p>
          <p>
            Our tool helps you visualize these hidden geopolitical costs before your cargo ever leaves the port.
          </p>
        </div>
      </section>

      {/* SECTION 3: Geopolitical Impact & Data */}
      <section className="stats-section">
        <h2>Global Trade Impact</h2>
        <p>The policies predominantly target high-emission sectors and major manufacturing hubs.</p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Top Affected Sectors</h3>
            <ul>
              <li>Iron & Steel</li>
              <li>Aluminum</li>
              <li>Cement & Fertilizers</li>
            </ul>
          </div>
          
          <div className="stat-card">
            <h3>Key Trade Partners</h3>
            <ul>
              <li>China</li>
              <li>India</li>
              <li>Turkey</li>
            </ul>
          </div>

          <div className="stat-card">
            <h3>Current EU Carbon Price</h3>
            <p className="massive-number">€85</p>
            <p>Per Ton of CO2 (Average)</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;