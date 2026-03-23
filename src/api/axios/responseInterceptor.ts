import { AxiosResponse } from "axios";
import { handleApiError } from "./errorHandler";

export const responseInterceptor = {

  onSuccess: (response: AxiosResponse) => {
    return response;
  },

  onError: (error: any) => {

    const status = error.response?.status;

    handleApiError(status);

    return Promise.reject(error);
  }

};