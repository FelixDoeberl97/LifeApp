import { Link, useLocation } from "react-router-dom";
import { apiRequest } from "../api/apiClient.js";
import { useState } from "react";

export default function LoginPage({ appName, registerPath, defaultReturnPath, onAuthenticated }) {
  const location = useLocation();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password123");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const result = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });
      onAuthenticated(result.token, location.state?.returnPath ?? defaultReturnPath);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <section className="auth-panel">
      <h1>{appName}</h1>
      <h2>Login</h2>
      {errorMessage && <p className="error-message" data-testid="api-error">{errorMessage}</p>}
      <form className="form-grid single-column" onSubmit={handleSubmit}>
        <label>
          Email
          <input data-testid="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input data-testid="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button data-testid="login-submit" type="submit">Login</button>
      </form>
      <p>Need an account? <Link to={registerPath} state={location.state}>Register</Link></p>
    </section>
  );
}
