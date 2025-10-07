import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginRequest, logout } from "../redux/auth/authActions";

export default function Login() {
  const dispatch = useAppDispatch();
  const { loading, token, error } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    dispatch(loginRequest({ email, password }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto" }}>
      <h2>Login (Redux-Saga + TypeScript)</h2>

      {!token ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="eve.holt@reqres.in"
              type="email"
              required
            />
          </div>

          <div style={{ marginTop: 8 }}>
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="cityslicka"
              type="password"
              required
            />
          </div>

          <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <p style={{ marginTop: 12, fontSize: 12 }}>
            Demo creds: <br />
            email: <code>eve.holt@reqres.in</code> <br />
            password: <code>cityslicka</code>
          </p>
        </form>
      ) : (
        <div>
          <p>
            ✅ Logged in. Token: <code>{token}</code>
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}
