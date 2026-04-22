import { router } from "expo-router";

export const handleApiError = (status?: number, detail?: string) => {
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

    case 429:
      console.log(
        detail?.trim() ||
          "Too many requests, please try again later."
      );
      break;

    case 500:
      console.log("Server error");
      break;

    default:
      break;
  }
};