import "./setupAxiosWeb";
import axios from "axios";
import { Platform } from "react-native";
import { requestInterceptor } from "./requestInterceptor";
import { responseInterceptor } from "./responseInterceptor";
import { apiUrl } from "./api-url";

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
};

/** Native clients cannot rely on httpOnly cookies; ask API to return refresh tokens in JSON. */
if (Platform.OS !== "web") {
  defaultHeaders["X-Refresh-Token-Delivery"] = "body";
}

const axiosInstance = axios.create({
  baseURL: apiUrl,
  withCredentials: true,
  headers: defaultHeaders,
});

axiosInstance.interceptors.request.use(requestInterceptor);
axiosInstance.interceptors.response.use(
  responseInterceptor.onSuccess,
  responseInterceptor.onError
);

export default axiosInstance;