import { router } from "expo-router";

export const handleApiError = (status?: number) => {
    switch (status) {
  
      case 401:
        router.replace("/login");
        break;
  
      case 403:
        console.log("Forbidden");
        break;
  
      case 400:
        console.log("Validation error");
        break;
  
      case 500:
        console.log("Server error");
        break;
  
      default:
        break;
    }
  };