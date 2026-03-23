import { AxiosResponse } from "axios";
import { ApiResponse } from "../types/api-response";

export interface ParsedResponse<T> {
  data: T;
  meta?: ApiResponse<T>["meta"];
}

/**
 * Like parseApiResponse but preserves optional pagination meta from ApiResponse.
 */
export function parseApiResponseWithMeta<T>(
  response: AxiosResponse<ApiResponse<T>>
): ParsedResponse<T> {
  const apiResponse = response.data;

  if (!apiResponse.success) {
    throw new Error(apiResponse.message);
  }

  return {
    data: apiResponse.data,
    meta: apiResponse.meta,
  };
}
