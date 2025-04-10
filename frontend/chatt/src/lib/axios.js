import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5002/api" : "/api", // make sure port is correct
  withCredentials: true, // ⬅️ crucial for sending cookies
});
