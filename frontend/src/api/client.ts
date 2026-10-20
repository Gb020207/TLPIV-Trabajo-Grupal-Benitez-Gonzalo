const apiBaseUrl = (
  import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"
).replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = localStorage.getItem("biblioteca.token");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (init.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = await response.text();
    let message = body || `La solicitud falló (${response.status})`;
    if (body) {
      try {
        const payload: unknown = JSON.parse(body);
        if (
          typeof payload === "object" &&
          payload !== null &&
          "message" in payload &&
          typeof payload.message === "string"
        ) {
          message = payload.message;
        }
      } catch {
        message = body;
      }
    }
    throw new ApiError(message, response.status);
  }

  return response;
}

export async function getJson<T>(path: string): Promise<T> {
  const response = await request(path);
  return (await response.json()) as T;
}

export async function sendJson<T>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  const response = await request(path, {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return (await response.json()) as T;
}

export async function send(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<void> {
  await request(path, {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
