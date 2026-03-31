import type { NotificationItemType } from "@/src/api/types/notification.types";

export type NotificationItemState = {
  id: number;
  type: NotificationItemType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
  onInvalidate?: () => void;
};

type InitState = {
  byId: Record<string, NotificationItemState>;
};

const store = (): InitState => ({
  byId: {},
});

export { store as InitState };
export type { InitState as NotificationItemInitState };
