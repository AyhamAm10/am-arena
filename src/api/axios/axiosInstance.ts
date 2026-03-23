import axios from "axios";
import { requestInterceptor } from "./requestInterceptor";
import { responseInterceptor } from "./responseInterceptor";
import { apiUrl } from "./api-url";

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(requestInterceptor);
axiosInstance.interceptors.response.use(
  responseInterceptor.onSuccess,
  responseInterceptor.onError
);

export default axiosInstance;