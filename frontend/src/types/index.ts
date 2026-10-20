export type BookStatus = "DISPONIBLE" | "PRESTADO" | "EN_REPARACION";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Book {
  id: number;
  title: string;
  description: string;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatus {
  subscribed: boolean;
}

export interface Notification {
  id: number;
  userId: number;
  bookId: number;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationList {
  notifications: Notification[];
  unreadCount: number;
}

export interface Role {
  id: number;
  name: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role: Role;
  createdAt: string;
  updatedAt: string;
}
