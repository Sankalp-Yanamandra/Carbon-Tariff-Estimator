import axios from "axios";

/*
    instead of writing "http://localhost:3000" or "https://logistics-api-k0wx.onrender.com/" in every file, 
    created 1 axios instance that always points to our backend : json server
*/
const api = axios.create({
  baseURL: "https://logistics-api-k0wx.onrender.com/"
});

export default api;