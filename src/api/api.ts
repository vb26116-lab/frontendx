import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000",
  timeout: 100000,
});

api.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json";
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.message === "Network Error") {
      console.error("⚠️ Cannot reach the backend. Check server URL or CORS.");
    } else {
      console.error("API error:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default api;

export const staffLogin = (payload: { username: string; password: string }) => {
  console.log("Logging in with payload:", payload);
  return api.post("/login/", payload, {
    headers: { "Content-Type": "application/json" },
  });
};
