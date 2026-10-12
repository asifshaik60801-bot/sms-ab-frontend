import axios from "axios";

const api = axios.create({
  baseURL: "https://sms-ab-backend-xwfl.onrender.com",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("secureXToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;