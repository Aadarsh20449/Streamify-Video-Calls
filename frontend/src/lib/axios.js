import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001"
    : "https://streamify-video-calls-2-aht0.onrender.com";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, //send the cookies with the request
});
