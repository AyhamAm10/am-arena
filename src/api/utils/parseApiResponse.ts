import { AxiosResponse } from "axios";
import { ApiResponse } from "../types/api-response";

export const parseApiResponse = <T>(
  response: AxiosResponse<ApiResponse<T>>
): T => {
  const apiResponse = response.data;

  if (!apiResponse.success) {
    throw new Error(apiResponse.message);
  }

  return apiResponse.data;
};