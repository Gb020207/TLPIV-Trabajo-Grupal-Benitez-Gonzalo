import { getJson, sendJson } from "./client";
import type { NotificationList } from "../types";

export function listNotifications(): Promise<NotificationList> {
  return getJson("/notifications");
}

export async function getUnreadCount(): Promise<number> {
  const result = await getJson<{ unreadCount: number }>(
    "/notifications/unread-count",
  );
  return result.unreadCount;
}

export function markNotificationRead(id: number): Promise<void> {
  return sendJson(`/notifications/${id}/read`, "PATCH");
}
