// File:  lib/axios.js
import axios from "axios";

// Create a single Axios instance for our Next.js app
export const axiosInstance = axios.create({
    baseURL: "/",          // since we’ll call Next.js API routes (e.g. /api/auth/login)
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // send cookies (httpOnly) automatically
});

// Optional: You can add interceptors here if you want to handle 401 → refresh → retry logic.
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Example: if you get a 401 from the Next.js API, you might call /api/auth/refresh here,
        // then retry the original request. For now, just return Promise.reject.
        return Promise.reject(error);
    }
);
