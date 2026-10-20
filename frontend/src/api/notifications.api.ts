import type { AppNotification, NotificationInbox } from "../types";
import { apiFetch } from "./client";

export const notificationsApi = {
  list: () => apiFetch<NotificationInbox>("/notifications"),
  markAsRead: (id: number) =>
    apiFetch<AppNotification>(`/notifications/${id}/read`, { method: "PATCH" }),
};
