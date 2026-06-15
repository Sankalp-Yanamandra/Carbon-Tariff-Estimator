import React from 'react'

function Home() {
  return (
    <div className="home-container">
      <h1>Carbon Offset & Tariff Estimator</h1>
      {/*
        CBAM stands for Carbon Border Adjustment Mechanism. 
        It is a policy introduced by the European Union to put a carbon-related cost on certain imported goods 
        so that foreign producers face a similar carbon price to producers within the EU. 
       */}
      <p>
        Calculate your global supply chain emissions and projected CBAM tariffs instantly.
        Plan greener, more cost-effective trade routes.
      </p>
    </div>
  );
}

export default Home;