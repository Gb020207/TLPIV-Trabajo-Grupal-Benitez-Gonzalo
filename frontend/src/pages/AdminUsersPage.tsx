import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { usersApi } from "../api/auth.api";
import { ROLES, type AdminUser } from "../types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setUsers(await usersApi.list());
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar usuarios");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onRoleChange(user: AdminUser, e: ChangeEvent<HTMLSelectElement>) {
    try {
      await usersApi.assignRole(user.id, Number(e.target.value));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al asignar el rol");
    }
  }

  return (
    <>
      <h1>Usuarios</h1>
      {error && <p className="error">{error}</p>}
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Nombre</th><th>Email</th><th>Rol</th></tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.roleId} onChange={(e) => void onRoleChange(u, e)}>
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
