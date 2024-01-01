import axios from "axios";
import { BACKEND_URL } from "./constants";

export const axiosFetch = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true
});

axiosFetch.interceptors.request.use(
  (config) => {
    config.headers["authorization"] = `Bearer ${JSON.parse(
      localStorage.getItem("token")
    )}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosFetch.interceptors.response.use(
  (response) => {
    const cookieHeader = response.headers['Set-Cookie'];

    if (cookieHeader) {
      cookieHeader.forEach(cookie => {
        const parsedCookie = cookie.split(';')[0]; // Extract the cookie string
        const [cookieName, cookieValue] = parsedCookie.split('=');
        document.cookie = `${cookieName}=${cookieValue}`
      });
    }

    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
