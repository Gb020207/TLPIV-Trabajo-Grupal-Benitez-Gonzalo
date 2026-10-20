import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PermissionRoute } from "./components/PermissionRoute";
import { AdminUsersPage } from "./pages/AdminUsersPage";
import { BookDetailPage } from "./pages/BookDetailPage";
import { BookFormPage } from "./pages/BookFormPage";
import { BookListPage } from "./pages/BookListPage";
import { LoginPage } from "./pages/LoginPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { RegisterPage } from "./pages/RegisterPage";

function AuthenticatedLayout() {
  return (
    <>
      <Navbar />
      <main><Outlet /></main>
      <footer className="site-footer">Un buen libro siempre encuentra a sus lectores.</footer>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AuthenticatedLayout />}>
              <Route index element={<Navigate to="/books" replace />} />
              <Route path="/books" element={<BookListPage />} />
              <Route
                path="/books/new"
                element={
                  <PermissionRoute permission="book:create">
                    <BookFormPage />
                  </PermissionRoute>
                }
              />
              <Route path="/books/:id" element={<BookDetailPage />} />
              <Route
                path="/books/:id/edit"
                element={
                  <PermissionRoute permission="book:update">
                    <BookFormPage />
                  </PermissionRoute>
                }
              />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route
                path="/admin/users"
                element={
                  <PermissionRoute permission="user:read">
                    <AdminUsersPage />
                  </PermissionRoute>
                }
              />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/books" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
