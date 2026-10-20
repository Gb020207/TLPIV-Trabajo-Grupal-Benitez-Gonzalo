export type BookStatus = "DISPONIBLE" | "PRESTADO" | "EN_REPARACION";

export const BOOK_STATUSES: readonly BookStatus[] = [
  "DISPONIBLE",
  "PRESTADO",
  "EN_REPARACION",
];

export interface Book {
  id: number;
  title: string;
  description: string;
  status: BookStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookInput {
  title: string;
  description: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

export interface Subscription {
  id: number;
  userId: number;
  bookId: number;
  book?: Book;
}

export interface AppNotification {
  id: number;
  userId: number;
  bookId: number;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationInbox {
  notifications: AppNotification[];
  unreadCount: number;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  roleId: number;
  role?: { name: string };
  createdAt: string;
}

/** El backend no expone un endpoint de roles; ids según el orden del seed. */
export const ROLES: readonly { id: number; name: string }[] = [
  { id: 1, name: "admin" },
  { id: 2, name: "operador" },
  { id: 3, name: "usuario" },
];
