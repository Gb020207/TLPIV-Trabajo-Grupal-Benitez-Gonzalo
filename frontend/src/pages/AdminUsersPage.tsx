import { useCallback, useEffect, useState } from "react";
import { assignRole, listRoles, listUsers } from "../api/users.api";
import type { AdminUser, Role } from "../types";

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [userRows, roleRows] = await Promise.all([listUsers(), listRoles()]);
    setUsers(userRows);
    setRoles(roleRows);
  }, []);

  useEffect(() => {
    let active = true;
    refresh()
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "No se pudieron cargar los usuarios");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [refresh]);

  async function changeRole(userId: number, roleId: number) {
    setError("");
    try {
      const updated = await assignRole(userId, roleId);
      setUsers((current) =>
        current.map((user) => (user.id === userId ? { ...user, ...updated } : user)),
      );
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudo cambiar el rol");
    }
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Administración</span>
          <h1>Personas y permisos.</h1>
          <p className="muted">Los cambios de rol se aplican al siguiente inicio de sesión.</p>
        </div>
      </div>
      {error && <p className="alert" role="alert">{error}</p>}
      {loading ? (
        <p className="empty-state">Cargando usuarios...</p>
      ) : (
        <div className="panel table-wrap">
          <table>
            <thead>
              <tr><th>Persona</th><th>Email</th><th>Rol actual</th><th>Asignar rol</th></tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td data-label="Persona">{user.name}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Rol actual"><span className="role-chip">{user.role.name}</span></td>
                  <td data-label="Asignar rol">
                    <select
                      aria-label={`Rol para ${user.name}`}
                      value={user.role.id}
                      onChange={(event) => void changeRole(user.id, Number(event.target.value))}
                    >
                      {roles.map((role) => (
                        <option key={role.id} value={role.id}>{role.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
