import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { validateToken } from "../services/auth";

export default function Dashboard() {
  const { user, logout  } = useAuth();
  const [tokenStatus, setTokenStatus] = useState("Verificando...");

  useEffect(() => {
    const checkToken = async () => {
      try {
        const result = await validateToken();
        setTokenStatus(result.valid ? "Token activo ✅" : "Token inválido ❌");
      } catch {
        setTokenStatus("Token inválido ❌");
      }
    };
    checkToken();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Bienvenido, {user?.nombreCompleto || user?.username}</h2>
      <p>Has iniciado sesión correctamente.</p>
      <button className="btn btn-danger mt-3" onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  );
}