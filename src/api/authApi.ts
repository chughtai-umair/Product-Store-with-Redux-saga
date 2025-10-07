import { UserCredentials, LoginResponse } from "../types";

export async function loginApi(
  credentials: UserCredentials
): Promise<LoginResponse> {
  const res = await fetch("https://reqres.in/api/users?page=1", {
    method: "POST",
    headers: {
      "x-api-key": "reqres-free-v1",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    // reqres returns 400 with { error: 'user not found' } or similar
    const err =
      (body && (body as any).error) || res.statusText || "Login failed";
    throw new Error(err);
  }

  return body as LoginResponse;
}
