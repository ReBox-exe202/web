import axios from "axios";
import { getToken } from "@/lib/token";

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:7068/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
    // withCredentials: true,
});

axiosClient.interceptors.request.use(
    (config) => {
        try {
            const token = getToken();
            if (token && config && config.headers) {
                (config.headers as Record<string, string>)[
                    "Authorization"
                ] = `Bearer ${token}`;
            }
        } catch {}
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                const currentPath =
                    window.location.pathname + window.location.search;
                if (currentPath !== "/login") {
                    window.location.href = `/login?returnUrl=${encodeURIComponent(
                        currentPath
                    )}`;
                } else {
                    window.location.href = "/login";
                }
            }
            if (error.response.status === 403) {
                console.error("You have no permission on this");
                window.location.href = "/";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
