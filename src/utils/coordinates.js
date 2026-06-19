// longitude and latitudes
export const globalCoordinates = {
  // Asia
  "China": [35.8617, 104.1954],
  "Shanghai": [31.2304, 121.4737],
  "India": [20.5937, 78.9629],
  "Mumbai": [19.0760, 72.8777],
  "Vietnam": [14.0583, 108.2772],
  "Japan": [36.2048, 138.2529],
  "Taiwan": [23.6978, 120.9605],
  "South Korea": [35.9078, 127.7669],
  "Singapore": [1.3521, 103.8198],
  
  // Europe & Surrounding
  "Turkey": [38.9637, 35.2433],
  "Germany": [51.1657, 10.4515],
  "Hamburg": [53.5511, 9.9937],
  "France": [46.2276, 2.2137],
  "Netherlands": [52.1326, 5.2913],
  "Rotterdam": [51.9225, 4.4792],
  "UK": [55.3781, -3.4360],
  "Spain": [40.4637, -3.7492],
  "Greece": [39.0742, 21.8243],
  "Sweden": [60.1282, 18.6435],
  "Portugal": [39.3999, -8.2245],
  "Italy": [41.8719, 12.5674],
  "Ukraine": [48.3794, 31.1656],
  
  // Americas
  "USA": [37.0902, -95.7129],
  "New York": [40.7128, -74.0060],
  "Los Angeles": [34.0522, -118.2437],
  "Brazil": [-14.2350, -51.9253],
  "Mexico": [23.6345, -102.5528],
  "Canada": [56.1304, -106.3468],
  "Chile": [-35.6751, -71.5430],
  
  // Africa & Middle East
  "South Africa": [-30.5595, 22.9375],
  "UAE": [23.4241, 53.8478],
  "Dubai": [25.2048, 55.2708],
  "Morocco": [31.7917, -7.0926],
  "Egypt": [26.8206, 30.8025],

  // Oceania
  "Australia": [-25.2744, 133.7751]
};

// fn to safely fetch coordinates, defaulting to [0,0] if not found
export const getCoordinates = (locationName) => {
  if (!locationName) return [0, 0];
  
  // for case insensitivity
  const normalizedInput = locationName.trim().toLowerCase();
  
  // Search the dictionary 
  const matchedKey = Object.keys(globalCoordinates).find(
    (key) => key.toLowerCase() === normalizedInput
  );

  // Return the coordinates, or default to [0,0] (Null Island) if not found
  return matchedKey ? globalCoordinates[matchedKey] : [0, 0];
};