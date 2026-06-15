import axios from "axios";

/*
    instead of writing "http://localhost:3000" in every file, 
    created 1 axios instance that always points to our backend : json server
*/
const api = axios.create({
  baseURL: "http://localhost:3000"
});

export default api;