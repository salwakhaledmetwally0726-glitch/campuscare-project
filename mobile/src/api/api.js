import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.205:3000/api",
});

export default API;