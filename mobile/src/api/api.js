import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.206:3000/api",
  timeout: 30000,
});

export default API;