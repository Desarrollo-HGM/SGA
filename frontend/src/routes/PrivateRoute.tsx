import { Navigate } from "react-router-dom";
import { useContext } from "react";
import type { ReactElement } from "react";
import { AuthContext } from "../context/AuthContext";
import type { User } from "../types/User";

interface ProtectedRouteProps {
  children: ReactElement; // 👈 más estricto que ReactNode
  allowedRoles: User["role"][];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);
  console.log("🛡️ ProtectedRoute check:", { user: auth?.user, allowedRoles });

  if (!auth?.user) {
    console.warn("🚫 ProtectedRoute: no hay usuario, redirigiendo a /");
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(auth.user.role)) {
    console.warn("🚫 ProtectedRoute: rol no permitido:", auth.user.role);
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ ProtectedRoute: acceso permitido, renderizando children");
  return children;
}

