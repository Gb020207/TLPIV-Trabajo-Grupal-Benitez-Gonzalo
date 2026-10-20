import { Route, Routes } from "react-router";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminUsersPage from "./pages/AdminUsersPage";
import BookDetailPage from "./pages/BookDetailPage";
import BookFormPage from "./pages/BookFormPage";
import BookListPage from "./pages/BookListPage";
import LoginPage from "./pages/LoginPage";
import NotificationsPage from "./pages/NotificationsPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Navbar />}>
          <Route index element={<BookListPage />} />
          <Route path="books/:id" element={<BookDetailPage />} />
          <Route
            path="books/new"
            element={
              <ProtectedRoute permission="book:create">
                <BookFormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="books/:id/edit"
            element={
              <ProtectedRoute permission="book:update">
                <BookFormPage />
              </ProtectedRoute>
            }
          />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route
            path="admin/users"
            element={
              <ProtectedRoute permission="user:read">
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}
