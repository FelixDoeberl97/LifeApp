import { Link, useLocation } from "react-router-dom";
import { apiRequest } from "../api/apiClient.js";
import { useState } from "react";

export default function RegisterPage({ appName, loginPath, defaultReturnPath, onAuthenticated }) {
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const result = await apiRequest("/auth/register", {
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
      <h2>Register</h2>
      {errorMessage && <p className="error-message" data-testid="api-error">{errorMessage}</p>}
      <form className="form-grid single-column" onSubmit={handleSubmit}>
        <label>
          Email
          <input data-testid="register-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label>
          Password
          <input data-testid="register-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button data-testid="register-submit" type="submit">Register</button>
      </form>
      <p>Already registered? <Link to={loginPath} state={location.state}>Login</Link></p>
    </section>
  );
}
