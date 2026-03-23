import { AxiosResponse } from "axios";

export const parseApiResponse = (response: AxiosResponse) => {

    const apiResponse = response.data;
  
    if (!apiResponse.success) {
      throw new Error(apiResponse.message);
    }
  
    return apiResponse.data;
  };