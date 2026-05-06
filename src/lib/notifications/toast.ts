import { create } from "zustand";

export type ToastType = "success" | "error";

export type ToastItem = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastState = {
  toasts: ToastItem[];
  pushToast: (toast: ToastItem) => void;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

const DEFAULT_TOAST_DURATION_MS = 2400;
const timers = new Map<string, ReturnType<typeof setTimeout>>();
let toastSequence = 0;

function clearToastTimer(id: string) {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
}

function scheduleToastDismiss(id: string, durationMs: number) {
  clearToastTimer(id);
  const timer = setTimeout(() => {
    useToastStore.getState().dismissToast(id);
  }, durationMs);
  timers.set(id, timer);
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  pushToast: (toast) =>
    set((state) => ({
      toasts: [toast, ...state.toasts],
    })),
  dismissToast: (id) => {
    clearToastTimer(id);
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
  clearToasts: () => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
    set({ toasts: [] });
  },
}));

function createToastId() {
  toastSequence += 1;
  return `toast-${Date.now()}-${toastSequence}`;
}

function normalizeToastMessage(message: string | undefined, fallback: string) {
  const trimmed = message?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function getMethodLabel(method?: string) {
  switch (method?.toLowerCase()) {
    case "get":
      return "load";
    case "post":
      return "save";
    case "put":
    case "patch":
      return "update";
    case "delete":
      return "delete";
    default:
      return "request";
  }
}

export function getSuccessToastFallback(method?: string) {
  switch (method?.toLowerCase()) {
    case "get":
      return "تم التحميل بنجاح";
    case "post":
      return "تم الحفظ بنجاح";
    case "put":
    case "patch":
      return "تم التحديث بنجاح";
    case "delete":
      return "تم الحذف بنجاح";
    default:
      return "اكتمل الطلب";
  }
}

export function getErrorToastFallback(method?: string, status?: number) {
  switch (status) {
    case 401:
      return "انتهت صلاحية الجلسة. الرجاء تسجيل الدخول مرة أخرى.";
    case 403:
      return "تم رفض الوصول.";
    case 404:
      return "المورد غير موجود.";
    case 429:
      return "أنت ترسل طلبات بسرعة كبيرة.";
    case 500:
      return "خطأ في الخادم.";
    default:
      break;
  }

  switch (method?.toLowerCase()) {
    case "get":
      return "فشل في تحميل البيانات.";
    case "post":
      return "فشل في حفظ التغييرات.";
    case "put":
    case "patch":
      return "فشل في تحديث التغييرات.";
    case "delete":
      return "فشل في حذف العنصر.";
    default:
      return "فشل الطلب.";
  }
}

export function notify(
  type: ToastType,
  message: string,
  options?: { durationMs?: number }
) {
  const id = createToastId();
  const toast: ToastItem = {
    id,
    type,
    message: message.trim(),
  };

  useToastStore.getState().pushToast(toast);
  scheduleToastDismiss(id, options?.durationMs ?? DEFAULT_TOAST_DURATION_MS);

  return id;
}

export function notifySuccess(
  message: string | undefined,
  method?: string,
  options?: { durationMs?: number }
) {
  return notify(
    "success",
    normalizeToastMessage(message, getSuccessToastFallback(method)),
    options
  );
}

export function notifyError(
  message: string | undefined,
  method?: string,
  status?: number,
  options?: { durationMs?: number }
) {
  return notify(
    "error",
    normalizeToastMessage(message, getErrorToastFallback(method, status)),
    options
  );
}

export function getToastMethodLabel(method?: string) {
  return getMethodLabel(method);
}