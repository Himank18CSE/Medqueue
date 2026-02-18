import axios from "axios";

const API = axios.create({
  baseURL: "https://medqueue-maj3.onrender.com",
});

export default API;
