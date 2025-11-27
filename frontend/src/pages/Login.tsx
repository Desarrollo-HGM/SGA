// src/pages/Login.tsx
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "../styles/login.css"; 

export default function Login() {
  const { login, user, token } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const { user, token } = await login(username, password);
    console.log("✅ Login correcto:", { user, token }); // 👈 log completo
    navigate("/dashboard");
  } catch {
    setError("Credenciales inválidas");
  }
};


  return (
    <div className="login-container">
  <div className="login-card">
    <img className="logo mb-3" src="/src/assets/hgm.png" alt="Logo HGM"  />
    <h4 className="mt-3 mb-4 fw-bold">Sistema de Gestión de Almacén</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label">Usuario</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3 text-start">
            <label className="form-label">Contraseña</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock-fill"></i>
              </span>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && <div className="text-danger mb-3">{error}</div>}

          <button type="submit" className="btn btn-primary w-100">
            CONTINUAR <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </form>
      </div>
    </div>
  );
}
