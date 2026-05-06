import { router } from "expo-router";
import { notifyError } from "@/src/lib/notifications/toast";

export const handleApiError = (status?: number, detail?: string) => {
  const message = detail?.trim();
  switch (status) {
    case 401:
      notifyError(message, undefined, status);
      router.replace("/login");
      break;

    case 403:
      notifyError(message, undefined, status);
      break;

    case 400:
      notifyError(message, undefined, status);
      break;

    case 429:
      notifyError(message || "أنت ترسل طلبات بسرعة كبيرة.", undefined, status);
      break;

    case 500:
      notifyError(message || "خطأ في الخادم.", undefined, status);
      break;

    default:
      if (message) notifyError(message, undefined, status);
      break;
  }
};