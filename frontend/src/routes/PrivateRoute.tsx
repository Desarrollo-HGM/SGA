import { Navigate } from "react-router-dom";
import { useContext } from "react";
import type { ReactElement } from "react";
import { AuthContext } from "../context/AuthContext";
import type { User } from "../types/User";

interface ProtectedRouteProps {
  children: ReactElement;                                   
  allowedRoles: User["rol"][];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);
  

  if (!auth?.user) {
    console.warn("🚫 ProtectedRoute: no hay usuario, redirigiendo a /");
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(auth.user.rol)) {
    console.warn("🚫 ProtectedRoute: rol no permitido:", auth.user.rol);
    return <Navigate to="/dashboard" replace />;
  }

  
  return children;
}

